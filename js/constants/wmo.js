/* WMO Weather Interpretation Codes
   Source: https://open-meteo.com/en/docs — "WMO Weather Code"
   Centralised here so any module that needs weather labels or icon names
   imports from one authoritative source rather than duplicating the map. */
export const WMO = {
  0:  { label: 'Clear sky',          day: 'sun',              night: 'moon' },
  1:  { label: 'Mainly clear',       day: 'sun',              night: 'moon' },
  2:  { label: 'Partly cloudy',      day: 'cloud-sun',        night: 'cloud-moon' },
  3:  { label: 'Overcast',           day: 'cloud',            night: 'cloud' },
  45: { label: 'Fog',                day: 'cloud-fog',        night: 'cloud-fog' },
  48: { label: 'Icy fog',            day: 'cloud-fog',        night: 'cloud-fog' },
  51: { label: 'Light drizzle',      day: 'cloud-drizzle',    night: 'cloud-drizzle' },
  53: { label: 'Drizzle',            day: 'cloud-drizzle',    night: 'cloud-drizzle' },
  55: { label: 'Heavy drizzle',      day: 'cloud-drizzle',    night: 'cloud-drizzle' },
  61: { label: 'Light rain',         day: 'cloud-rain',       night: 'cloud-rain' },
  63: { label: 'Rain',               day: 'cloud-rain',       night: 'cloud-rain' },
  65: { label: 'Heavy rain',         day: 'cloud-rain',       night: 'cloud-rain' },
  71: { label: 'Light snow',         day: 'cloud-snow',       night: 'cloud-snow' },
  73: { label: 'Snow',               day: 'cloud-snow',       night: 'cloud-snow' },
  75: { label: 'Heavy snow',         day: 'cloud-snow',       night: 'cloud-snow' },
  77: { label: 'Snow grains',        day: 'cloud-snow',       night: 'cloud-snow' },
  80: { label: 'Light showers',      day: 'cloud-rain',       night: 'cloud-rain' },
  81: { label: 'Rain showers',       day: 'cloud-rain',       night: 'cloud-rain' },
  82: { label: 'Heavy showers',      day: 'cloud-lightning',  night: 'cloud-lightning' },
  85: { label: 'Snow showers',       day: 'cloud-snow',       night: 'cloud-snow' },
  86: { label: 'Heavy snow showers', day: 'cloud-snow',       night: 'cloud-snow' },
  95: { label: 'Thunderstorm',       day: 'cloud-lightning',  night: 'cloud-lightning' },
  96: { label: 'Thunderstorm + hail',day: 'cloud-lightning',  night: 'cloud-lightning' },
  99: { label: 'Thunderstorm + hail',day: 'cloud-lightning',  night: 'cloud-lightning' },
};

// Normalise any undocumented WMO code to a safe fallback so callers
// never need to guard against undefined icon names downstream
export function getWeatherMeta(code, isDay = 1) {
  const entry = WMO[code] ?? { label: 'Unknown', day: 'thermometer', night: 'thermometer' };
  return { label: entry.label, icon: isDay ? entry.day : entry.night };
}