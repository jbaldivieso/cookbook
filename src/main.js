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
let statusEl = null;
let gestureRetryArmed = false;

const GESTURE_EVENTS = ['pointerdown', 'touchend', 'keydown'];

const STATUS_TEXT = {
  active: 'Screen staying on',
  idle: 'Tap to keep screen on',
  denied: 'Tap to keep screen on',
  unsupported: 'Screen may sleep',
};

const STATUS_CLASS = {
  active: 'is-success',
  idle: 'is-warning',
  denied: 'is-warning',
  unsupported: 'is-light',
};

function setStatus(state, detail) {
  console.log('Wake lock:', state, detail || '');

  if (!statusEl) return;

  statusEl.textContent = STATUS_TEXT[state];
  statusEl.classList.remove('is-success', 'is-warning', 'is-light');
  statusEl.classList.add(STATUS_CLASS[state]);
  statusEl.hidden = false;
}

async function requestWakeLock() {
  if (!('wakeLock' in navigator)) {
    setStatus('unsupported');
    return false;
  }

  if (wakeLock) return true;

  try {
    wakeLock = await navigator.wakeLock.request('screen');
    setStatus('active');

    // Fires when the page is hidden, or when the system drops the lock. Do not
    // re-request from here: the document is typically already hidden by then and
    // the request would throw. Re-acquisition happens on the visibility path.
    wakeLock.addEventListener('release', () => {
      wakeLock = null;
      setStatus('idle');
    });

    return true;
  } catch (err) {
    wakeLock = null;
    setStatus('denied', `${err.name}: ${err.message}`);
    return false;
  }
}

// Some rejections (notably on iOS) clear once the user interacts with the page,
// so retry inside a real user gesture rather than giving up.
function armGestureRetry() {
  if (gestureRetryArmed || !('wakeLock' in navigator)) return;
  gestureRetryArmed = true;

  const retry = async () => {
    GESTURE_EVENTS.forEach(evt => document.removeEventListener(evt, retry));
    gestureRetryArmed = false;

    if (!wakeLockEnabled) return;

    const acquired = await requestWakeLock();
    if (!acquired) armGestureRetry();
  };

  GESTURE_EVENTS.forEach(evt => document.addEventListener(evt, retry, { once: true }));
}

async function reacquireWakeLock() {
  if (!wakeLockEnabled) return;
  if (document.visibilityState !== 'visible') return;
  if (wakeLock) return;

  const acquired = await requestWakeLock();
  if (!acquired) armGestureRetry();
}

function initStatusBadge() {
  statusEl = document.getElementById('wake-lock-status');
  if (!statusEl) return;

  statusEl.addEventListener('click', () => {
    if (!wakeLock) reacquireWakeLock();
  });
}

// Called only from the recipe layout, so navigational pages never take a lock.
async function enableWakeLock() {
  if (wakeLockEnabled) return;
  wakeLockEnabled = true;

  initStatusBadge();

  document.addEventListener('visibilitychange', reacquireWakeLock);
  // iOS restores pages from the back/forward cache without always firing
  // visibilitychange, so listen for pageshow too.
  window.addEventListener('pageshow', reacquireWakeLock);

  const acquired = await requestWakeLock();
  if (!acquired) armGestureRetry();
}

// Recipe scaling functionality
function initRecipeScaling() {
  const scalingTabs = document.querySelectorAll('.scaling-tabs');

  if (scalingTabs.length === 0) return;

  const pagePath = window.location.pathname;

  scalingTabs.forEach(tabsContainer => {
    const sectionId = tabsContainer.dataset.sectionId;
    const storageKey = `recipe-scale:${pagePath}:${sectionId}`;

    // Find the ingredients section (content between this h2 and next h2)
    const heading = document.getElementById(sectionId);
    if (!heading) return;

    const scalableElements = getScalableElementsForSection(heading);

    // Restore saved scale
    const savedScale = localStorage.getItem(storageKey);
    if (savedScale) {
      const scale = parseInt(savedScale, 10);
      if ([1, 2, 3].includes(scale)) {
        applyScale(scalableElements, scale);
        updateActiveTab(tabsContainer, scale);
      }
    }

    // Add click handlers to tabs
    const tabItems = tabsContainer.querySelectorAll('li[data-scale]');
    tabItems.forEach(tab => {
      tab.addEventListener('click', () => {
        const scale = parseInt(tab.dataset.scale, 10);

        // Update UI
        tabItems.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        // Apply scaling
        applyScale(scalableElements, scale);

        // Persist
        localStorage.setItem(storageKey, scale.toString());
      });
    });
  });
}

// Get all scalable <code> elements between a heading and the next h2
function getScalableElementsForSection(heading) {
  const elements = [];
  let sibling = heading.nextElementSibling;

  while (sibling && sibling.tagName !== 'H2') {
    const codes = sibling.querySelectorAll('code[data-scalable="true"]');
    codes.forEach(code => elements.push(code));
    sibling = sibling.nextElementSibling;
  }

  return elements;
}

// Apply scale factor to all scalable elements
function applyScale(elements, scale) {
  elements.forEach(el => {
    const original = parseInt(el.dataset.originalValue, 10);
    const scaled = original * scale;
    el.textContent = `${scaled}g`;
  });
}

// Update active state on tabs
function updateActiveTab(tabsContainer, scale) {
  const tabItems = tabsContainer.querySelectorAll('li[data-scale]');
  tabItems.forEach(tab => {
    if (parseInt(tab.dataset.scale, 10) === scale) {
      tab.classList.add('is-active');
    } else {
      tab.classList.remove('is-active');
    }
  });
}

// Toggle strikethrough on list items
function initListItemToggle() {
  const listItems = document.querySelectorAll('.content li:not([data-scale])');

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
