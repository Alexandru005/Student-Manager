import { STATUSES } from '../constants';
import { formatDue, getStatus, isOverdue } from '../utils';
import { AlertIcon, CalendarIcon, CheckIcon, EditIcon, TagIcon, TrashIcon } from './Icons';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const status = getStatus(task.status);
  const done = status.key === 'done';
  const overdue = isOverdue(task);

  return (
    <article
      className={`task task--${status.key}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(task.id));
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <div className="task__top">
        <button
          type="button"
          className="check"
          aria-pressed={done}
          aria-label={done ? 'Marchează ca nefinalizat' : 'Marchează ca finalizat'}
          onClick={() => onStatusChange(task, done ? STATUSES[0] : STATUSES[2])}
        >
          {done && <CheckIcon width={14} height={14} strokeWidth={3} />}
        </button>
        <h3 className="task__title">{task.title}</h3>
      </div>

      {task.description && <p className="task__desc">{task.description}</p>}

      {(task.category || task.dueTime) && (
        <div className="task__meta">
          {task.category && (
            <span className="tag">
              <TagIcon width={14} height={14} />
              {task.category}
            </span>
          )}
          {task.dueTime && (
            <span className={`tag ${overdue ? 'tag--danger' : ''}`}>
              {overdue ? <AlertIcon width={14} height={14} /> : <CalendarIcon width={14} height={14} />}
              {overdue ? 'Întârziat: ' : ''}
              {formatDue(task.dueTime)}
            </span>
          )}
        </div>
      )}

      <div className="task__foot">
        <select
          className="status-select"
          value={status.value}
          aria-label={`Status pentru ${task.title}`}
          onChange={(e) => onStatusChange(task, STATUSES.find((s) => s.value === e.target.value))}
        >
          {STATUSES.map((s) => (
            <option key={s.key} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="task__actions">
          <button
            type="button"
            className="icon-btn icon-btn--sm"
            onClick={() => onEdit(task)}
            aria-label={`Modifică ${task.title}`}
            title="Modifică"
          >
            <EditIcon width={16} height={16} />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--sm icon-btn--danger"
            onClick={() => onDelete(task)}
            aria-label={`Șterge ${task.title}`}
            title="Șterge"
          >
            <TrashIcon width={16} height={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
