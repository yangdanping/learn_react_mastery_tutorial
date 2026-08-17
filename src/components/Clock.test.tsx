import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Clock } from './02_Clock(useEffect示例)';

describe('Clock tutorial example', () => {
  let log: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    log = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    log.mockRestore();
    vi.useRealTimers();
  });

  it('does not expose a control that claims to start a leaking timer', () => {
    render(<Clock />);
    expect(screen.queryByRole('button', { name: /show bad example/i })).not.toBeInTheDocument();
  });

  it('clears its interval when the chapter unmounts', () => {
    const { unmount } = render(<Clock />);
    expect(vi.getTimerCount()).toBe(1);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('logs effect setup and cleanup so the interval lifecycle can be verified', () => {
    const { unmount } = render(<Clock />);

    expect(log).toHaveBeenCalledWith('[effect-cleanup] setup: setInterval', expect.anything());
    unmount();
    expect(log).toHaveBeenCalledWith('[effect-cleanup] cleanup: clearInterval', expect.anything());
  });

  it('shows effect-cleanup practice notes without turning the clock into a quiz', () => {
    render(<Clock />);

    expect(screen.getByRole('heading', { name: '操作前先猜' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '正确理解' })).toBeInTheDocument();
    expect(screen.getByText('常见错误').closest('details')).not.toHaveAttribute('open');
    expect(screen.getByText('以后验收').closest('details')).not.toHaveAttribute('open');
    expect(screen.getByText('effect-cleanup')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });
});
