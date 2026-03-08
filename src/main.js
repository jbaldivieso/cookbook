import 'bulma/css/bulma.min.css';
import './custom.css';

// Prevent device from going to sleep on recipe pages
let wakeLock = null;
let wakeLockEnabled = false;
let noSleepVideo = null;

async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return false;

  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake lock activated');

    wakeLock.addEventListener('release', () => {
      console.log('Wake lock released');
      wakeLock = null;
      // Re-acquire if still enabled and page is visible
      if (wakeLockEnabled && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    });
    return true;
  } catch (err) {
    console.error('Wake lock error:', err.name, err.message);
    return false;
  }
}

// Fallback for iOS: play a silent video in a loop to prevent sleep
function enableNoSleepFallback() {
  if (noSleepVideo) return;

  noSleepVideo = document.createElement('video');
  noSleepVideo.setAttribute('playsinline', '');
  noSleepVideo.setAttribute('muted', '');
  noSleepVideo.muted = true;
  noSleepVideo.loop = true;
  noSleepVideo.style.position = 'fixed';
  noSleepVideo.style.top = '-1px';
  noSleepVideo.style.left = '-1px';
  noSleepVideo.style.width = '1px';
  noSleepVideo.style.height = '1px';
  noSleepVideo.style.opacity = '0.01';

  // Minimal silent MP4 (base64-encoded)
  // This is a tiny valid MP4 with a silent audio track
  const silentMp4 = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAAhtZGF0AAAA' +
    'MmWIhAAV//73ye/Apuv5xPASMCHgU3AAAWAAAAMA8gAAAAwAADqYAAAF2hSRnxAAAAARl' +
    'BQXFhYWJI4IoYuKiosLExsbHBwdHR4eIiIqKjIyOjo+PkREVFRkZHR0fHyIiKioyMjo6P' +
    'j5ERFRUZGRBAAAABlibXZoZAAAAAAAAAAAAAAAAAAAA+gAAAPoAAEAAAEAAAAAAAAAAAAAAAAB' +
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAB0XRyYWsAAABcdGtoZAAA' +
    'AAMAAAAAAAAAAAAAAAEAAAAAAAAPoAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAA' +
    'AAAAAAAAAAAAAAAAAAAAIAAB1W1kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAAKAAAACgAVcQA' +
    'AAAAALdoZGxyAAAAAAAAAABzb3VuAAAAAAAAAAAAAAAAU291bmRIYW5kbGVyAAAAARBtaW5m' +
    'AAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAA' +
    'ANBzdGJsAAAAZHN0c2QAAAAAAAAAAQAAAFRtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAA' +
    'KAAAAAAAAAAAAAAAAAAAAAAAABgZXNkcwAAAAADgICAIQACAASAgIATQBUAAAAAA4CAgAWA' +
    'gIABAAAAFHN0dHMAAAAAAAAAAQAAAAEAAAAoAAAAFHN0c2MAAAAAAAAAAQAAAAEAAAABAQAA' +
    'ABRzdHN6AAAAAAAAAAYAAAABAAAAFHNtb28AAAAAAAAAAQAAAAE=';

  noSleepVideo.src = silentMp4;
  document.body.appendChild(noSleepVideo);

  const playPromise = noSleepVideo.play();
  if (playPromise) {
    playPromise.then(() => {
      console.log('NoSleep fallback video playing');
    }).catch(() => {
      // Autoplay blocked — will retry on user interaction
      console.log('NoSleep fallback: autoplay blocked, waiting for user interaction');
      const startOnInteraction = () => {
        if (noSleepVideo && wakeLockEnabled) {
          noSleepVideo.play().catch(() => {});
        }
        document.removeEventListener('touchstart', startOnInteraction);
        document.removeEventListener('click', startOnInteraction);
      };
      document.addEventListener('touchstart', startOnInteraction, { once: true });
      document.addEventListener('click', startOnInteraction, { once: true });
    });
  }
}

function disableNoSleepFallback() {
  if (noSleepVideo) {
    noSleepVideo.pause();
    noSleepVideo.remove();
    noSleepVideo = null;
  }
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

async function enableWakeLock() {
  wakeLockEnabled = true;

  const acquired = await requestWakeLock();

  // On iOS, the Wake Lock API may be supported but unreliable —
  // use the video fallback as well
  if (isIOS()) {
    enableNoSleepFallback();
  } else if (!acquired) {
    // Fallback for browsers without Wake Lock API support
    enableNoSleepFallback();
  }
}

// Re-acquire wake lock when page becomes visible
function handleVisibilityChange() {
  if (document.visibilityState === 'visible' && wakeLockEnabled) {
    if (wakeLock === null) {
      requestWakeLock();
    }
    // Restart video fallback if needed on iOS
    if (isIOS() && noSleepVideo && noSleepVideo.paused) {
      noSleepVideo.play().catch(() => {});
    }
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

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
