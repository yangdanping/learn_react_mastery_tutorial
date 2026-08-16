import { beforeEach, describe, expect, it } from 'vitest';
import { TUTORIAL_SECTIONS } from './sections';
import {
  LEGACY_TUTORIAL_PREFS_STORAGE_KEY,
  TUTORIAL_PREFS_STORAGE_KEY,
  getAdjacentSectionId,
  readTutorialPrefs,
  resolveInitialSectionId,
  writeTutorialPrefs
} from './tutorial-navigation';

describe('tutorial navigation', () => {
  beforeEach(() => localStorage.clear());

  it('lets a valid URL hash override the stored chapter', () => {
    expect(resolveInitialSectionId('#conditional-rendering', { activeId: 'data-display' }, TUTORIAL_SECTIONS)).toBe(
      'conditional-rendering'
    );
  });

  it('falls back from an invalid hash to a valid stored chapter', () => {
    expect(resolveInitialSectionId('#missing', { activeId: 'data-display' }, TUTORIAL_SECTIONS)).toBe('data-display');
  });

  it('falls back to the first chapter when neither candidate is valid', () => {
    expect(resolveInitialSectionId('#missing', { activeId: 'also-missing' }, TUTORIAL_SECTIONS)).toBe(
      'state-management'
    );
  });

  it('clamps previous and next navigation at the chapter boundaries', () => {
    expect(getAdjacentSectionId('state-management', -1, TUTORIAL_SECTIONS)).toBe('state-management');
    expect(getAdjacentSectionId('state-management', 1, TUTORIAL_SECTIONS)).toBe('component-architecture');
    expect(getAdjacentSectionId('advanced-patterns', 1, TUTORIAL_SECTIONS)).toBe('advanced-patterns');
  });

  it('migrates the chapter from the old zen-mode preference', () => {
    localStorage.setItem(
      LEGACY_TUTORIAL_PREFS_STORAGE_KEY,
      JSON.stringify({ activeId: 'global-state', zenMode: true })
    );

    expect(readTutorialPrefs(localStorage, TUTORIAL_SECTIONS)).toEqual({ activeId: 'global-state' });
  });

  it('tolerates corrupt storage and writes only the new preference shape', () => {
    localStorage.setItem(TUTORIAL_PREFS_STORAGE_KEY, '{broken');
    expect(readTutorialPrefs(localStorage, TUTORIAL_SECTIONS)).toEqual({ activeId: 'state-management' });

    writeTutorialPrefs(localStorage, { activeId: 'user-interaction' });
    expect(JSON.parse(localStorage.getItem(TUTORIAL_PREFS_STORAGE_KEY) ?? '{}')).toEqual({
      activeId: 'user-interaction'
    });
  });
});
