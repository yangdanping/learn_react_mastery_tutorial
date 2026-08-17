import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ListTree } from 'lucide-react';
import { Counter } from './01_Counter(useState示例)';
import { Clock } from './02_Clock(useEffect示例)';
import { ButtonShowcase } from './03_ButtonShowcase(Props示例)';
import { UserProfile } from './04_UserProfile(条件渲染示例)';
import { TodoList } from './05_TodoList(列表渲染示例)';
import { ContactForm } from './06_ContactForm(表单处理示例)';
import { ThemeToggle } from './07_ThemeToggle(Context API示例)';
import { NotesWidget } from './08_NotesWidget(自定义Hooks示例)';
import { HeaderThemeControl } from './HeaderThemeControl';
import { Section } from './Section';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet';
import { useSectionShortcuts } from '@/hooks/use-section-shortcuts';
import {
  getAdjacentSectionId,
  readTutorialPrefs,
  resolveInitialSectionId,
  writeTutorialPrefs
} from '@/lib/tutorial-navigation';
import { isTutorialSectionId, TUTORIAL_SECTIONS } from '@/lib/sections';
import { clearTutorialLogs } from '@/lib/tutorial-log';

function renderSectionBody(id: string) {
  switch (id) {
    case 'state-management':
      return (
        <>
          <Counter />
          <Clock />
        </>
      );
    case 'component-architecture':
      return <ButtonShowcase />;
    case 'conditional-rendering':
      return <UserProfile />;
    case 'data-display':
      return <TodoList />;
    case 'user-interaction':
      return <ContactForm />;
    case 'global-state':
      return <ThemeToggle />;
    case 'advanced-patterns':
      return <NotesWidget />;
    default:
      return null;
  }
}

function getTutorialStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getInitialSectionId() {
  const stored = readTutorialPrefs(getTutorialStorage(), TUTORIAL_SECTIONS);
  return resolveInitialSectionId(window.location.hash, stored, TUTORIAL_SECTIONS);
}

export function TutorialWorkspace() {
  const [activeId, setActiveId] = useState(getInitialSectionId);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasMounted = useRef(false);
  const activeIdRef = useRef(activeId);
  const activeIndex = TUTORIAL_SECTIONS.findIndex((section) => section.id === activeId);
  const activeSection = TUTORIAL_SECTIONS[activeIndex] ?? TUTORIAL_SECTIONS[0];
  const canPrevious = activeIndex > 0;
  const canNext = activeIndex >= 0 && activeIndex < TUTORIAL_SECTIONS.length - 1;

  const commitSection = useCallback((id: string, historyMode: 'push' | 'replace' | 'none' = 'push') => {
    if (!isTutorialSectionId(id)) return;
    if (activeIdRef.current !== id) {
      clearTutorialLogs();
      activeIdRef.current = id;
    }
    setActiveId(id);
    writeTutorialPrefs(getTutorialStorage(), { activeId: id });

    if (historyMode === 'push' && window.location.hash.slice(1) !== id) {
      history.pushState(null, '', `#${id}`);
    }
    if (historyMode === 'replace' && window.location.hash.slice(1) !== id) {
      history.replaceState(null, '', `#${id}`);
    }
  }, []);

  const goPrevious = useCallback(() => {
    commitSection(getAdjacentSectionId(activeId, -1, TUTORIAL_SECTIONS));
  }, [activeId, commitSection]);

  const goNext = useCallback(() => {
    commitSection(getAdjacentSectionId(activeId, 1, TUTORIAL_SECTIONS));
  }, [activeId, commitSection]);

  const selectFromDirectory = useCallback(
    (id: string) => {
      commitSection(id);
      setDirectoryOpen(false);
      window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 0);
    },
    [commitSection]
  );

  useSectionShortcuts({ canPrevious, canNext, onPrevious: goPrevious, onNext: goNext });

  useEffect(() => {
    commitSection(activeId, 'replace');
  }, [activeId, commitSection]);

  useEffect(() => {
    const restoreFromLocation = () => {
      const id = window.location.hash.slice(1);
      if (isTutorialSectionId(id)) commitSection(id, 'none');
    };

    window.addEventListener('popstate', restoreFromLocation);
    window.addEventListener('hashchange', restoreFromLocation);
    return () => {
      window.removeEventListener('popstate', restoreFromLocation);
      window.removeEventListener('hashchange', restoreFromLocation);
    };
  }, [commitSection]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [activeId]);

  const progress = useMemo(() => `${activeIndex + 1} / ${TUTORIAL_SECTIONS.length}`, [activeIndex]);
  if (!activeSection) return null;

  return (
    <div className="tutorial-workspace">
      <a className="skip-link" href="#tutorial-main">
        跳到当前学习章节
      </a>
      <header className="workspace-header">
        <div className="workspace-header-inner">
          <div>
            <p className="eyebrow">REACT MASTERY · FOCUSED TUTORIAL</p>
            <h1>逐章练习，让每一次 render 都有上下文</h1>
          </div>
          <div className="workspace-actions">
            <Sheet open={directoryOpen} onOpenChange={setDirectoryOpen}>
              <SheetTrigger
                render={
                  <Button variant="outline" size="lg" aria-label="Open chapter directory" />
                }
              >
                <ListTree aria-hidden="true" />
                <span>目录</span>
                <span className="directory-progress">{progress}</span>
              </SheetTrigger>
              <SheetContent side="right" aria-label="Chapter directory">
                <SheetHeader>
                  <SheetTitle>章节目录</SheetTitle>
                  <SheetDescription>直接跳到要复习的章节，当前示例状态会重置。</SheetDescription>
                </SheetHeader>
                <nav className="directory-list" aria-label="Tutorial chapters">
                  {TUTORIAL_SECTIONS.map((section) => (
                    <Button
                      key={section.id}
                      type="button"
                      variant={section.id === activeId ? 'secondary' : 'ghost'}
                      className="directory-item"
                      aria-current={section.id === activeId ? 'page' : undefined}
                      aria-label={`${section.number}. ${section.title}`}
                      onClick={() => selectFromDirectory(section.id)}
                    >
                      <span className="directory-index">{section.number}</span>
                      <span>{section.title}</span>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <HeaderThemeControl />
          </div>
        </div>
      </header>

      <main id="tutorial-main" className="workspace-main">
        <div className="workspace-progress" aria-live="polite">
          <span>{progress}</span>
          <span>使用 A / D 切换章节</span>
        </div>

        <Section
          key={activeSection.id}
          id={activeSection.id}
          number={activeSection.number}
          title={activeSection.title}
          description={activeSection.description}
          headingRef={headingRef}
        >
          {renderSectionBody(activeSection.id)}
        </Section>

        <nav className="chapter-navigation" aria-label="Chapter navigation">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="chapter-nav-button"
            onClick={goPrevious}
            disabled={!canPrevious}
            aria-label="Previous chapter"
            aria-keyshortcuts="a"
          >
            <ArrowLeft aria-hidden="true" />
            <span>上一章</span>
            <kbd>A</kbd>
          </Button>
          <Button
            type="button"
            size="lg"
            className="chapter-nav-button chapter-nav-button--next"
            onClick={goNext}
            disabled={!canNext}
            aria-label="Next chapter"
            aria-keyshortcuts="d"
          >
            <span>下一章</span>
            <kbd>D</kbd>
            <ArrowRight aria-hidden="true" />
          </Button>
        </nav>
      </main>
    </div>
  );
}
