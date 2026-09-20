# Student Manager — frontend

React + Vite. Se conectează la backend-ul Spring Boot (`TaskController`).

## Pornire

```bash
npm install
npm run dev        # http://localhost:5173
```

Backend-ul trebuie să ruleze pe `http://localhost:8080` (CORS-ul din controller e deja setat pentru 5173).

## Ce trebuie să verifici

1. **Adresa API** — `src/constants.js` (sau `.env` cu `VITE_API_URL`). Implicit: `http://localhost:8080/api`.
   Dacă nu ai `server.servlet.context-path=/api`, pune `VITE_API_URL=http://localhost:8080`.
2. **Valorile de status** — `src/constants.js`, lista `STATUSES`. Câmpul `value` e textul salvat în baza de date
   (implicit `TODO`, `IN_PROGRESS`, `DONE`). Schimbă-l dacă backend-ul tău folosește altceva.
3. **Câmpurile din `Task`** — frontend-ul folosește: `id`, `title`, `description`, `category`, `status`, `dueTime`.
   Dacă la tine se numesc altfel, le redenumești în `src/components/TaskCard.jsx`, `TaskModal.jsx`, `src/utils.js` și `src/App.jsx`.

## Vizualizare

Ochiul de pe fiecare card deschide fereastra cu toate detaliile task-ului.

## Structură

```
src/
  api.js            apelurile către backend (GET, POST, PUT, DELETE, /filter)
  constants.js      URL API + statusuri
  utils.js          date, statusuri, sortare
  hooks/useTheme.js dark / light, salvat în localStorage
  components/       Header, ProgressStack, FilterBar, TaskCard, TaskModal, TaskDetails,
                    ConfirmDialog, Toasts, Icons
  index.css         toată stilizarea (paleta ta, cele două teme)
  App.jsx           starea aplicației și logica
```
