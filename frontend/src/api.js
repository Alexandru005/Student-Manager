import { buildPrompt, parseAiTask } from './ai';
import { AI_ENDPOINT, AI_REQUEST_FIELD, API_URL } from './constants';
import { toApiDate } from './utils';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (e) {
    // anulările (AbortError / TimeoutError) le tratează cine a făcut cererea
    if (e.name === 'AbortError' || e.name === 'TimeoutError') throw e;
    throw new Error(`Nu mă pot conecta la server (${API_URL}). Verifică dacă backend-ul rulează.`);
  }

  if (!res.ok) {
    const error = new Error(`Serverul a răspuns cu eroarea ${res.status}. Încearcă din nou.`);
    error.status = res.status;
    throw error;
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

/**
 * Trimite mesajul către AIController și întoarce task-ul propus (nesalvat):
 * { title, description, category, status, dueTime }. Cererea se oprește singură după 60 de secunde.
 */
export async function generateTask(text, { signal } = {}) {
  const timeout = AbortSignal.timeout(60_000);
  const combined = signal && AbortSignal.any ? AbortSignal.any([signal, timeout]) : (signal ?? timeout);

  let data;
  try {
    data = await request(AI_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({ [AI_REQUEST_FIELD]: buildPrompt(text) }),
      signal: combined,
    });
  } catch (e) {
    if (e.name === 'TimeoutError') throw new Error('AI-ul a durat prea mult să răspundă. Încearcă din nou.');
    if (e.name === 'AbortError') throw e;
    if (e.status === 404) throw new Error(`Nu găsesc ${AI_ENDPOINT} în backend. Verifică ruta din AIController.`);
    if (e.status === 400) throw new Error('Serverul a refuzat mesajul (400). Verifică validările din AITaskRequest.');
    if (e.status >= 500) {
      throw new Error(
        `Serverul a dat eroare (${e.status}). Uită-te în consola Spring: de obicei e o problemă la configurarea modelului sau a cheii API.`,
      );
    }
    throw e;
  }
  return parseAiTask(data);
}
