import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSectionShortcuts } from './use-section-shortcuts';

interface HarnessProps {
  canPrevious?: boolean;
  canNext?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

function Harness({ canPrevious = true, canNext = true, onPrevious, onNext }: HarnessProps) {
  useSectionShortcuts({ canPrevious, canNext, onPrevious, onNext });
  return (
    <>
      <input aria-label="editable target" />
      <div data-testid="empty-contenteditable">
        <span>editable content</span>
      </div>
      <div contentEditable="plaintext-only" suppressContentEditableWarning>
        plaintext content
      </div>
    </>
  );
}

describe('useSectionShortcuts', () => {
  it('maps A to previous and D to next', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    render(<Harness onPrevious={onPrevious} onNext={onNext} />);

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'D' });

    expect(onPrevious).toHaveBeenCalledOnce();
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('ignores editable targets, modifiers, repeats, and composition', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    const { getByRole } = render(<Harness onPrevious={onPrevious} onNext={onNext} />);

    fireEvent.keyDown(getByRole('textbox'), { key: 'a' });
    fireEvent.keyDown(document, { key: 'd', metaKey: true });
    fireEvent.keyDown(document, { key: 'd', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'a', altKey: true });
    fireEvent.keyDown(document, { key: 'd', shiftKey: true });
    fireEvent.keyDown(document, { key: 'a', repeat: true });
    fireEvent.keyDown(document, { key: 'd', isComposing: true });
    screen.getByTestId('empty-contenteditable').setAttribute('contenteditable', '');
    fireEvent.keyDown(screen.getByText('editable content'), { key: 'a' });
    fireEvent.keyDown(screen.getByText('plaintext content'), { key: 'd' });

    expect(onPrevious).not.toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });

  it('does not fire callbacks beyond chapter boundaries', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    const { rerender } = render(
      <Harness canPrevious={false} onPrevious={onPrevious} onNext={onNext} />
    );

    fireEvent.keyDown(document, { key: 'a' });
    rerender(<Harness canNext={false} onPrevious={onPrevious} onNext={onNext} />);
    fireEvent.keyDown(document, { key: 'd' });

    expect(onPrevious).not.toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });
});
