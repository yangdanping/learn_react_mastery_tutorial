'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Dashboard from './Dashboard';
import { HeaderThemeControl } from './HeaderThemeControl';
import { TUTORIAL_SECTIONS } from '../lib/sections';

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

function ExitIcon() {
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

export const TutorialShell = () => {
  const [zenMode, setZenMode] = useState(false);
  const [activeId, setActiveId] = useState(TUTORIAL_SECTIONS[0]?.id ?? '');
  const wasZen = useRef(false);

  const toggleZen = useCallback(() => {
    setZenMode((open) => !open);
  }, []);

  const enterZen = useCallback(() => {
    setZenMode(true);
  }, []);

  const exitZen = useCallback(() => {
    setZenMode(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.isComposing) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key !== 'f' && event.key !== 'F') return;
      if (isTypingTarget(event.target)) return;

      event.preventDefault();
      toggleZen();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [toggleZen]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';

    if (zenMode) {
      wasZen.current = true;
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    if (!wasZen.current) return;
    wasZen.current = false;

    requestAnimationFrame(() => {
      document.getElementById(activeId)?.scrollIntoView({ behavior, block: 'start' });
    });
  }, [zenMode, activeId]);

  const focusedSection = TUTORIAL_SECTIONS.find((section) => section.id === activeId) ?? TUTORIAL_SECTIONS[0];

  return (
    <div
      className={`min-h-screen${zenMode ? ' is-zen' : ''}`}
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      {zenMode ? (
        <header className="zen-bar" aria-labelledby="zen-mode-label">
          <div className="zen-bar-inner">
            <p className="zen-subtitle" id="zen-mode-label">
              {focusedSection?.description}
            </p>
            <button
              type="button"
              className="zen-exit"
              onClick={exitZen}
              aria-keyshortcuts="f"
              aria-label="Exit zen mode"
              title="Exit zen mode (F)"
            >
              <ExitIcon />
            </button>
          </div>
        </header>
      ) : (
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div>
                <h1>🚀 React Mastery Tutorial</h1>
                <p className="header-subtitle">
                  Master the 8 essential React patterns that cover 95% of use cases
                </p>
              </div>
              <div className="header-actions">
                <button
                  type="button"
                  className="theme-switch"
                  onClick={enterZen}
                  aria-keyshortcuts="f"
                  aria-label="Enter zen mode for the current section"
                  title="Press F to toggle zen mode"
                >
                  <ZenIcon />
                  <span className="theme-switch-label">Zen</span>
                  <kbd className="kbd">F</kbd>
                </button>
                <HeaderThemeControl />
              </div>
            </div>
          </div>
        </header>
      )}

      <main>
        <Dashboard
          tocSide="right"
          zenMode={zenMode}
          activeId={activeId}
          onActiveIdChange={setActiveId}
          onEnterZen={enterZen}
        />
      </main>

      {zenMode ? null : (
        <footer className="footer">
          <div className="container">
            <p>
              Built for teaching React fundamentals to vibe coders and developers who want to stop getting stuck with AI
              tools
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};
