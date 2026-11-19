import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'yaqadha_theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

const readStoredTheme = (): Theme | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

// One shared theme for every toggle (desktop header and the mobile account sheet).
// The inline script in index.html has already applied the correct class before first paint.
let current: Theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
const listeners = new Set<() => void>();

const apply = (theme: Theme) => {
  current = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  listeners.forEach((listener) => listener());
};

// Follow OS preference changes until the user makes an explicit choice
window.matchMedia(DARK_QUERY).addEventListener('change', (event) => {
  if (!readStoredTheme()) apply(event.matches ? 'dark' : 'light');
});

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, () => current);

  const toggleTheme = useCallback(() => {
    const next: Theme = current === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable: the choice still applies for this session
    }
    apply(next);
  }, []);

  return { theme, toggleTheme };
};
