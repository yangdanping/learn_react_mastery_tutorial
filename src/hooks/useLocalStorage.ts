/**
 * File: src/hooks/useLocalStorage.ts
 * 
 * Custom hook for localStorage management
 * Provides persistent state that survives page refreshes
 */

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

function readStoredValue<T>(key: string, initialValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item === null ? initialValue : (JSON.parse(item) as T);
  } catch {
    return initialValue;
  }
}

/**
 * Custom hook to manage localStorage state
 * @param key - localStorage key
 * @param initialValue - default value if no stored value exists
 * @returns [storedValue, setValue] - tuple similar to useState
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  // 🐍 Python: Like creating a reusable function
  const [storedValue, setStoredValue] = useState<T>(() => readStoredValue(key, initialValue));
  const valueRef = useRef(storedValue);

  useEffect(() => {
    valueRef.current = storedValue;
  }, [storedValue]);

  const setValue = useCallback<Dispatch<SetStateAction<T>>>((value) => {
    const nextValue = typeof value === 'function' ? (value as (current: T) => T)(valueRef.current) : value;
    valueRef.current = nextValue;
    setStoredValue(nextValue);

    try {
      window.localStorage.setItem(key, JSON.stringify(nextValue));
    } catch {
      // Keep React state usable even when storage is unavailable.
    }
  }, [key]);

  return [storedValue, setValue];
}
