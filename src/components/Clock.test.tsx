import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Clock } from './02_Clock(useEffect示例)';

describe('Clock tutorial example', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

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
});
