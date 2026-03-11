/* Open-Meteo Forecast API
   Endpoint: https://api.open-meteo.com/v1/forecast
   - current: live conditions (temperature, apparent, humidity, wind, weather_code, is_day)
   - daily:   7-day min/max temp + dominant weather code
   - timezone=auto: server resolves timezone from coordinates so local day boundaries are correct */
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    wind_speed_unit: 'kmh',
    timezone: 'auto',
    forecast_days: 7,
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather request failed');
  return res.json();
}