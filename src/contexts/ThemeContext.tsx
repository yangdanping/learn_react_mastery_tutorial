/**
 * File: src/contexts/ThemeContext.tsx
 *
 * Theme Context Provider - Global theme state management
 * Provides theme switching functionality across the entire application
 */

import { createContext, use, useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { applyTheme, getPreferredTheme, getThemeFromDom, isTheme, readStoredTheme, THEME_CHANGE_EVENT, THEME_STORAGE_KEY, type Theme } from '../lib/theme';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = (): ThemeContextType => {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

function subscribeTheme(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    if (isTheme(event.newValue)) {
      applyTheme(event.newValue, { persist: false });
      return;
    }
    onStoreChange();
  };

  window.addEventListener('storage', onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

function getServerThemeSnapshot(): Theme {
  return 'light';
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useSyncExternalStore(subscribeTheme, getThemeFromDom, getServerThemeSnapshot);

  const toggleTheme = useCallback(() => {
    applyTheme(getThemeFromDom() === 'light' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    applyTheme(getPreferredTheme(), { persist: false });
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSchemeChange = () => {
      if (readStoredTheme()) return;
      applyTheme(media.matches ? 'dark' : 'light', { persist: false });
    };

    media.addEventListener('change', onSchemeChange);
    return () => media.removeEventListener('change', onSchemeChange);
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext value={value}>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {theme} theme
      </div>
      {children}
    </ThemeContext>
  );
};
