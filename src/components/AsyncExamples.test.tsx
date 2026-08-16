import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserProfile } from './04_UserProfile(条件渲染示例)';
import { ContactForm } from './06_ContactForm(表单处理示例)';

describe('async tutorial examples', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('cancels a pending user request when its chapter unmounts', () => {
    const { unmount } = render(<UserProfile />);
    expect(vi.getTimerCount()).toBe(1);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels a pending form submission when its chapter unmounts', () => {
    const { unmount } = render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByPlaceholderText('Your message'), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
    expect(vi.getTimerCount()).toBe(1);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('announces validation errors and focuses the first invalid field', () => {
    render(<ContactForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));

    const nameInput = screen.getByRole('textbox', { name: 'Your name' });
    const messageInput = screen.getByRole('textbox', { name: 'Your message' });
    expect(nameInput).toHaveFocus();
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAttribute('aria-describedby', 'contact-name-error');
    expect(messageInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });

  it('gives submitted-message delete controls contextual accessible names', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), {
      target: { value: 'Ada' }
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Your message' }), {
      target: { value: 'Hello' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));

    act(() => vi.advanceTimersByTime(1000));

    expect(screen.getByRole('button', { name: 'Delete message 1 from Ada' })).toHaveClass(
      'focus-visible:opacity-100'
    );
  });
});
