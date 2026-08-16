'use client';

import { useTheme } from '../contexts/ThemeContext';

export const HeaderThemeControl = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-switch"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
      <span className="theme-switch-label" suppressHydrationWarning>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};
