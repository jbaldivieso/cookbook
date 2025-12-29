import 'bulma/css/bulma.min.css';
import './custom.css';

// Prevent device from going to sleep on recipe pages
function enableWakeLock() {
  if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').catch(() => {
      // Silently ignore errors (unsupported, user denial, etc.)
    });
  }
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

window.enableWakeLock = enableWakeLock;
window.initRecipeScaling = initRecipeScaling;
window.initListItemToggle = initListItemToggle;
