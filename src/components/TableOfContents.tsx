'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { TUTORIAL_SECTIONS, type TutorialSection } from '../lib/sections';

export type TocSide = 'left' | 'right';

export interface TableOfContentsProps {
  /** Desktop rail and mobile sheet/FAB side. Defaults to right. */
  side?: TocSide;
  items?: TutorialSection[];
  activeId: string;
  onActiveIdChange: (id: string) => void;
  onEnterZen?: () => void;
}

const DESKTOP_QUERY = '(min-width: 1400px)';

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4h10M3 8h10M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ZenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 6V3h3M10 3h3v3M13 10v3h-3M6 13H3v-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TocZenButton({ onEnterZen }: { onEnterZen: () => void }) {
  return (
    <button
      type="button"
      className="toc-zen"
      onClick={onEnterZen}
      aria-keyshortcuts="f"
      aria-label="Enter zen mode for the current section"
      title="Zen mode (F)"
    >
      <ZenIcon />
    </button>
  );
}

function TocNav({
  items,
  activeId,
  labelledBy,
  onNavigate
}: {
  items: TutorialSection[];
  activeId: string;
  labelledBy: string;
  onNavigate?: (id: string) => void;
}) {
  return (
    <nav className="toc-nav" aria-labelledby={labelledBy}>
      <ol className="toc-list">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`toc-link${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'location' : undefined}
                aria-label={`${item.number}. ${item.title}`}
                onClick={
                  onNavigate
                    ? (event) => {
                        event.preventDefault();
                        onNavigate(item.id);
                      }
                    : undefined
                }
              >
                <span className="toc-index">{item.number}</span>
                <span className="toc-label">{item.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function scrollToSection(id: string) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  history.pushState(null, '', `#${id}`);
}

export const TableOfContents = ({
  side = 'right',
  items = TUTORIAL_SECTIONS,
  activeId,
  onActiveIdChange,
  onEnterZen
}: TableOfContentsProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const skipFocusRestore = useRef(false);
  const headingId = useId();
  const dialogHeadingId = useId();

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (visible.size === 0) return;
        const next = [...visible.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
        if (next) onActiveIdChange(next);
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));

    const hash = window.location.hash.slice(1);
    if (hash && items.some((item) => item.id === hash)) {
      onActiveIdChange(hash);
    }

    const onScroll = () => {
      const doc = document.documentElement;
      const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 48;
      if (atBottom) onActiveIdChange(items[items.length - 1].id);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [items, onActiveIdChange]);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleEnterZen = useCallback(() => {
    skipFocusRestore.current = true;
    dialogRef.current?.close();
    onEnterZen?.();
  }, [onEnterZen]);

  const openDialog = useCallback(() => {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  }, []);

  const onMobileNavigate = useCallback(
    (id: string) => {
      const dialog = dialogRef.current;
      skipFocusRestore.current = true;
      onActiveIdChange(id);

      const go = () => scrollToSection(id);

      if (dialog?.open) {
        dialog.addEventListener('close', go, { once: true });
        dialog.close();
        return;
      }

      go();
    },
    [onActiveIdChange]
  );

  const handleDialogClose = useCallback(() => {
    setMenuOpen(false);
    if (skipFocusRestore.current) {
      skipFocusRestore.current = false;
      return;
    }
    fabRef.current?.focus();
  }, []);

  const handleDialogClick = useCallback((event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = event.currentTarget;
    const rect = dialog.getBoundingClientRect();
    const clickedBackdrop =
      event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (clickedBackdrop) dialog.close();
  }, []);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (media.matches) dialogRef.current?.close();
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <aside className={`toc toc-desktop toc--${side}`} aria-labelledby={headingId}>
        <div className="toc-heading-row">
          <p className="toc-heading" id={headingId}>
            Contents
          </p>
          {onEnterZen ? <TocZenButton onEnterZen={handleEnterZen} /> : null}
        </div>
        <TocNav items={items} activeId={activeId} labelledBy={headingId} />
      </aside>

      <button
        ref={fabRef}
        type="button"
        className={`toc-fab toc-fab--${side}`}
        aria-haspopup="dialog"
        aria-controls="toc-dialog"
        aria-expanded={menuOpen}
        onClick={openDialog}
      >
        <ListIcon />
        Contents
      </button>

      <dialog
        ref={dialogRef}
        id="toc-dialog"
        className={`toc-dialog toc-dialog--${side}`}
        aria-labelledby={dialogHeadingId}
        onClose={handleDialogClose}
        onClick={handleDialogClick}
      >
        <div className="toc-dialog-header">
          <div className="toc-heading-row">
            <p className="toc-heading" id={dialogHeadingId}>
              Contents
            </p>
            {onEnterZen ? <TocZenButton onEnterZen={handleEnterZen} /> : null}
          </div>
          <button type="button" className="toc-close" onClick={closeDialog} aria-label="Close contents">
            <CloseIcon />
          </button>
        </div>
        <TocNav items={items} activeId={activeId} labelledBy={dialogHeadingId} onNavigate={onMobileNavigate} />
      </dialog>
    </>
  );
};
