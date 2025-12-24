const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function getFavorites() {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return [];
    }

    if (!response.ok) throw new Error('Failed to fetch favorites');
    return await response.json();
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

export async function addFavorite(type, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ type, data }),
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }

    if (!response.ok) throw new Error('Failed to add favorite');
    return await response.json();
  } catch (error) {
    console.error('Error adding favorite:', error);
    return null;
  }
}

export async function removeFavorite(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }

    if (!response.ok) throw new Error('Failed to remove favorite');
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
}
