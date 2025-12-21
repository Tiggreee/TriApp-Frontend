export async function searchLocations(name) {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', name);
  url.searchParams.set('count', '5');

  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
  }));
}

export async function fetchCurrentWeather(lat, lon) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('current', 'temperature_2m,wind_speed_10m');

  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const data = await res.json();
  const c = data.current;
  if (!c) return null;
  return {
    temperature: c.temperature_2m,
    windSpeed: c.wind_speed_10m,
  };
}
