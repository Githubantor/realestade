// Same-origin by default: works with the Vite dev proxy locally
// and with the Vercel /api rewrite in production. Override with
// VITE_API_URL only if the API lives on a different origin.
const API_URL = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('elara_token');
}

function authHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  // Auth
  register: (payload) =>
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  login: (payload) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  me: () =>
    fetch(`${API_URL}/auth/me`, { headers: authHeaders() }).then(handleResponse),

  // Properties
  getProperties: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/properties${qs ? `?${qs}` : ''}`).then(handleResponse);
  },

  getProperty: (id) => fetch(`${API_URL}/properties/${id}`).then(handleResponse),

  createProperty: (payload) =>
    fetch(`${API_URL}/properties`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  updateProperty: (id, payload) =>
    fetch(`${API_URL}/properties/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  deleteProperty: (id) =>
    fetch(`${API_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),

  // Inquiries
  createInquiry: (payload) => {
    const headers = getToken() ? authHeaders() : { 'Content-Type': 'application/json' };
    return fetch(`${API_URL}/inquiries`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }).then(handleResponse);
  },

  getInquiries: () => fetch(`${API_URL}/inquiries`, { headers: authHeaders() }).then(handleResponse),

  // Favorites
  getFavorites: () => fetch(`${API_URL}/favorites`, { headers: authHeaders() }).then(handleResponse),

  addFavorite: (propertyId) =>
    fetch(`${API_URL}/favorites/${propertyId}`, {
      method: 'POST',
      headers: authHeaders(),
    }).then(handleResponse),

  removeFavorite: (propertyId) =>
    fetch(`${API_URL}/favorites/${propertyId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),

  // Health
  health: () => fetch(`${API_URL}/health`).then(handleResponse),
};

export { API_URL };
