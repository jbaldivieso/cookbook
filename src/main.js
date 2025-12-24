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

window.enableWakeLock = enableWakeLock;
