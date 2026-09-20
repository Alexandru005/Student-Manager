// Adresa backend-ului. Controller-ul are @RequestMapping("/tasks"), iar comentariile
// din cod folosesc /api/tasks, deci presupun context-path=/api. Schimbă din .env dacă e altfel.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

// `value` este textul trimis către backend și folosit la filtrare (?status=...).
// Dacă în baza ta de date statusurile arată altfel (ex: "To Do", "In Progress"), schimbă doar `value`.
// `key` e folosit intern; comparația cu ce vine din backend ignoră majusculele, spațiile și "_".
export const STATUSES = [
  { key: 'todo', value: 'TODO', label: 'De făcut' },
  { key: 'inprogress', value: 'IN_PROGRESS', label: 'În lucru' },
  { key: 'done', value: 'DONE', label: 'Finalizat' },
];
