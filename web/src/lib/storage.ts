function store(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = store()?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    store()?.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: the app keeps working without persistence
  }
}

export function readString(key: string): string | null {
  try {
    return store()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string): void {
  try {
    store()?.setItem(key, value);
  } catch {
    // see writeJSON
  }
}

export function remove(key: string): void {
  try {
    store()?.removeItem(key);
  } catch {
    // see writeJSON
  }
}
