const storage = typeof window !== 'undefined' ? window.localStorage : null;

export function loadList(key) {
  if (!storage) return [];
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveList(key, list) {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(list.slice(0, 10)));
  } catch (e) {
    // ignore
  }
}

export function addHistory(key, query) {
  if (!query) return [];
  const current = loadList(key);
  const next = [query, ...current.filter((q) => q !== query)].slice(0, 10);
  saveList(key, next);
  return next;
}

export function toggleFavorite(key, item, idGetter) {
  const current = loadList(key);
  const id = idGetter(item);
  const exists = current.find((x) => idGetter(x) === id);
  const next = exists ? current.filter((x) => idGetter(x) !== id) : [item, ...current];
  saveList(key, next);
  return next;
}
