import { useEffect, useId, useRef, useState } from 'react';
import { STATUSES } from '../constants';
import { getStatus, toApiDate, toInputValue } from '../utils';
import { XIcon } from './Icons';

export default function TaskModal({ task, initial, categories, onClose, onSave }) {
  const isEdit = Boolean(task);
  const source = task ?? initial; // `initial` = valori precompletate pentru un task nou (ex. propus de AI)
  const uid = useId();
  const titleRef = useRef(null);

  const [form, setForm] = useState(() => ({
    title: source?.title ?? '',
    description: source?.description ?? '',
    category: source?.category ?? '',
    status: source ? getStatus(source.status).value : STATUSES[0].value,
    dueTime: toInputValue(source?.dueTime),
  }));
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const titleMissing = !form.title.trim();

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && !saving && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, saving]);

  async function submit(e) {
    e.preventDefault();
    setShowErrors(true);
    if (titleMissing) {
      titleRef.current?.focus();
      return;
    }
    setSaving(true);
    const ok = await onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      status: form.status,
      dueTime: toApiDate(form.dueTime),
    });
    if (!ok) setSaving(false); // la succes, părintele închide fereastra
  }

  return (
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <form
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        onSubmit={submit}
        noValidate
      >
        <div className="dialog__head">
          <h2 id={`${uid}-title`}>{isEdit ? 'Modifică task-ul' : 'Task nou'}</h2>
          <button type="button" className="icon-btn icon-btn--sm" onClick={onClose} aria-label="Închide">
            <XIcon width={16} height={16} />
          </button>
        </div>

        <div className="dialog__body">
          <div className="field">
            <label htmlFor={`${uid}-t`}>Titlu</label>
            <input
              id={`${uid}-t`}
              ref={titleRef}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="ex. Proiect la Baze de date"
              maxLength={120}
              aria-invalid={showErrors && titleMissing}
              aria-describedby={showErrors && titleMissing ? `${uid}-err` : undefined}
            />
            {showErrors && titleMissing && (
              <p id={`${uid}-err`} className="field__error">
                Scrie un titlu ca să poți salva task-ul.
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor={`${uid}-d`}>Descriere</label>
            <textarea
              id={`${uid}-d`}
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Ce trebuie făcut, ce materiale ai nevoie, linkuri utile…"
            />
          </div>

          <div className="field-grid">
            <div className="field">
              <label htmlFor={`${uid}-c`}>Categorie</label>
              <input
                id={`${uid}-c`}
                list={`${uid}-cats`}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                placeholder="ex. Facultate"
                maxLength={60}
              />
              <datalist id={`${uid}-cats`}>
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div className="field">
              <label htmlFor={`${uid}-due`}>Termen limită</label>
              <input
                id={`${uid}-due`}
                type="datetime-local"
                value={form.dueTime}
                onChange={(e) => set('dueTime', e.target.value)}
              />
            </div>
          </div>

          <fieldset className="field field--set">
            <legend>Status</legend>
            <div className="segmented">
              {STATUSES.map((s) => (
                <label key={s.key} className="segmented__item">
                  <input
                    type="radio"
                    name={`${uid}-status`}
                    value={s.value}
                    checked={form.status === s.value}
                    onChange={() => set('status', s.value)}
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="dialog__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={saving}>
            Anulează
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Se salvează…' : isEdit ? 'Salvează modificările' : 'Adaugă task-ul'}
          </button>
        </div>
      </form>
    </div>
  );
}
