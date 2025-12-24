/**
 * File: src/contexts/ThemeContext.tsx
 *
 * Theme Context Provider - Global theme state management
 * Provides theme switching functionality across the entire application
 */

'use client';

import React, { createContext, use, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
// Theme context type definition
export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// Create the theme context
export const ThemeContext = createContext<ThemeContextType | null>(null);

// Custom hook to use theme context with error checking
export const useTheme = (): ThemeContextType => {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('light'); // 定义控制全局主题的state

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      return prev === 'light' ? 'dark' : 'light';
    });
  }, []);

  // Apply theme class to body element
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
};
