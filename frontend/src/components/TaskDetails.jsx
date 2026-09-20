import { useEffect, useId, useRef } from 'react';
import { formatDueLong, getStatus, isOverdue } from '../utils';
import { AlertIcon, EditIcon, XIcon } from './Icons';

export default function TaskDetails({ task, onClose, onEdit }) {
  const uid = useId();
  const closeRef = useRef(null);
  const status = getStatus(task.status);
  const overdue = isOverdue(task);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby={`${uid}-title`}>
        <div className="dialog__head">
          <h2 id={`${uid}-title`} className="detail__title">
            {task.title}
          </h2>
          <button ref={closeRef} type="button" className="icon-btn icon-btn--sm" onClick={onClose} aria-label="Închide">
            <XIcon width={16} height={16} />
          </button>
        </div>

        <div className="dialog__body">
          <div className="detail__badges">
            <span className="status-pill">
              <span className={`dot dot--${status.key}`} />
              {status.label}
            </span>
            {overdue && (
              <span className="tag tag--danger">
                <AlertIcon width={14} height={14} />
                Întârziat
              </span>
            )}
          </div>

          <dl className="detail-list">
            <div>
              <dt>Descriere</dt>
              <dd className={task.description ? 'detail__desc' : 'detail__empty'}>
                {task.description || 'Fără descriere'}
              </dd>
            </div>
            <div>
              <dt>Categorie</dt>
              <dd className={task.category ? '' : 'detail__empty'}>{task.category || 'Fără categorie'}</dd>
            </div>
            <div>
              <dt>Termen limită</dt>
              <dd className={task.dueTime ? '' : 'detail__empty'}>
                {task.dueTime ? formatDueLong(task.dueTime) : 'Fără termen'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="dialog__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Închide
          </button>
          <button type="button" className="btn btn--primary" onClick={() => onEdit(task)}>
            <EditIcon width={16} height={16} />
            <span>Modifică</span>
          </button>
        </div>
      </div>
    </div>
  );
}
