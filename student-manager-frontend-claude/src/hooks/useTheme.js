import { useCallback, useEffect, useState } from 'react';

function initialTheme() {
  const fromDom = document.documentElement.getAttribute('data-theme');
  return fromDom === 'light' ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* modul privat / storage blocat: tema funcționează doar pe sesiune */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return [theme, toggle];
}
