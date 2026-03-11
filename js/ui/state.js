/* Centralised UI state transitions — all show/hide logic lives here so
   feature modules never scatter classList mutations across the codebase.
   Each function represents one complete, mutually-exclusive app state. */

export function showLoading() {
  document.getElementById('loadingState').classList.remove('hidden');
  document.getElementById('weatherCard').classList.add('hidden');
  document.getElementById('emptyState').classList.add('hidden');
  document.getElementById('errorMsg').classList.add('hidden');
}

export function showCard() {
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('weatherCard').classList.remove('hidden');
  document.getElementById('emptyState').classList.add('hidden');
}

export function showError(msg) {
  document.getElementById('loadingState').classList.add('hidden');
  const el = document.getElementById('errorMsg');
  // Target #errorText span to preserve the alert-circle Lucide SVG sibling in the error container
  document.getElementById('errorText').textContent = msg;
  el.classList.remove('hidden');
}

export function closeSuggestions() {
  document.getElementById('suggestions').classList.add('hidden');
}
