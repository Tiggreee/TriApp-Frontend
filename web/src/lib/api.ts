import { readString, remove, writeJSON, writeString } from './storage';

const API_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000';

export interface User {
  _id: string;
  email: string;
  name: string;
  premium: boolean;
}

export type FavoriteType = 'music' | 'color' | 'avatar' | 'makeup' | 'consejos' | 'game';

export interface Favorite<T = Record<string, unknown>> {
  _id: string;
  type: FavoriteType;
  data: T;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';
const UNAUTHORIZED_EVENT = 'triapp:unauthorized';

export const getToken = () => readString(TOKEN_KEY);

export function saveSession(token: string, user: User) {
  writeString(TOKEN_KEY, token);
  writeJSON(USER_KEY, user);
}

export function clearSession() {
  remove(TOKEN_KEY);
  remove(USER_KEY);
}

export function onUnauthorized(handler: () => void) {
  window.addEventListener(UNAUTHORIZED_EVENT, handler);
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(0, 'No pudimos conectar con el servidor. Intenta de nuevo.');
  }

  if (!res.ok) {
    if (res.status === 401 && token) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(res.status, body?.message ?? 'Algo salió mal');
  }
  return (await res.json()) as T;
}

type Session = User & { token: string };

export const signup = (email: string, password: string, name: string) =>
  request<Session>('/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) });

export const signin = (email: string, password: string) =>
  request<Session>('/signin', { method: 'POST', body: JSON.stringify({ email, password }) });

export const fetchMe = () => request<User>('/users/me');

export const listFavorites = () => request<Favorite[]>('/favorites');

export const createFavorite = (type: FavoriteType, data: Record<string, unknown>) =>
  request<Favorite>('/favorites', { method: 'POST', body: JSON.stringify({ type, data }) });

export const deleteFavorite = (id: string) =>
  request<{ message: string }>(`/favorites/${id}`, { method: 'DELETE' });

export const startCheckout = () =>
  request<{ url: string }>('/billing/checkout', { method: 'POST' });
