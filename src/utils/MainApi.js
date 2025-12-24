const API_URL = import.meta.env.VITE_API_BASE_URL;

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse(res) {
  if (res.ok) return res.json();
  const error = await res.json();
  throw new Error(error.message || 'Request failed');
}

export const signup = (email, password, name) => {
  return fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password, name }),
  }).then(handleResponse);
};

export const signin = (email, password) => {
  return fetch(`${API_URL}/signin`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
};

export const getCurrentUser = () => {
  return fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: getHeaders(),
  }).then(handleResponse);
};

export const getFavorites = () => {
  return fetch(`${API_URL}/favorites`, {
    method: 'GET',
    headers: getHeaders(),
  }).then(handleResponse);
};

export const createFavorite = (type, data) => {
  return fetch(`${API_URL}/favorites`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ type, data }),
  }).then(handleResponse);
};

export const deleteFavorite = (id) => {
  return fetch(`${API_URL}/favorites/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);
};
