import { STATUSES } from '../constants';
import { SearchIcon } from './Icons';

export default function FilterBar({
  filters,
  onFilters,
  search,
  onSearch,
  categories,
  hasActive,
  onReset,
}) {
  const set = (key, value) => onFilters({ ...filters, [key]: value });

  return (
    <section className="filters" aria-label="Căutare și filtre">
      <div className="filters__row">
        <label className="search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Caută în task-uri"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </label>

        <div className="chips" role="group" aria-label="Filtru după status">
          <button
            type="button"
            className="chip"
            aria-pressed={!filters.status}
            onClick={() => set('status', '')}
          >
            Toate
          </button>
          {STATUSES.map((s) => (
            <button
              key={s.key}
              type="button"
              className="chip"
              aria-pressed={filters.status === s.value}
              onClick={() => set('status', s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filters__row filters__row--fields">
        <label className="field-inline">
          <span>Categorie</span>
          <select value={filters.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">Toate</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="field-inline">
          <span>Termen de la</span>
          <input
            type="datetime-local"
            value={filters.dueTimeMin}
            max={filters.dueTimeMax || undefined}
            onChange={(e) => set('dueTimeMin', e.target.value)}
          />
        </label>

        <label className="field-inline">
          <span>până la</span>
          <input
            type="datetime-local"
            value={filters.dueTimeMax}
            min={filters.dueTimeMin || undefined}
            onChange={(e) => set('dueTimeMax', e.target.value)}
          />
        </label>

        {hasActive && (
          <button type="button" className="btn btn--ghost" onClick={onReset}>
            Șterge filtrele
          </button>
        )}
      </div>
    </section>
  );
}
