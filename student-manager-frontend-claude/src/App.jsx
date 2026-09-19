import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as api from './api';
import { STATUSES } from './constants';
import { useTheme } from './hooks/useTheme';
import { byDueTime, getStatus } from './utils';
import ConfirmDialog from './components/ConfirmDialog';
import FilterBar from './components/FilterBar';
import Header from './components/Header';
import { AlertIcon, PlusIcon } from './components/Icons';
import ProgressStack from './components/ProgressStack';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import Toasts from './components/Toasts';

const EMPTY_FILTERS = { status: '', category: '', dueTimeMin: '', dueTimeMax: '' };

export default function App() {
  const [theme, toggleTheme] = useTheme();

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState(null); // { task } — task = null pentru "Task nou"
  const [toDelete, setToDelete] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);
  const requestId = useRef(0);

  const filtersActive = Object.values(filters).some(Boolean);
  const hasActive = filtersActive || search.trim() !== '';

  const pushToast = useCallback((message, type = 'success') => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const loadTasks = useCallback(
    async ({ silent = false } = {}) => {
      const id = ++requestId.current;
      if (!silent) setLoading(true);
      try {
        const data = filtersActive ? await api.getFilteredTasks(filters) : await api.getTasks();
        if (id !== requestId.current) return; // a apărut o cerere mai nouă
        const list = Array.isArray(data) ? data : [];
        const cats = list.map((t) => t.category?.trim()).filter(Boolean);
        setTasks(list);
        setError(null);
        // Fără filtre avem lista completă, deci categoriile sunt exacte; cu filtre doar le adăugăm.
        setCategories((prev) =>
          [...new Set(filtersActive ? [...prev, ...cats] : cats)].sort((a, b) => a.localeCompare(b, 'ro')),
        );
      } catch (e) {
        if (id === requestId.current) setError(e.message);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [filters, filtersActive],
  );

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const visibleTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) =>
      [t.title, t.description, t.category].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [tasks, search]);

  const grouped = useMemo(() => {
    const groups = Object.fromEntries(STATUSES.map((s) => [s.key, []]));
    visibleTasks.forEach((t) => groups[getStatus(t.status).key].push(t));
    STATUSES.forEach((s) => groups[s.key].sort(byDueTime));
    return groups;
  }, [visibleTasks]);

  const counts = useMemo(
    () => Object.fromEntries(STATUSES.map((s) => [s.key, grouped[s.key].length])),
    [grouped],
  );

  const columns = filters.status ? STATUSES.filter((s) => s.value === filters.status) : STATUSES;

  // ---------- acțiuni ----------

  async function handleSave(payload) {
    const editing = modal?.task;
    try {
      if (editing) {
        await api.updateTask(editing.id, { ...editing, ...payload });
        pushToast('Task actualizat');
      } else {
        await api.createTask(payload);
        pushToast('Task adăugat');
      }
      setModal(null);
      loadTasks({ silent: true });
      return true;
    } catch (e) {
      pushToast(e.message, 'error');
      return false;
    }
  }

  async function handleStatusChange(task, status) {
    if (!status || getStatus(task.status).key === status.key) return;
    const previous = tasks;
    // update optimist: cardul se mută imediat, iar dacă serverul refuză revenim la starea veche
    setTasks((list) => list.map((t) => (t.id === task.id ? { ...t, status: status.value } : t)));
    try {
      await api.updateTask(task.id, { ...task, status: status.value });
      loadTasks({ silent: true });
    } catch (e) {
      setTasks(previous);
      pushToast(e.message, 'error');
    }
  }

  async function handleDelete() {
    try {
      await api.deleteTask(toDelete.id);
      setToDelete(null);
      pushToast('Task șters');
      loadTasks({ silent: true });
      return true;
    } catch (e) {
      pushToast(e.message, 'error');
      return false;
    }
  }

  function handleDrop(e, status) {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData('text/plain');
    const task = tasks.find((t) => String(t.id) === id);
    if (task) handleStatusChange(task, status);
  }

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  const closeModal = useCallback(() => setModal(null), []);
  const cancelDelete = useCallback(() => setToDelete(null), []);

  const noTasksAtAll = !loading && !error && tasks.length === 0 && !hasActive;

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} onNew={() => setModal({ task: null })} />

      <main className="container main">
        <ProgressStack counts={counts} total={visibleTasks.length} />

        <FilterBar
          filters={filters}
          onFilters={setFilters}
          search={search}
          onSearch={setSearch}
          categories={categories}
          hasActive={hasActive}
          onReset={resetFilters}
        />

        {error && (
          <div className="banner" role="alert">
            <AlertIcon />
            <p>{error}</p>
            <button type="button" className="btn btn--ghost" onClick={() => loadTasks()}>
              Încearcă din nou
            </button>
          </div>
        )}

        {noTasksAtAll ? (
          <div className="empty">
            <h2>Nu ai niciun task încă</h2>
            <p>Adaugă primul task, de exemplu un proiect, un laborator sau un examen, și urmărește-i progresul aici.</p>
            <button type="button" className="btn btn--primary" onClick={() => setModal({ task: null })}>
              <PlusIcon />
              <span>Adaugă primul task</span>
            </button>
          </div>
        ) : (
          <div className={`board ${columns.length === 1 ? 'board--single' : ''}`}>
            {columns.map((col) => {
              const list = grouped[col.key];
              return (
                <section
                  key={col.key}
                  className={`column column--${col.key} ${dragOver === col.key ? 'column--over' : ''}`}
                  aria-labelledby={`col-${col.key}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOver !== col.key) setDragOver(col.key);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null);
                  }}
                  onDrop={(e) => handleDrop(e, col)}
                >
                  <header className="column__head">
                    <h2 id={`col-${col.key}`}>
                      <span className={`dot dot--${col.key}`} />
                      {col.label}
                    </h2>
                    <span className="column__count">{list.length}</span>
                  </header>

                  <div className="column__list">
                    {loading && tasks.length === 0 ? (
                      <>
                        <div className="skeleton" />
                        <div className="skeleton skeleton--short" />
                      </>
                    ) : list.length === 0 ? (
                      <p className="column__empty">
                        {hasActive ? 'Niciun task pentru filtrele alese.' : 'Trage aici un task sau schimbă-i statusul.'}
                      </p>
                    ) : (
                      list.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={(t) => setModal({ task: t })}
                          onDelete={setToDelete}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {modal && (
        <TaskModal task={modal.task} categories={categories} onClose={closeModal} onSave={handleSave} />
      )}
      {toDelete && <ConfirmDialog task={toDelete} onCancel={cancelDelete} onConfirm={handleDelete} />}
      <Toasts toasts={toasts} />
    </>
  );
}
