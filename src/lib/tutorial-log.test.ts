import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearTutorialLogs, tutorialLog } from './tutorial-log';

describe('tutorialLog', () => {
  afterEach(() => vi.restoreAllMocks());

  it('prefixes messages with the theme id', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    tutorialLog('effect-cleanup', 'cleanup: clearInterval', 12);

    expect(log).toHaveBeenCalledWith('[effect-cleanup] cleanup: clearInterval', 12);
  });

  it('clears the console', () => {
    const clear = vi.spyOn(console, 'clear').mockImplementation(() => {});

    clearTutorialLogs();

    expect(clear).toHaveBeenCalledTimes(1);
  });
});
