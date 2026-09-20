import { useCallback, useEffect, useRef, useState } from 'react';
import { generateTask } from '../api';
import { AI_MAX_CHARS } from '../constants';
import { formatDue, getStatus, parseDate } from '../utils';
import { CalendarIcon, CheckIcon, SendIcon, SparklesIcon, TagIcon, XIcon } from './Icons';

const SUGGESTIONS = [
  'Proiect la Baze de date vineri la 18:00',
  'Recapitulare pentru examenul de Analiză, mâine dimineață',
];

/** Cardul cu task-ul propus de AI, cu acțiunile Adaugă / Editează / Renunță. */
function TaskProposal({ message, onAdd, onEdit, onDismiss }) {
  const { task, state } = message;
  const status = getStatus(task.status);
  const due = parseDate(task.dueTime);
  const past = Boolean(due && due < new Date());

  if (state === 'dismissed') {
    return <p className="bubble bubble--bot bubble--muted">Am renunțat la „{task.title}”.</p>;
  }

  return (
    <div className="bubble bubble--bot bubble--card">
      <p>{state === 'added' ? 'Task adăugat.' : 'Am pregătit acest task:'}</p>

      <div className="chat-card">
        <h3>{task.title}</h3>
        {task.description && <p className="chat-card__desc">{task.description}</p>}
        <div className="chat-card__meta">
          <span className="status-pill">
            <span className={`dot dot--${status.key}`} />
            {status.label}
          </span>
          {task.category && (
            <span className="tag">
              <TagIcon width={14} height={14} />
              {task.category}
            </span>
          )}
          <span className={`tag ${past && state !== 'added' ? 'tag--danger' : ''}`}>
            <CalendarIcon width={14} height={14} />
            {due ? formatDue(task.dueTime) : 'Fără termen'}
          </span>
        </div>
        {past && state !== 'added' && (
          <p className="chat-card__warn">Termenul propus e în trecut. Îl poți corecta cu „Editează”.</p>
        )}
      </div>

      {state === 'added' ? (
        <p className="chat-card__done">
          <CheckIcon width={16} height={16} /> Îl găsești pe tablă.
        </p>
      ) : (
        <div className="chat-card__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={onAdd} disabled={state === 'saving'}>
            {state === 'saving' ? 'Se salvează…' : 'Adaugă'}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onEdit} disabled={state === 'saving'}>
            Editează
          </button>
          <button type="button" className="link-btn" onClick={onDismiss} disabled={state === 'saving'}>
            Renunță
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Butonul rotund din colțul dreapta-jos + fereastra de chat.
 * onAdd(task)  -> salvează task-ul și întoarce true/false
 * onEdit(task, onSaved) -> deschide formularul precompletat; onSaved se apelează după salvare
 */
export default function ChatWidget({ onAdd, onEdit }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const idRef = useRef(0);
  const openRef = useRef(false);
  const abortRef = useRef(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const fabRef = useRef(null);

  const push = useCallback((message) => {
    setMessages((list) => [...list, { id: ++idRef.current, ...message }]);
    if (message.role === 'bot' && !openRef.current) setUnread(true);
  }, []);
  const patch = useCallback(
    (id, changes) => setMessages((list) => list.map((m) => (m.id === id ? { ...m, ...changes } : m))),
    [],
  );

  useEffect(() => {
    openRef.current = open;
    if (open) {
      setUnread(false);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input, open]);

  async function send(raw) {
    const text = raw.trim();
    if (!text || loading) return;
    setInput('');
    push({ role: 'user', kind: 'text', text });
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const task = await generateTask(text, { signal: controller.signal });
      push({ role: 'bot', kind: 'task', task, state: 'idle' });
    } catch (e) {
      if (controller.signal.aborted) return; // oprit de utilizator
      push({ role: 'bot', kind: 'error', text: e.message, retry: text });
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
      }
    }
  }

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    push({ role: 'bot', kind: 'text', text: 'Am oprit cererea.' });
  }

  async function add(m) {
    patch(m.id, { state: 'saving' });
    const ok = await onAdd(m.task);
    patch(m.id, { state: ok ? 'added' : 'idle' });
  }

  function closePanel() {
    setOpen(false);
    fabRef.current?.focus();
  }

  return (
    <>
      {open && (
        <section
          className="chat"
          role="dialog"
          aria-label="Asistent AI pentru task-uri"
          onKeyDown={(e) => e.key === 'Escape' && closePanel()}
        >
          <header className="chat__head">
            <span className="chat__avatar">
              <SparklesIcon />
            </span>
            <div className="chat__titles">
              <h2>Asistent task-uri</h2>
              <p>Scrie ce ai de făcut, iar eu creez task-ul</p>
            </div>
            <button type="button" className="icon-btn icon-btn--sm" onClick={closePanel} aria-label="Închide asistentul">
              <XIcon width={16} height={16} />
            </button>
          </header>

          <div className="chat__log" ref={logRef} role="log" aria-live="polite">
            <div className="bubble bubble--bot">
              Salut! Spune-mi ce ai de făcut, de exemplu un proiect, un laborator sau un examen, cu termenul dacă îl știi.
              Îți propun un task cu titlu, descriere, categorie, termen și status, iar tu îl verifici înainte să fie salvat.
            </div>

            {messages.length === 0 && (
              <div className="chat__chips">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="chip"
                    onClick={() => {
                      setInput(s);
                      inputRef.current?.focus();
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => {
              if (m.kind === 'task') {
                return (
                  <TaskProposal
                    key={m.id}
                    message={m}
                    onAdd={() => add(m)}
                    onEdit={() => onEdit(m.task, () => patch(m.id, { state: 'added' }))}
                    onDismiss={() => patch(m.id, { state: 'dismissed' })}
                  />
                );
              }
              return (
                <div
                  key={m.id}
                  className={`bubble bubble--${m.role} ${m.kind === 'error' ? 'bubble--error' : ''}`}
                >
                  {m.text}
                  {m.kind === 'error' && (
                    <button type="button" className="link-btn" onClick={() => send(m.retry)} disabled={loading}>
                      Încearcă din nou
                    </button>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="bubble bubble--bot bubble--typing" role="status" aria-label="AI-ul scrie">
                <span className="typing">
                  <i />
                  <i />
                  <i />
                </span>
                <button type="button" className="link-btn" onClick={stop}>
                  Oprește
                </button>
              </div>
            )}
          </div>

          <form
            className="chat__form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={AI_MAX_CHARS}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="ex. Proiect la BD vineri la 18:00"
              aria-label="Mesajul tău"
            />
            <button type="submit" className="chat__send" disabled={!input.trim() || loading} aria-label="Trimite">
              <SendIcon />
            </button>
          </form>
        </section>
      )}

      <button
        ref={fabRef}
        type="button"
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Închide asistentul AI' : 'Deschide asistentul AI'}
        title="Asistent AI"
      >
        {open ? <XIcon width={24} height={24} /> : <SparklesIcon width={26} height={26} />}
        {unread && !open && <span className="chat-fab__badge" aria-hidden="true" />}
      </button>
    </>
  );
}
