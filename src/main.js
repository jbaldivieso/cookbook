import 'bulma/css/bulma.min.css';
import './custom.css';

// Prevent device from going to sleep on recipe pages.
//
// The Screen Wake Lock API is the only mechanism used. The silent-video trick
// that used to live here does not work in an iOS home-screen web app (see
// WebKit bug 254545), and the API itself has been supported in installed PWAs
// since iOS 18.4.
let wakeLock = null;
let wakeLockEnabled = false;
let pendingRequest = null;
let switchEl = null;
let gestureRetryArmed = false;

const GESTURE_EVENTS = ['pointerdown', 'touchend', 'keydown'];

// The switch reads "on" only while a lock is actually held. "off" means the
// cook turned it off; "idle" and "denied" mean we want a lock but lack one.
function setStatus(state, detail) {
  console.log('Wake lock:', state, detail || '');

  if (!switchEl) return;

  const unsupported = state === 'unsupported';
  switchEl.setAttribute('aria-checked', String(state === 'active'));
  switchEl.disabled = unsupported;
  switchEl.querySelector('.wake-switch-label').textContent =
    unsupported ? 'Screen may sleep' : 'Keep screen on';
  switchEl.hidden = false;
}

async function requestWakeLock() {
  if (!('wakeLock' in navigator)) {
    setStatus('unsupported');
    return false;
  }

  if (wakeLock) return true;
  if (pendingRequest) return pendingRequest;

  pendingRequest = (async () => {
    try {
      const lock = await navigator.wakeLock.request('screen');
      wakeLock = lock;
      setStatus('active');

      // Fires when the page is hidden, or when the system drops the lock. Do not
      // re-request from here: the document is typically already hidden by then and
      // the request would throw. Re-acquisition happens on the visibility path.
      lock.addEventListener('release', () => {
        if (wakeLock === lock) wakeLock = null;
        setStatus(wakeLockEnabled ? 'idle' : 'off');
      });

      return true;
    } catch (err) {
      wakeLock = null;
      setStatus('denied', `${err.name}: ${err.message}`);
      return false;
    } finally {
      pendingRequest = null;
    }
  })();

  return pendingRequest;
}

// Some rejections (notably on iOS) clear once the user interacts with the page,
// so retry inside a real user gesture rather than giving up. Taps on the switch
// itself are left to its own click handler.
function armGestureRetry() {
  if (gestureRetryArmed || !('wakeLock' in navigator)) return;
  gestureRetryArmed = true;

  const retry = async (event) => {
    if (switchEl && switchEl.contains(event.target)) return;

    GESTURE_EVENTS.forEach(evt => document.removeEventListener(evt, retry));
    gestureRetryArmed = false;

    if (!wakeLockEnabled) return;

    const acquired = await requestWakeLock();
    if (!acquired) armGestureRetry();
  };

  GESTURE_EVENTS.forEach(evt => document.addEventListener(evt, retry));
}

async function reacquireWakeLock() {
  if (!wakeLockEnabled) return;
  if (document.visibilityState !== 'visible') return;
  if (wakeLock) return;

  const acquired = await requestWakeLock();
  if (!acquired) armGestureRetry();
}

function initWakeSwitch() {
  switchEl = document.getElementById('wake-lock-switch');
  if (!switchEl) return;

  // Show it right away (off) rather than waiting on the first request, which
  // can take a while to settle.
  switchEl.hidden = false;

  switchEl.addEventListener('click', async () => {
    if (wakeLock) {
      wakeLockEnabled = false;
      await wakeLock.release();
      return;
    }

    wakeLockEnabled = true;
    const acquired = await requestWakeLock();
    if (!acquired) armGestureRetry();
  });
}

// Called only from the recipe layout, so navigational pages never take a lock.
async function enableWakeLock() {
  if (wakeLockEnabled) return;
  wakeLockEnabled = true;

  initWakeSwitch();

  document.addEventListener('visibilitychange', reacquireWakeLock);
  // iOS restores pages from the back/forward cache without always firing
  // visibilitychange, so listen for pageshow too.
  window.addEventListener('pageshow', reacquireWakeLock);

  const acquired = await requestWakeLock();
  if (!acquired) armGestureRetry();
}

// Recipe scaling functionality
function initRecipeScaling() {
  const controls = document.querySelectorAll('.scale-control');

  if (controls.length === 0) return;

  const pagePath = window.location.pathname;

  controls.forEach(control => {
    const sectionId = control.dataset.sectionId;
    const storageKey = `recipe-scale:${pagePath}:${sectionId}`;

    // The control lives in its ingredients section's heading row
    const section = control.closest('section');
    if (!section) return;

    const scalableElements = section.querySelectorAll('code[data-scalable="true"]');
    const buttons = control.querySelectorAll('button[data-scale]');

    const selectScale = scale => {
      applyScale(scalableElements, scale);
      buttons.forEach(button => {
        button.setAttribute('aria-pressed', String(parseInt(button.dataset.scale, 10) === scale));
      });
    };

    // Restore saved scale
    const savedScale = localStorage.getItem(storageKey);
    if (savedScale) {
      const scale = parseInt(savedScale, 10);
      if ([1, 2, 3].includes(scale)) {
        selectScale(scale);
      }
    }

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const scale = parseInt(button.dataset.scale, 10);
        selectScale(scale);
        localStorage.setItem(storageKey, scale.toString());
      });
    });
  });
}

// Apply scale factor to all scalable elements
function applyScale(elements, scale) {
  elements.forEach(el => {
    const original = parseInt(el.dataset.originalValue, 10);
    const scaled = original * scale;
    el.innerHTML = `${scaled}<span class="unit">g</span>`;
  });
}

// Toggle strikethrough on list items. In a timeline only the actions cross
// off; rests, day breaks and the time editor don't, nor do taps on its buttons.
function initListItemToggle() {
  const listItems = document.querySelectorAll('.recipe-body li');

  listItems.forEach(li => {
    if (li.closest('.tl') && !li.classList.contains('tl-act')) return;
    li.addEventListener('click', event => {
      if (event.target.closest('button')) return;
      li.classList.toggle('completed');
    });
  });
}

// Timing timeline: pin any step to a time of day and work every other step
// out from it. The rows, their durations and the total come from the build
// (recipeSections in .eleventy.js); this adds the clock column, the planning
// controls and the live "now" marker.
const MINUTE = 60 * 1000;
// The night runs from 9 PM to 6 AM, in minutes after midnight
const NIGHT_START = 21 * 60;
const NIGHT_END = 6 * 60;
const MOON = '<svg class="tl-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1Z"/></svg>';

const clockFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
const weekdayFormat = new Intl.DateTimeFormat(undefined, { weekday: 'long' });

const escapeHTML = text => text.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const roundTo5 = time => Math.round(time / (5 * MINUTE)) * 5 * MINUTE;

function clockParts(time, exact) {
  const parts = clockFormat.formatToParts(new Date(exact ? time : roundTo5(time)));
  const hm = parts.filter(p => p.type === 'hour' || p.type === 'minute' || p.type === 'literal' && !/^\s+$/.test(p.value))
    .map(p => p.value).join('');
  const period = parts.find(p => p.type === 'dayPeriod');
  return { hm, ap: period ? period.value : '' };
}

function clockHTML(time, exact) {
  const { hm, ap } = clockParts(time, exact);
  return ap ? `${hm}<span class="ap">${ap}</span>` : hm;
}

function clockText(time, exact) {
  const { hm, ap } = clockParts(time, exact);
  return ap ? `${hm} ${ap}` : hm;
}

// "5 h 10 min", to the nearest five minutes
function spanText(minutes) {
  const rounded = Math.round(minutes / 5) * 5;
  const h = Math.floor(rounded / 60), m = rounded % 60;
  return [h && `${h} h`, (m || !h) && `${m} min`].filter(Boolean).join(' ');
}

// Calendar days from a to b, in local time
function dayDiff(a, b) {
  const day = time => { const d = new Date(time); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
  return Math.round((day(b) - day(a)) / (24 * 60 * MINUTE));
}

function dayName(time) {
  const diff = dayDiff(Date.now(), time);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  return weekdayFormat.format(new Date(time));
}

function isNight(time) {
  const d = new Date(roundTo5(time));
  const minutes = d.getHours() * 60 + d.getMinutes();
  return minutes >= NIGHT_START || minutes < NIGHT_END;
}

// The first moment at or after time when the night is over
function nextMorning(time) {
  const d = new Date(time);
  d.setHours(NIGHT_END / 60, 0, 0, 0);
  if (d.getTime() < time) d.setDate(d.getDate() + 1);
  return d.getTime();
}

// The last slot before the night starts, at or before time
function lastEvening(time) {
  const d = new Date(time);
  d.setHours(NIGHT_START / 60, 0, 0, 0);
  if (d.getTime() > time) d.setDate(d.getDate() - 1);
  return d.getTime() - 5 * MINUTE;
}

function initTimeline() {
  document.querySelectorAll('.is-timeline').forEach(mountTimeline);
}

function mountTimeline(section) {
  const list = section.querySelector('[data-timeline]');
  const controls = section.querySelector('.tl-controls');
  const status = section.querySelector('.tl-status');
  if (!list || !controls || !status) return;

  // Durations in minutes, read back from the build's data attributes
  const rows = [...list.children];
  const endRow = rows.pop();
  const items = rows.map(li => li.classList.contains('tl-rest')
    ? { kind: 'rest', li, approx: li.classList.contains('is-approx'),
        lo: +li.dataset.lo, hi: +li.dataset.hi, mid: +li.dataset.mid }
    : { kind: 'act', li, mid: +li.dataset.dur, short: escapeHTML(li.dataset.short) });
  const END = items.length;
  const total = items.reduce((sum, item) => sum + item.mid, 0);
  const firstAct = items.findIndex(item => item.kind === 'act');
  // Rests alone leave nothing to start, so the timeline stays static
  if (firstAct < 0) return;
  const rowFor = node => (node === END ? endRow : items[node].li);
  const nameOf = node => (node === END ? 'Done' : items[node].short);

  // The build's rows, Done included; a saved plan with a different count is stale
  const rowCount = items.length + 1;
  const storageKey = `recipe-plan:${window.location.pathname}`;
  const s = { mode: 'idle', anchor: null, editing: null };
  let plan = null;

  const elastic = item => item && item.kind === 'rest' && item.hi - item.lo >= 60;
  // Whether an approximate rest lies between two steps, making the time an estimate
  const approxBetween = (a, b) => items.slice(Math.min(a, b), Math.max(a, b))
    .some(item => item.kind === 'rest' && item.approx);

  // Start time of every item (and of Done), working out from the pinned step.
  // An elastic rest stretches or shrinks within its span when that keeps the
  // action on its far side out of the night.
  function schedule() {
    if (!s.anchor) {
      plan = null;
      return;
    }
    const t = [];
    const dur = items.map(item => item.mid * MINUTE);
    const stretched = {};
    const win = {};
    const a = s.anchor.node;
    const pick = (item, options) => options.filter(d => d >= item.lo * MINUTE && d <= item.hi * MINUTE)
      .sort((x, y) => Math.abs(x - item.mid * MINUTE) - Math.abs(y - item.mid * MINUTE))[0];

    t[a] = s.anchor.time;
    for (let k = a; k < END; k++) {
      const item = items[k];
      if (elastic(item) && items[k + 1] && items[k + 1].kind === 'act') {
        const x = t[k] + item.mid * MINUTE;
        if (isNight(x)) {
          const d = pick(item, [nextMorning(x) - t[k], lastEvening(x) - t[k]]);
          if (d !== undefined) {
            dur[k] = d;
            stretched[k] = true;
          }
        }
        win[k + 1] = [t[k] + item.lo * MINUTE, t[k] + item.hi * MINUTE];
      }
      t[k + 1] = t[k] + dur[k];
    }
    for (let k = a - 1; k >= 0; k--) {
      const item = items[k];
      if (elastic(item) && k > 0 && items[k - 1].kind === 'act') {
        const mid = item.mid * MINUTE;
        const y = t[k + 1] - mid - dur[k - 1];
        if (isNight(y)) {
          const d = pick(item, [mid - (nextMorning(y) - y), mid + (y - lastEvening(y))]);
          if (d !== undefined) {
            dur[k] = d;
            stretched[k] = true;
          }
        }
        win[k - 1] = [t[k + 1] - item.hi * MINUTE - dur[k - 1], t[k + 1] - item.lo * MINUTE - dur[k - 1]];
      }
      t[k] = t[k + 1] - dur[k];
    }
    plan = { t, dur, stretched, win };
  }

  const timeOf = node => plan.t[node];

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        node: s.anchor.node, time: new Date(s.anchor.time).toISOString(), count: rowCount
      }));
    } catch (err) {
      // Private browsing can refuse storage; the plan just won't survive a reload
    }
  }

  function forget() {
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      // Nothing was stored
    }
  }

  function restore() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(storageKey));
    } catch (err) {
      return;
    }
    if (!saved) return;
    const time = Date.parse(saved.time);
    // A different number of rows means the recipe was edited since
    if (saved.count !== rowCount || !(saved.node >= 0 && saved.node <= END) || isNaN(time)) {
      forget();
      return;
    }
    s.anchor = { node: saved.node, time };
    schedule();
    if (timeOf(END) < Date.now() - 24 * 60 * MINUTE) {
      s.anchor = null;
      plan = null;
      forget();
      return;
    }
    s.mode = 'planned';
  }

  function statusHTML() {
    if (s.mode === 'idle') {
      return `About <b>${spanText(total)}</b> start to finish. Pin any step to a time of day to plan the rest.`;
    }
    if (s.mode === 'pick') {
      return s.editing
        ? 'Pick a time for this step; everything else follows from it.'
        : 'Tap the step you want to pin to a time.';
    }

    const now = Date.now();
    const start = timeOf(0);
    const end = timeOf(END);
    const parts = [];

    if (now >= start && now < end) {
      const next = items.findIndex((item, i) => item.kind === 'act' && timeOf(i) > now);
      const node = next >= 0 ? next : END;
      parts.push(`<b>${nameOf(node)}</b> in about <b>${spanText((timeOf(node) - now) / MINUTE)}</b>, ` +
        `around ${clockText(timeOf(node))}.`);
    }

    const nights = items.map((item, i) => (item.kind === 'act' && isNight(timeOf(i)) ? i : -1)).filter(i => i >= 0);
    const at = i => `<b>${items[i].short}</b> at <b>${approxBetween(i, s.anchor.node) ? '~' : ''}` +
      `${clockText(timeOf(i), i === s.anchor.node)}</b>`;
    if (nights.length >= 3) {
      parts.push(`${MOON}<b>${nights.length} steps</b> land in the night, starting with ${at(nights[0])}. ` +
        'Try pinning a different time.');
    } else if (nights.length) {
      parts.push(`${MOON}${nights.map(at).join(' and ')} ${nights.length > 1 ? 'land' : 'lands'} in the night. ` +
        'Try pinning a different time.');
    } else {
      if (now < start) parts.push(`Starts in <b>${spanText((start - now) / MINUTE)}</b>.`);
      parts.push(`Done around <b>${clockText(end)} ${dayName(end)}</b>.`);
    }
    return parts.join(' ');
  }

  function clockCell(node) {
    if (s.mode === 'pick') {
      const editing = s.editing && s.editing.node === node;
      return `<button type="button" class="slot" data-pin="${node}" aria-label="Pin ${nameOf(node)} to a time">` +
        `${editing ? clockParts(s.editing.time, true).hm : 'Set'}</button>`;
    }
    if (s.mode !== 'planned') return '';
    const exact = s.anchor.node === node;
    const est = !exact && approxBetween(node, s.anchor.node) ? '<span class="est">~</span>' : '';
    const spoken = `${est ? 'about ' : ''}${clockText(timeOf(node), exact)}`;
    return `<button type="button" class="clock" data-pin="${node}" aria-label="${nameOf(node)}, ${spoken}. Change time">` +
      `${est}${clockHTML(timeOf(node), exact)}</button>`;
  }

  const windowHTML = node => (plan && plan.win[node]
    ? `<span class="win" data-js>Window <b>${clockText(plan.win[node][0])}</b> – <b>${clockText(plan.win[node][1])}</b></span>`
    : '');

  function render() {
    schedule();
    const planned = s.mode === 'planned';
    const now = Date.now();

    list.querySelectorAll('.tl-day, .tl-ed, [data-js]').forEach(el => el.remove());
    list.classList.toggle('has-clock', s.mode !== 'idle');

    let lastDay = null;
    const dayBreak = node => {
      if (!planned) return;
      const date = new Date(roundTo5(timeOf(node)));
      if (date.toDateString() === lastDay) return;
      lastDay = date.toDateString();
      rowFor(node).insertAdjacentHTML('beforebegin', '<li class="tl-day" aria-hidden="true"><div class="t"></div>' +
        `<div class="r"></div><div class="c"><span class="dlab">${weekdayFormat.format(date)}</span></div></li>`);
    };

    const actionRow = (li, node) => {
      dayBreak(node);
      const t = planned ? timeOf(node) : null;
      const isAction = node !== END;
      const night = planned && isAction && isNight(t);
      const current = planned && isAction && now >= t && now < t + Math.max(items[node].mid * MINUTE, MINUTE);
      li.classList.toggle('is-anchor', planned && s.anchor.node === node);
      li.classList.toggle('is-night', night);
      li.classList.toggle('is-current', current);
      li.classList.toggle('is-editing', !!(s.editing && s.editing.node === node));
      li.querySelector('.t').innerHTML = clockCell(node);
      const content = li.querySelector('.c');
      if (night) content.insertAdjacentHTML('beforeend', `<span class="flag" data-js>${MOON}In the night</span>`);
      if (planned) content.insertAdjacentHTML('beforeend', windowHTML(node));
    };

    items.forEach((item, i) => {
      if (item.kind === 'act') {
        actionRow(item.li, i);
        return;
      }
      const content = item.li.querySelector('.c');
      if (!planned) return;
      if (plan.stretched[i]) {
        const next = s.anchor.node > i ? items[i - 1] : items[i + 1];
        content.insertAdjacentHTML('beforeend', `<span class="win" data-js>Planned at <b>${spanText(plan.dur[i] / MINUTE)}</b> ` +
          `to keep ${next.short.toLowerCase()} out of the night</span>`);
      }
      const a = plan.t[i], b = plan.t[i + 1];
      if (now >= a && now < b) {
        item.li.insertAdjacentHTML('beforeend', `<div class="nowtick" data-js style="--at:${((now - a) / (b - a)) * 100}%">` +
          `<span>${clockHTML(now, true)}</span><i></i></div>`);
      }
    });
    actionRow(endRow, END);

    if (s.editing) openEditor();

    controls.innerHTML = '<button type="button" data-start>Start now</button>' + (
      s.mode === 'idle' ? '<button type="button" data-plan>Plan</button>'
        : s.mode === 'pick' ? '<button type="button" data-cancel>Cancel</button>'
          : '<button type="button" data-clear>Clear</button>');
    const html = statusHTML();
    if (status.innerHTML !== html) status.innerHTML = html;
  }

  // The editor updates itself in place, so focus stays put while stepping
  function openEditor() {
    const { node } = s.editing;
    const name = nameOf(node);
    rowFor(node).insertAdjacentHTML('afterend', `<li class="tl-ed" role="group" aria-label="Pin ${name} to a time">
      <div class="ed-head"><b>${name}</b> at</div>
      <div class="ed-row"><button type="button" class="stp" data-step="-15" aria-label="15 minutes earlier">−15</button>
        <label class="ed-time"><span class="ed-readout"></span><input type="time" aria-label="Time for ${name}"></label>
        <button type="button" class="stp" data-step="15" aria-label="15 minutes later">+15</button></div>
      <div class="ed-row"><div class="seg">
        <button type="button" data-day="0">Today</button>
        <button type="button" data-day="1">Tomorrow</button></div>
        <button type="button" class="ghost" data-now>Now</button></div>
      <div class="ed-row"><button type="button" class="go" data-set>Set</button>` +
        '<button type="button" class="cancel" data-cancel-edit>Cancel</button></div></li>');
    updateEditor();
  }

  function updateEditor() {
    const editor = list.querySelector('.tl-ed');
    if (!editor) return;
    const { time, node } = s.editing;
    const d = new Date(time);
    editor.querySelector('.ed-readout').innerHTML = clockHTML(time, true);
    editor.querySelector('input').value =
      `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const diff = dayDiff(Date.now(), time);
    editor.querySelectorAll('[data-day]').forEach(button => {
      button.setAttribute('aria-pressed', String(+button.dataset.day === diff));
    });
    const slot = rowFor(node).querySelector('.slot');
    if (slot) slot.textContent = clockParts(time, true).hm;
  }

  function closeEditor() {
    const { node } = s.editing;
    s.editing = null;
    if (s.anchor) s.mode = 'planned';
    render();
    const button = rowFor(node).querySelector('.t button');
    if (button) button.focus();
  }

  section.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const d = button.dataset;
    const now = Date.now();

    if ('start' in d) {
      s.anchor = { node: firstAct, time: now };
      s.mode = 'planned';
      s.editing = null;
      save();
    } else if ('plan' in d) {
      s.mode = 'pick';
    } else if ('cancel' in d) {
      s.mode = s.anchor ? 'planned' : 'idle';
      s.editing = null;
    } else if ('clear' in d) {
      s.anchor = null;
      s.mode = 'idle';
      s.editing = null;
      forget();
    } else if ('pin' in d) {
      const node = +d.pin;
      const step = 15 * MINUTE;
      const time = s.mode === 'planned' ? roundTo5(timeOf(node)) : Math.ceil(now / step) * step;
      s.mode = 'pick';
      s.editing = { node, time };
      render();
      list.querySelector('.tl-ed input').focus();
      return;
    } else if ('step' in d) {
      s.editing.time += +d.step * MINUTE;
      updateEditor();
      return;
    } else if ('day' in d) {
      const date = new Date(now);
      const from = new Date(s.editing.time);
      date.setDate(date.getDate() + +d.day);
      date.setHours(from.getHours(), from.getMinutes(), 0, 0);
      s.editing.time = date.getTime();
      updateEditor();
      return;
    } else if ('now' in d) {
      s.editing.time = now;
      updateEditor();
      return;
    } else if ('set' in d) {
      s.anchor = s.editing;
      save();
      closeEditor();
      return;
    } else if ('cancelEdit' in d) {
      closeEditor();
      return;
    } else {
      return;
    }
    // Rebuilding the controls drops focus, so hand it to the button in the same place
    const place = [...controls.children].indexOf(button);
    render();
    if (place >= 0) controls.children[place].focus();
  });

  list.addEventListener('input', event => {
    if (!event.target.matches('.tl-ed input') || !event.target.value) return;
    const [hours, minutes] = event.target.value.split(':').map(Number);
    const date = new Date(s.editing.time);
    date.setHours(hours, minutes, 0, 0);
    s.editing.time = date.getTime();
    updateEditor();
  });

  list.addEventListener('keydown', event => {
    if (event.key === 'Escape' && s.editing && event.target.closest('.tl-ed')) {
      event.preventDefault();
      closeEditor();
    }
  });

  // Live mode: keep the countdown and the now marker current while the page is
  // in view, and catch up as soon as it comes back (say, after the screen slept)
  const tick = () => {
    if (s.mode !== 'planned' || s.editing || document.visibilityState !== 'visible') return;
    // Re-rendering replaces the clock buttons, so hand focus to the new one
    const focused = list.contains(document.activeElement) ? document.activeElement.dataset.pin : undefined;
    render();
    if (focused !== undefined) list.querySelector(`[data-pin="${focused}"]`).focus();
  };
  setInterval(tick, 30 * 1000);
  document.addEventListener('visibilitychange', tick);

  restore();
  controls.hidden = false;
  render();
}

// Homepage catalog: one tab per top-level category, plus a find field that
// matches recipe names across every tab. The chosen tab lives in the URL hash
// (so breadcrumbs can link to it) and is remembered for the next visit.
const CATALOG_TAB_KEY = 'catalog-tab';

function initCatalog() {
  const root = document.getElementById('catalog');
  if (!root) return;

  const tablist = root.querySelector('[role="tablist"]');
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('.catalog-panel')];
  const find = root.querySelector('.catalog-find');
  const input = find.querySelector('input');
  const clear = find.querySelector('.catalog-clear');
  const status = root.querySelector('.catalog-status');
  if (!tabs.length) return;

  const rows = [...root.querySelectorAll('.catalog-list li')].map(li => {
    const name = li.querySelector('.catalog-name');
    return { li, name, text: name.textContent };
  });

  panels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${panel.dataset.panel}`);
  });
  root.classList.add('is-tabbed');
  tablist.hidden = false;
  find.hidden = false;

  const hasTab = slug => tabs.some(tab => tab.dataset.tab === slug);
  let current = tabs[0].dataset.tab;

  function render() {
    const query = input.value.trim();
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const searching = terms.length > 0;

    root.classList.toggle('is-searching', searching);
    clear.hidden = !searching;

    tabs.forEach(tab => {
      const selected = tab.dataset.tab === current;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    let matches = 0;
    rows.forEach(row => {
      const lower = row.text.toLowerCase();
      const match = !searching || terms.every(term => lower.includes(term));
      row.li.hidden = !match;
      if (searching && match) matches++;
      highlightName(row, searching && match ? terms : null);
    });

    root.querySelectorAll('.catalog-group').forEach(group => {
      group.hidden = searching && !group.querySelector('li:not([hidden])');
    });
    panels.forEach(panel => {
      panel.hidden = searching
        ? !panel.querySelector('li:not([hidden])')
        : panel.dataset.panel !== current;
    });

    status.textContent = '';
    if (searching && matches === 0) {
      status.append(`No recipe names contain \u201c${query}\u201d. `,
        'Names only: try part of a word, or clear the search.');
    } else if (searching) {
      const count = document.createElement('b');
      count.textContent = `${matches} ${matches === 1 ? 'recipe' : 'recipes'}`;
      status.append(count,
        ` ${matches === 1 ? 'has' : 'have'} \u201c${query}\u201d in the name, across all tabs.`);
    }
  }

  function selectTab(slug, { focus = false } = {}) {
    current = hasTab(slug) ? slug : tabs[0].dataset.tab;
    input.value = '';
    render();

    history.replaceState(null, '', `#${current}`);
    try {
      localStorage.setItem(CATALOG_TAB_KEY, current);
    } catch (err) {
      // Private browsing can refuse storage; the hash still carries the tab
    }

    if (focus) tabs.find(tab => tab.dataset.tab === current).focus();
    // With the tabs pinned to the bottom of a phone, a new list starts at the top
    if (window.scrollY > 0 && getComputedStyle(tablist).position === 'fixed') {
      window.scrollTo(0, 0);
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab));
    tab.addEventListener('keydown', event => {
      const last = tabs.length - 1;
      const target = {
        ArrowLeft: index - 1, ArrowUp: index - 1,
        ArrowRight: index + 1, ArrowDown: index + 1,
        Home: 0, End: last
      }[event.key];
      if (target === undefined) return;
      event.preventDefault();
      const wrapped = (target + tabs.length) % tabs.length;
      selectTab(tabs[wrapped].dataset.tab, { focus: true });
    });
  });

  input.addEventListener('input', render);
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      input.value = '';
      render();
    } else if (event.key === 'Enter') {
      // A single match is as good as a tap on it
      const visible = rows.filter(row => !row.li.hidden);
      if (input.value.trim() && visible.length === 1) {
        window.location.href = visible[0].li.querySelector('a').href;
      }
    }
  });
  clear.addEventListener('click', () => {
    input.value = '';
    render();
    input.focus();
  });

  window.addEventListener('hashchange', () => {
    const slug = window.location.hash.slice(1);
    if (hasTab(slug) && slug !== current) selectTab(slug);
  });

  let stored = null;
  try {
    stored = localStorage.getItem(CATALOG_TAB_KEY);
  } catch (err) {
    // Fall through to the first tab
  }
  const fromHash = window.location.hash.slice(1);
  current = [fromHash, stored].find(hasTab) || tabs[0].dataset.tab;
  // The browser may restore a typed query on back navigation; render honors it
  render();
}

// Wrap each matched term in the recipe name in <mark>, or restore plain text
function highlightName(row, terms) {
  row.name.textContent = '';
  if (!terms) {
    row.name.textContent = row.text;
    return;
  }

  const escaped = terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  row.text.split(pattern).forEach((part, i) => {
    if (!part) return;
    if (i % 2) {
      const mark = document.createElement('mark');
      mark.textContent = part;
      row.name.append(mark);
    } else {
      row.name.append(part);
    }
  });
}

window.enableWakeLock = enableWakeLock;
window.initRecipeScaling = initRecipeScaling;
window.initListItemToggle = initListItemToggle;
window.initTimeline = initTimeline;
window.initCatalog = initCatalog;

document.addEventListener('DOMContentLoaded', () => {
  // Register service worker for PWA support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});
