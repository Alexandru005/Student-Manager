import { API_URL } from './constants';
import { toApiDate } from './utils';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error(`Nu mă pot conecta la server (${API_URL}). Verifică dacă backend-ul rulează.`);
  }

  if (!res.ok) {
    throw new Error(`Serverul a răspuns cu eroarea ${res.status}. Încearcă din nou.`);
  }

  // DELETE întoarce corp gol, așa că nu apelăm direct res.json()
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const getTasks = () => request('/tasks');

export function getFilteredTasks(filters) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.category) params.set('category', filters.category);
  if (filters.dueTimeMin) params.set('dueTimeMin', toApiDate(filters.dueTimeMin));
  if (filters.dueTimeMax) params.set('dueTimeMax', toApiDate(filters.dueTimeMax));
  return request(`/tasks/filter?${params}`);
}

export const createTask = (task) =>
  request('/tasks', { method: 'POST', body: JSON.stringify(task) });

export const updateTask = (id, task) =>
  request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) });

export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' });
