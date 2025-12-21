import { useState } from 'react';
import { searchLocations, fetchCurrentWeather } from '../features/weather/api';
import { SearchCity } from '../features/weather/components/SearchCity';
import { LocationList } from '../features/weather/components/LocationList';

export default function Weather() {
  const [items, setItems] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSearch(q) {
    if (!q) return;
    setLoading(true);
    const res = await searchLocations(q);
    setItems(res);
    setWeather(null);
    setLoading(false);
  }

  async function onPick(loc) {
    setLoading(true);
    const w = await fetchCurrentWeather(loc.latitude, loc.longitude);
    setWeather(w);
    setLoading(false);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SearchCity onSearch={onSearch} />
      {loading && <div>Loading…</div>}
      {!loading && <LocationList items={items} onPick={onPick} />}
      {weather && (
        <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8 }}>
          <div><strong>Temperature:</strong> {weather.temperature} °C</div>
          <div><strong>Wind:</strong> {weather.windSpeed} m/s</div>
        </div>
      )}
    </div>
  );
}
