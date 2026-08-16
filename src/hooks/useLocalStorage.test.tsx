import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear());

  it('reads persisted data on the first client render', () => {
    localStorage.setItem('prefs', JSON.stringify({ count: 3 }));
    const { result } = renderHook(() => useLocalStorage('prefs', { count: 0 }));

    expect(result.current[0]).toEqual({ count: 3 });
  });

  it('supports functional updates and persists the resolved value', () => {
    const { result } = renderHook(() => useLocalStorage('prefs', { count: 0 }));

    act(() => result.current[1]((current) => ({ count: current.count + 1 })));

    expect(result.current[0]).toEqual({ count: 1 });
    expect(JSON.parse(localStorage.getItem('prefs') ?? '{}')).toEqual({ count: 1 });
  });

  it('falls back to the initial value when stored JSON is corrupt', () => {
    localStorage.setItem('prefs', '{broken');
    const { result } = renderHook(() => useLocalStorage('prefs', ['first']));

    expect(result.current[0]).toEqual(['first']);
  });
});
