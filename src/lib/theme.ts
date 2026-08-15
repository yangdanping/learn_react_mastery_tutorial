export const THEME_STORAGE_KEY = 'theme';
export const THEME_CHANGE_EVENT = 'themechange';

export type Theme = 'light' | 'dark';

export const THEME_INIT_SCRIPT = `(function(){try{var stored=localStorage.getItem('${THEME_STORAGE_KEY}');var theme=(stored==='dark'||stored==='light')?stored:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(theme);root.style.colorScheme=theme;}catch(e){document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}})();`;

export function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

export function getThemeFromDom(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function applyTheme(theme: Theme, options: { persist?: boolean } = {}) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.style.colorScheme = theme;

  if (options.persist !== false) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // localStorage can be unavailable in private mode
    }
  }

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function getPreferredTheme(): Theme {
  const stored = readStoredTheme();
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
