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

// ---------------------------------------------------------------------------
// Asistentul AI (butonul rotund din colțul dreapta-jos)
// ---------------------------------------------------------------------------

// Ruta din AIController: @RequestMapping("/ai") + @PostMapping("/get-response")
export const AI_ENDPOINT = '/ai/get-response';

// Numele câmpului din AITaskRequest (record AITaskRequest(String userPrompt))
export const AI_REQUEST_FIELD = 'userPrompt';

export const AI_MAX_CHARS = 1000;

// Prompt-ul din backend nu îi spune modelului ce dată e azi, deci "mâine" sau "vineri" nu pot fi calculate.
// Cât timp e true, frontend-ul adaugă data curentă la începutul mesajului trimis.
// Când o pui în prompt-ul din backend, poți pune false.
export const AI_SEND_DATE_CONTEXT = true;
