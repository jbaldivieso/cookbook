import 'bulma/css/bulma.min.css';
import './custom.css';

// Prevent device from going to sleep on recipe pages
let wakeLock = null;

async function enableWakeLock() {
  if (!('wakeLock' in navigator)) {
    console.log('Wake Lock API not supported');
    return;
  }

  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake lock activated');

    wakeLock.addEventListener('release', () => {
      console.log('Wake lock released');
      wakeLock = null;
    });
  } catch (err) {
    console.error('Wake lock error:', err.name, err.message);
  }
}

// Re-acquire wake lock when page becomes visible
function handleVisibilityChange() {
  if (document.visibilityState === 'visible' && wakeLock === null) {
    enableWakeLock();
  }
}

// Set up visibility change listener
if ('wakeLock' in navigator) {
  document.addEventListener('visibilitychange', handleVisibilityChange);
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
