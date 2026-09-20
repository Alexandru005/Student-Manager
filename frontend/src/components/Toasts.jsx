import { AlertIcon, CheckIcon } from './Icons';

export default function Toasts({ toasts }) {
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          {t.type === 'error' ? <AlertIcon width={16} height={16} /> : <CheckIcon width={16} height={16} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
