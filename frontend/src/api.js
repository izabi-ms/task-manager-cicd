const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Request failed.');
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  list: () => request('/tasks'),
  create: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  update: (id, task) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  updateStatus: (id, status) => request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id) => request(`/tasks/${id}`, { method: 'DELETE' })
};
