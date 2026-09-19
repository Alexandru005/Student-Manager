import { useEffect, useId, useRef, useState } from 'react';

export default function ConfirmDialog({ task, onCancel, onConfirm }) {
  const uid = useId();
  const cancelRef = useRef(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && !busy && onCancel();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onCancel, busy]);

  async function confirm() {
    setBusy(true);
    const ok = await onConfirm();
    if (!ok) setBusy(false);
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && !busy && onCancel()}>
      <div
        className="dialog dialog--small"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${uid}-t`}
        aria-describedby={`${uid}-d`}
      >
        <div className="dialog__body">
          <h2 id={`${uid}-t`}>Ștergi task-ul?</h2>
          <p id={`${uid}-d`} className="dialog__text">
            „{task.title}” va fi șters definitiv și nu îl mai poți recupera.
          </p>
        </div>
        <div className="dialog__foot">
          <button type="button" ref={cancelRef} className="btn btn--ghost" onClick={onCancel} disabled={busy}>
            Anulează
          </button>
          <button type="button" className="btn btn--danger" onClick={confirm} disabled={busy}>
            {busy ? 'Se șterge…' : 'Șterge task-ul'}
          </button>
        </div>
      </div>
    </div>
  );
}
