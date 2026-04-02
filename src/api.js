const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper for API calls
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('adminToken');
  const headers = { ...options.headers };

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

// ==================== AUTH ====================
export const authAPI = {
  login: (username, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),
  verify: () => request('/api/auth/verify'),
};

// ==================== FOUND ITEMS ====================
export const foundItemsAPI = {
  getAll: (search = '') =>
    request(`/api/items/found${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  create: (formData) =>
    request('/api/items/found', { method: 'POST', body: formData }),

  delete: (id) =>
    request(`/api/items/found/${id}`, { method: 'DELETE' }),
};

// ==================== LOST ITEMS (TICKETS) ====================
export const lostItemsAPI = {
  getAll: (search = '') =>
    request(`/api/items/lost${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  create: (formData) =>
    request('/api/items/lost', { method: 'POST', body: formData }),

  delete: (id) =>
    request(`/api/items/lost/${id}`, { method: 'DELETE' }),
};

// ==================== HANDOVER ====================
export const handoverAPI = {
  getAll: () => request('/api/items/handover'),

  create: (data) =>
    request('/api/items/handover', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  delete: (id) =>
    request(`/api/items/handover/${id}`, { method: 'DELETE' }),

  deliver: (id) =>
    request(`/api/items/deliver/${id}`, { method: 'POST' }),
};

// ==================== DELIVERED ====================
export const deliveredAPI = {
  getAll: () => request('/api/items/delivered'),
};

// ==================== STATS ====================
export const statsAPI = {
  get: () => request('/api/stats'),
};

// ==================== IMAGE UPLOAD ====================
export const uploadAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request('/api/upload', { method: 'POST', body: formData });
  },
};

// Helper to get full image URL
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE}${imagePath}`;
}
