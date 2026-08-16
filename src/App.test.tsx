import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { TUTORIAL_PREFS_STORAGE_KEY } from './lib/tutorial-navigation';

describe('React tutorial workspace', () => {
  beforeEach(() => {
    localStorage.clear();
    history.replaceState(null, '', '/');
  });

  it('mounts exactly one chapter and exposes bounded navigation controls', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 2, name: 'State Management' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'Component Architecture' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous chapter/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next chapter/i })).toBeEnabled();
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
});
