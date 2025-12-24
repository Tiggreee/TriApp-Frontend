const API_URL = import.meta.env.VITE_API_BASE_URL;

export const signup = async (email, password, name) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Signup failed');
  }
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ email: data.email, name: data.name, _id: data._id }));
  return data;
};

export const signin = async (email, password) => {
  const response = await fetch(`${API_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ email: data.email, name: data.name, _id: data._id }));
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};
