import { getWeatherMeta } from '../constants/wmo.js';
import { formatDay, round } from '../utils/format.js';

/* window.lucide is set by the UMD <script> in index.html <head>.
   ES modules are deferred by spec, so the UMD bundle always executes first —
   lucide.createIcons() is safe to call here without any guard. */

export function renderCurrent(data, locationLabel) {
  const c = data.current;
  const { label, icon } = getWeatherMeta(c.weather_code, c.is_day);
  const units = data.current_units;

  // innerHTML required (not textContent) to inject the map-pin <i data-lucide> tag inline
  document.getElementById('locationName').innerHTML = `<i data-lucide="map-pin"></i>${locationLabel}`;
  // Lucide SVGs must be injected via innerHTML — textContent would render the tag as a literal string
  document.getElementById('weatherEmoji').innerHTML = `<i data-lucide="${icon}"></i>`;
  document.getElementById('tempMain').textContent = `${round(c.temperature_2m)}${units.temperature_2m}`;
  document.getElementById('weatherLabel').textContent = label;
  document.getElementById('feelsLike').textContent = `${round(c.apparent_temperature)}${units.apparent_temperature}`;
  document.getElementById('humidity').textContent = `${c.relative_humidity_2m}${units.relative_humidity_2m}`;
  document.getElementById('windSpeed').textContent = `${round(c.wind_speed_10m)} km/h`;
  lucide.createIcons();
}

/* Bar width derived from how each day's range sits within the global week
   min–max, giving the user visual temperature context across the full 7-day span */
export function renderForecast(data) {
  const daily = data.daily;
  const allMin = Math.min(...daily.temperature_2m_min);
  const allMax = Math.max(...daily.temperature_2m_max);
  const span = allMax - allMin || 1; // avoid div-by-zero for uniform-temperature weeks

  const list = document.getElementById('forecastList');
  list.innerHTML = '';

  daily.time.forEach((date, i) => {
    const min = daily.temperature_2m_min[i];
    const max = daily.temperature_2m_max[i];
    const code = daily.weather_code[i];
    const { icon } = getWeatherMeta(code, 1); // daily forecast always uses the day variant

    // Left offset + width together represent this day's range relative to the week span
    const leftPct  = ((min - allMin) / span) * 100;
    const widthPct = ((max - min) / span) * 100;

    const row = document.createElement('div');
    row.className = 'forecast-day';
    row.innerHTML = `
      <span class="day-label">${formatDay(date)}</span>
      <span class="day-emoji"><i data-lucide="${icon}"></i></span>
      <div class="range-bar-wrapper">
        <div class="range-bar-fill" style="left:${leftPct.toFixed(1)}%;width:${Math.max(widthPct, 8).toFixed(1)}%"></div>
      </div>
      <span class="day-temps">
        <span class="temp-min">${round(min)}°</span>
        &thinsp;/&thinsp;${round(max)}°
      </span>
    `;
    list.appendChild(row);
  });
  // Process all <i data-lucide="..."> inserted by the forEach above in one batch
  lucide.createIcons();
}
