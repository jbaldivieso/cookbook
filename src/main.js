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

// Toggle strikethrough on list items
function initListItemToggle() {
  const listItems = document.querySelectorAll('.recipe-body li');

  listItems.forEach(li => {
    li.addEventListener('click', () => {
      li.classList.toggle('completed');
    });
  });
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
window.initCatalog = initCatalog;

document.addEventListener('DOMContentLoaded', () => {
  // Register service worker for PWA support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});
