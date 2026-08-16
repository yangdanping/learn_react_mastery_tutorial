import { useEffect } from 'react';

interface UseSectionShortcutsOptions {
  canPrevious: boolean;
  canNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.matches('input, textarea, select') || target.isContentEditable) return true;

  const editableAncestor = target.closest('[contenteditable]');
  if (!editableAncestor) return false;
  return editableAncestor.getAttribute('contenteditable') !== 'false';
}

export function useSectionShortcuts({
  canPrevious,
  canNext,
  onPrevious,
  onNext
}: UseSectionShortcutsOptions) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.isComposing ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      if (key === 'a' && canPrevious) {
        event.preventDefault();
        onPrevious();
      }
      if (key === 'd' && canNext) {
        event.preventDefault();
        onNext();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [canNext, canPrevious, onNext, onPrevious]);
}
