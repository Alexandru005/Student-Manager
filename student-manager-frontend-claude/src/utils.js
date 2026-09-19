import { STATUSES } from './constants';

const pad = (n) => String(n).padStart(2, '0');

/** "In Progress", "in_progress", "IN-PROGRESS" -> "inprogress" */
export const normalizeStatus = (s) => String(s ?? '').toLowerCase().replace(/[^a-z]/g, '');

/** Găsește configurarea de status pentru o valoare venită din backend. Necunoscut -> "De făcut". */
export const getStatus = (raw) =>
  STATUSES.find((s) => s.key === normalizeStatus(raw)) ?? STATUSES[0];

/** LocalDateTime poate veni ca text ISO sau (rar) ca array [an, lună, zi, oră, minut]. */
export function parseDate(value) {
  if (!value) return null;
  if (Array.isArray(value)) {
    const [y, m, d, h = 0, mi = 0, s = 0] = value;
    return new Date(y, m - 1, d, h, mi, s);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Valoare pentru <input type="datetime-local"> (yyyy-MM-ddTHH:mm) */
export function toInputValue(value) {
  const d = parseDate(value);
  if (!d) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** yyyy-MM-ddTHH:mm -> yyyy-MM-ddTHH:mm:ss (format acceptat de LocalDateTime / ISO.DATE_TIME) */
export function toApiDate(inputValue) {
  if (!inputValue) return null;
  return inputValue.length === 16 ? `${inputValue}:00` : inputValue;
}

export function formatDue(value) {
  const d = parseDate(value);
  if (!d) return '';
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleString('ro-RO', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isOverdue(task) {
  const d = parseDate(task.dueTime);
  return Boolean(d && d < new Date() && getStatus(task.status).key !== 'done');
}

/** Sortare: termenul cel mai apropiat primul, fără termen la final. */
export function byDueTime(a, b) {
  const da = parseDate(a.dueTime)?.getTime() ?? Infinity;
  const db = parseDate(b.dueTime)?.getTime() ?? Infinity;
  return da - db || (a.id ?? 0) - (b.id ?? 0);
}
