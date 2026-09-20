import { GraduationIcon, MoonIcon, PlusIcon, SunIcon } from './Icons';

export default function Header({ theme, onToggleTheme, onNew }) {
  const isDark = theme === 'dark';
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="brand">
          <span className="brand__mark">
            <GraduationIcon width={22} height={22} />
          </span>
          <div>
            <h1 className="brand__name">Student Manager</h1>
            <p className="brand__tagline">Task-urile și termenele tale, într-un singur loc</p>
          </div>
        </div>

        <div className="header__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Comută pe tema luminoasă' : 'Comută pe tema întunecată'}
            title={isDark ? 'Temă luminoasă' : 'Temă întunecată'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button type="button" className="btn btn--primary" onClick={onNew}>
            <PlusIcon />
            <span>Task nou</span>
          </button>
        </div>
      </div>
    </header>
  );
}
