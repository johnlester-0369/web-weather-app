/* Open-Meteo Geocoding API
   Endpoint: https://geocoding-api.open-meteo.com/v1/search
   Resolves a city name string → array of { name, country, admin1, latitude, longitude }
   Returns empty array on no results so callers can handle the zero-results UX
   without catching; throws only on network failure so callers can surface errors. */
export async function geocodeCity(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding request failed');
  const data = await res.json();
  return data.results ?? [];
}