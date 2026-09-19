import { STATUSES } from '../constants';

/**
 * Bara de progres: trei pastile suprapuse ca în paleta de culori,
 * fiecare lățime proporțională cu numărul de task-uri din status.
 */
export default function ProgressStack({ counts, total }) {
  const done = counts.done ?? 0;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const summary = STATUSES.map((s) => `${s.label}: ${counts[s.key] ?? 0}`).join(', ');

  return (
    <section className="progress" aria-label="Progres">
      <div className="progress__head">
        <p className="progress__pct">
          {pct}% <span>finalizat</span>
        </p>
        <p className="progress__count">
          {done} din {total} {total === 1 ? 'task' : 'task-uri'}
        </p>
      </div>

      <div className="stack" role="img" aria-label={summary}>
        {total === 0 ? (
          <span className="stack__seg stack__seg--empty" style={{ flexGrow: 1 }} />
        ) : (
          STATUSES.map(
            (s) =>
              counts[s.key] > 0 && (
                <span
                  key={s.key}
                  className={`stack__seg stack__seg--${s.key}`}
                  style={{ flexGrow: counts[s.key] }}
                />
              ),
          )
        )}
      </div>

      <ul className="legend">
        {STATUSES.map((s) => (
          <li key={s.key}>
            <span className={`dot dot--${s.key}`} />
            {s.label}
            <b>{counts[s.key] ?? 0}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}
