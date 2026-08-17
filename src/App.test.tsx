import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { TUTORIAL_PREFS_STORAGE_KEY } from './lib/tutorial-navigation';

describe('React tutorial workspace', () => {
  beforeEach(() => {
    localStorage.clear();
    history.replaceState(null, '', '/');
  });

  it('mounts exactly one chapter and exposes bounded navigation controls', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: '跳到当前学习章节' })).toHaveAttribute(
      'href',
      '#tutorial-main'
    );
    expect(screen.getByRole('heading', { level: 2, name: 'State Management' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'Component Architecture' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous chapter/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next chapter/i })).toBeEnabled();
    expect(screen.getByText('counter-state')).toBeInTheDocument();
    expect(screen.getByText('effect-cleanup')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: '操作前先猜' })).toHaveLength(2);
  });

  it('navigates with visible controls, persists the chapter, and moves heading focus', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /next chapter/i }));
    const heading = screen.getByRole('heading', { level: 2, name: 'Component Architecture' });

    await waitFor(() => expect(heading).toHaveFocus());
    expect(window.location.hash).toBe('#component-architecture');
    expect(JSON.parse(localStorage.getItem(TUTORIAL_PREFS_STORAGE_KEY) ?? '{}')).toEqual({
      activeId: 'component-architecture'
    });
  });

  it('resets temporary example state after leaving and returning to a chapter', async () => {
    const user = userEvent.setup();
    render(<App />);
    const counter = screen.getByRole('heading', { name: /Counter Widget/ }).closest('.widget');
    expect(counter).not.toBeNull();

    await user.click(within(counter as HTMLElement).getByRole('button', { name: '+' }));
    expect(within(counter as HTMLElement).getByText('1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next chapter/i }));
    await user.click(screen.getByRole('button', { name: /previous chapter/i }));

    const freshCounter = screen.getByRole('heading', { name: /Counter Widget/ }).closest('.widget');
    expect(within(freshCounter as HTMLElement).getByText('0')).toBeInTheDocument();
  });

  it('uses a valid hash before storage and responds to browser history events', () => {
    localStorage.setItem(TUTORIAL_PREFS_STORAGE_KEY, JSON.stringify({ activeId: 'global-state' }));
    history.replaceState(null, '', '#conditional-rendering');
    render(<App />);

    expect(screen.getByRole('heading', { level: 2, name: 'Conditional Rendering' })).toBeInTheDocument();

    history.pushState(null, '', '#data-display');
    fireEvent.popState(window);
    expect(screen.getByRole('heading', { level: 2, name: 'Data Display' })).toBeInTheDocument();
  });

  it('maps D to the next chapter without toggling theme', () => {
    render(<App />);
    const initialTheme = document.documentElement.className;

    fireEvent.keyDown(document, { key: 'd' });

    expect(screen.getByRole('heading', { level: 2, name: 'Component Architecture' })).toBeInTheDocument();
    expect(document.documentElement.className).toBe(initialTheme);
  });

  it('clears the console when the chapter actually changes', () => {
    const clear = vi.spyOn(console, 'clear').mockImplementation(() => {});

    render(<App />);
    expect(clear).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'd' });
    expect(clear).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: 'd' });
    expect(clear).toHaveBeenCalledTimes(2);

    clear.mockRestore();
  });

  it('opens the chapter directory, selects a chapter, and returns focus to its heading', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /open chapter directory/i }));
    expect(screen.getByRole('dialog', { name: /章节目录/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '4. Data Display' }));
    const heading = screen.getByRole('heading', { level: 2, name: 'Data Display' });

    expect(screen.queryByRole('dialog', { name: /章节目录/i })).not.toBeInTheDocument();
    await waitFor(() => expect(heading).toHaveFocus());
  });

  it('falls back safely when the localStorage getter is unavailable', () => {
    const storageDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');

    try {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() {
          throw new DOMException('Storage unavailable', 'SecurityError');
        }
      });

      expect(() => render(<App />)).not.toThrow();
      expect(screen.getByRole('heading', { level: 2, name: 'State Management' })).toBeInTheDocument();
    } finally {
      if (storageDescriptor) Object.defineProperty(window, 'localStorage', storageDescriptor);
    }
  });
});
