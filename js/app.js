import { geocodeCity } from './api/geocoding.js';
import { fetchWeather } from './api/weather.js';
import { renderCurrent, renderForecast } from './ui/render.js';
import { showLoading, showCard, showError, closeSuggestions } from './ui/state.js';

/* ═══════════════════════════════════════════════════════════
   CORE WEATHER LOAD
   Orchestrates: state → fetch → render → state
═══════════════════════════════════════════════════════════ */
async function loadWeather(lat, lon, label) {
  closeSuggestions();
  showLoading();
  try {
    const data = await fetchWeather(lat, lon);
    renderCurrent(data, label);
    renderForecast(data);
    showCard();
  } catch {
    showError('Could not load weather data. Please try again.');
  }
}

/* ═══════════════════════════════════════════════════════════
   SEARCH — SHOW GEOCODING SUGGESTIONS
═══════════════════════════════════════════════════════════ */
async function searchCity(query) {
  if (!query.trim()) return;
  try {
    const results = await geocodeCity(query);
    const box = document.getElementById('suggestions');

    if (!results.length) {
      box.innerHTML = `<div class="suggestion-item" style="pointer-events:none;opacity:0.6">No results found</div>`;
      box.classList.remove('hidden');
      return;
    }

    box.innerHTML = '';
    results.forEach(r => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.setAttribute('role', 'option');
      // Show admin region + country for disambiguation when multiple cities share a name
      const label = [r.name, r.admin1, r.country].filter(Boolean).join(', ');
      item.textContent = label;
      item.addEventListener('click', () => {
        document.getElementById('searchInput').value = r.name;
        loadWeather(r.latitude, r.longitude, label);
      });
      box.appendChild(item);
    });
    box.classList.remove('hidden');
  } catch {
    showError('Search failed. Please check your connection.');
  }
}

/* ═══════════════════════════════════════════════════════════
   GEOLOCATION — load the user's own location on first visit
   so the app is immediately useful without typing anything
═══════════════════════════════════════════════════════════ */
function initGeolocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    async pos => {
      const { latitude, longitude } = pos.coords;
      try {
        // Open-Meteo geocoding doesn't support reverse lookup; show generic label as fallback
        await loadWeather(latitude, longitude, 'My Location');
      } catch {
        // Silent fail — user can still search manually
      }
    },
    () => { /* User denied location — no error shown; search bar guides them */ }
  );
}

/* ═══════════════════════════════════════════════════════════
   DEBOUNCE — avoid firing geocoding API on every keystroke
═══════════════════════════════════════════════════════════ */
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ═══════════════════════════════════════════════════════════
   EVENT WIRING
═══════════════════════════════════════════════════════════ */
const debouncedSearch = debounce(q => searchCity(q), 350);

document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.trim();
  if (q.length >= 2) debouncedSearch(q);
  else document.getElementById('suggestions').classList.add('hidden');
});

document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (q) searchCity(q);
  }
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const q = document.getElementById('searchInput').value.trim();
  if (q) searchCity(q);
});

// Close suggestions when clicking anywhere outside the search wrapper
document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrapper')) closeSuggestions();
});

// Attempt geolocation immediately for first-visit value
initGeolocation();
// Process the static <i data-lucide="cloud-sun"> in the empty-state HTML
lucide.createIcons();