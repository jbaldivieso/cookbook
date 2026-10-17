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

// Navbar burger toggle for mobile
function initNavbar() {
  // Burger menu toggle
  const burgers = document.querySelectorAll('.navbar-burger');
  burgers.forEach(burger => {
    burger.addEventListener('click', () => {
      const targetId = burger.dataset.target;
      const target = document.getElementById(targetId);
      burger.classList.toggle('is-active');
      target.classList.toggle('is-active');
    });
  });

  // Dropdown click-to-toggle for mobile
  const dropdowns = document.querySelectorAll('.navbar-item.has-dropdown');
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.navbar-link');
    link.addEventListener('click', (e) => {
      // Only toggle on mobile (when burger is visible)
      const burger = document.querySelector('.navbar-burger');
      if (window.getComputedStyle(burger).display !== 'none') {
        e.preventDefault();
        dropdown.classList.toggle('is-active');
      }
    });
  });
}

window.enableWakeLock = enableWakeLock;
window.initRecipeScaling = initRecipeScaling;
window.initListItemToggle = initListItemToggle;

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();

  // Register service worker for PWA support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});
