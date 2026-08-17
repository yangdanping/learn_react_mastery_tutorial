import { describe, expect, it } from 'vitest';
import {
  EFFECT_CLEANUP_THEME_ID,
  PROPS_COMPOSITION_THEME_ID,
  THEME_PRACTICE_IDS,
  getThemePractice
} from './theme-practice';

describe('theme practice catalog', () => {
  it('covers every tutorial example with short, sandbox-oriented notes', () => {
    expect(THEME_PRACTICE_IDS).toHaveLength(8);

    for (const themeId of THEME_PRACTICE_IDS) {
      const practice = getThemePractice(themeId);
      expect(practice?.themeId).toBe(themeId);
      expect(practice?.predict).toHaveLength(3);
      expect(practice?.check).toHaveLength(3);
      expect(practice?.pitfalls.length).toBeGreaterThanOrEqual(2);
      expect(practice?.sandboxAccept.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps effect-cleanup notes specific to timer cleanup', () => {
    const practice = getThemePractice(EFFECT_CLEANUP_THEME_ID);

    expect(practice?.sandboxAccept).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/每秒/),
        expect.stringMatching(/暂停/),
        expect.stringMatching(/卸载/),
        expect.stringMatching(/StrictMode/)
      ])
    );
  });

  it('answers props-composition guesses with the reusable-button model', () => {
    const practice = getThemePractice(PROPS_COMPOSITION_THEME_ID);

    expect(practice?.check).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/CustomButton/),
        expect.stringMatching(/disabled/i),
        expect.stringMatching(/variant/i)
      ])
    );
  });
});
