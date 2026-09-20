import { AI_SEND_DATE_CONTEXT, STATUSES } from './constants';

const pad = (n) => String(n).padStart(2, '0');

/** "Data(an/luna/zi)" -> "dataanlunazi" (fără diacritice, litere mici, doar litere și cifre) */
const strip = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

// Modelul poate răspunde cu chei în română sau în engleză, chiar și cu eticheta din prompt
// (ex. "Data(an/luna/zi/ora/minut)"), de aceea potrivim după început, nu exact.
const FIELD_ALIASES = {
  title: ['titlu', 'title', 'nume', 'name', 'denumire'],
  description: ['descriere', 'description', 'detalii', 'details'],
  category: ['categorie', 'category'],
  dueTime: ['data', 'termen', 'duetime', 'duedate', 'deadline', 'date', 'scadenta'],
  status: ['status', 'stare'],
};

function mapFields(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    const k = strip(key);
    const field = Object.keys(FIELD_ALIASES).find((f) =>
      FIELD_ALIASES[f].some((alias) => k === alias || k.startsWith(alias)),
    );
    if (field && !(field in out)) out[field] = value;
  }
  return out;
}

const STATUS_SYNONYMS = {
  todo: ['defacut', 'todo', 'nou', 'neinceput', 'nefinalizat', 'open'],
  inprogress: ['inlucru', 'inprogress', 'inprogres', 'incurs', 'wip'],
  done: ['finalizat', 'done', 'gata', 'terminat', 'complet', 'completat', 'finished'],
};

function toStatusValue(raw) {
  const k = strip(raw ?? '');
  const key = Object.keys(STATUS_SYNONYMS).find((s) => STATUS_SYNONYMS[s].includes(k)) ?? 'todo';
  return STATUSES.find((s) => s.key === key).value;
}

/**
 * Acceptă "2026-09-25T18:00:00", "2026-09-25 18:00", "2026/09/25/18/00", "25.09.2026 18:00"
 * sau un obiect { an, luna, zi, ora, minut }. Întoarce "yyyy-MM-ddTHH:mm" sau "" dacă nu se poate.
 */
function toInputDate(value) {
  if (value == null || value === '') return '';
  let y, m, d, h, mi;

  if (typeof value === 'object') {
    const pick = (names) => {
      for (const [k, v] of Object.entries(value)) if (names.includes(strip(k))) return Number(v);
      return undefined;
    };
    y = pick(['an', 'anul', 'year']);
    m = pick(['luna', 'month']);
    d = pick(['zi', 'ziua', 'day']);
    h = pick(['ora', 'hour']) ?? 0;
    mi = pick(['minut', 'minute', 'min']) ?? 0;
  } else {
    const text = String(value);
    const nums = text.match(/\d+/g)?.map(Number) ?? [];
    if (nums.length < 3) return '';
    if (text.match(/\d+/)[0].length === 4) [y, m, d, h = 0, mi = 0] = nums; // an, lună, zi
    else [d, m, y, h = 0, mi = 0] = nums; // zi, lună, an
  }

  if (![y, m, d, h, mi].every(Number.isFinite) || y < 2000 || y > 2100) return '';
  const date = new Date(y, m - 1, d, h, mi);
  const valid =
    date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d && h < 24 && mi < 60;
  return valid ? `${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(mi)}` : '';
}

/** Scoate JSON-ul dintr-un text, chiar dacă modelul l-a pus între ```json ... ``` sau a scris ceva înainte. */
function extractJson(text) {
  const cleaned = text.replace(/```(?:json)?/gi, '').trim();
  const start = cleaned.search(/[[{]/);
  if (start === -1) throw new Error('Nu există JSON în text');
  const close = cleaned[start] === '{' ? '}' : ']';
  const end = cleaned.lastIndexOf(close);
  return JSON.parse(cleaned.slice(start, end + 1));
}

/** Caută obiectul care arată ca un task (are titlu), oriunde ar fi în structură. */
function findTaskObject(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findTaskObject(item);
      if (found) return found;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    if (mapFields(value).title) return value;
    for (const inner of Object.values(value)) {
      if (typeof inner === 'string' && /[[{]/.test(inner)) {
        try {
          const found = findTaskObject(extractJson(inner));
          if (found) return found;
        } catch {
          /* nu era JSON, continuăm */
        }
      } else {
        const found = findTaskObject(inner);
        if (found) return found;
      }
    }
    return null;
  }
  if (typeof value === 'string') {
    try {
      return findTaskObject(extractJson(value));
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Transformă răspunsul din backend (AITaskResponse) într-un task:
 * { title, description, category, status, dueTime }, cu dueTime în format "yyyy-MM-ddTHH:mm".
 * Nu contează cum se numește câmpul din AITaskResponse: căutăm JSON-ul în orice câmp text.
 */
export function parseAiTask(data) {
  const obj = findTaskObject(data);
  if (!obj) {
    console.warn('Răspuns AI neînțeles:', data);
    throw new Error('Nu am înțeles răspunsul AI-ului. Încearcă să reformulezi mesajul.');
  }
  const f = mapFields(obj);
  const text = (v) => (v == null || typeof v === 'object' ? '' : String(v).trim());
  return {
    title: text(f.title),
    description: text(f.description),
    category: text(f.category),
    status: toStatusValue(f.status),
    dueTime: toInputDate(f.dueTime),
  };
}

/** Adaugă data curentă la mesaj, ca modelul să poată calcula "mâine", "vineri" etc. */
export function buildPrompt(text) {
  if (!AI_SEND_DATE_CONTEXT) return text;
  const now = new Date();
  const when = now.toLocaleString('ro-RO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const iso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return `(Acum este ${when}, adică ${iso}. Folosește data aceasta ca să calculezi termene precum "mâine" sau "vineri".) ${text}`;
}
