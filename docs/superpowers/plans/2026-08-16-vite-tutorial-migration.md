# React Mastery Tutorial Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the React tutorial from Next.js to a focused Vite + shadcn single-section workspace while preserving repository history and study preferences.

**Architecture:** Keep the existing repository and component examples, replace the Next.js entry layer with Vite, and make a single `TutorialWorkspace` own chapter selection. Chapter identity uses URL hash first and localStorage second; only the active chapter is mounted so temporary state resets and effects are isolated.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, shadcn/ui, Vitest, Testing Library, pnpm.

## Global Constraints

- Do not add React Router.
- Persist only theme, active chapter, and Notes.
- Reset Counter, Todo, ContactForm, Clock, and other temporary state after leaving their chapter.
- Ignore A/D shortcuts in editable targets, composition, repeats, and modifier chords.
- Preserve existing Git history; generate scaffolding only in a temporary directory.
- Use CSS variables and plain CSS rather than Sass.
- Keep the existing restrained indigo/slate identity and both light/dark themes.

---

### Task 1: Establish the Vite and test foundation

**Files:**
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/test/setup.ts`
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `eslint.config.mjs`
- Remove after replacement: `src/app/layout.tsx`, `src/app/page.tsx`, `next.config.ts`, `next-env.d.ts`

**Interfaces:**
- Produces the `@/* -> src/*` alias, jsdom test environment, and scripts `dev`, `test`, `lint`, `typecheck`, and `build`.

- [ ] Generate a Vite shadcn scaffold in a temporary directory and inspect its exact dependency/config output without copying its `.git`.
- [ ] Add the Vite and Vitest config plus test setup to the migration worktree.
- [ ] Run `pnpm install` and `pnpm typecheck`; configuration errors must be resolved before behavior work.
- [ ] Commit the foundation as `build: migrate tutorial foundation to vite`.

### Task 2: Define chapter navigation with tests first

**Files:**
- Create: `src/lib/tutorial-navigation.test.ts`
- Create: `src/lib/tutorial-navigation.ts`
- Modify: `src/lib/sections.ts`
- Replace: `src/lib/tutorial-prefs.ts`

**Interfaces:**
- Produces `resolveInitialSectionId(locationHash, storedPrefs, sections): string`.
- Produces `getAdjacentSectionId(activeId, direction, sections): string` where direction is `-1 | 1` and navigation clamps at boundaries.
- Produces safe `readTutorialPrefs(storage)` and `writeTutorialPrefs(storage, prefs)` functions.

- [ ] Write failing tests proving valid hash wins, invalid hash falls back to storage, invalid storage falls back to the first chapter, and adjacent navigation clamps.
- [ ] Run `pnpm test --run src/lib/tutorial-navigation.test.ts` and confirm failures are caused by missing navigation exports.
- [ ] Implement the minimal pure navigation and persistence functions.
- [ ] Re-run the targeted test and confirm it passes.
- [ ] Commit as `feat: define persistent chapter navigation`.

### Task 3: Build the single-section workspace with TDD

**Files:**
- Create: `src/App.test.tsx`
- Create: `src/App.tsx`
- Create: `src/components/TutorialWorkspace.tsx`
- Create: `src/hooks/use-section-shortcuts.ts`
- Create: `src/hooks/use-section-shortcuts.test.tsx`
- Modify: `src/components/Section.tsx`
- Remove after replacement: `src/components/Dashboard.tsx`, `src/components/TutorialShell.tsx`, `src/components/TableOfContents.tsx`

**Interfaces:**
- `TutorialWorkspace` renders exactly one section component.
- `useSectionShortcuts({ onPrevious, onNext, canPrevious, canNext })` owns global A/D behavior.
- The active heading exposes a ref target for focus management.

- [ ] Write failing shortcut tests for A/D, editable targets, modifiers, repeats, composition, and boundaries.
- [ ] Verify the shortcut tests fail because the hook is missing.
- [ ] Implement the minimal shortcut hook and make targeted tests pass.
- [ ] Write failing App tests for one visible chapter, previous/next buttons, state reset after leaving/returning, hash navigation, persistence, and heading focus.
- [ ] Verify App tests fail against the old long-page shell.
- [ ] Implement the single-section workspace without a router.
- [ ] Re-run App and shortcut tests until green.
- [ ] Commit as `feat: focus tutorial on one chapter at a time`.

### Task 4: Add shadcn controls and plain-CSS theme system

**Files:**
- Create: `components.json`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/sheet.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/textarea.tsx`
- Create: `src/lib/utils.ts`
- Create: `src/index.css`
- Create: `src/styles/tutorial.css`
- Modify: `src/contexts/ThemeContext.tsx`
- Modify: `src/components/HeaderThemeControl.tsx`
- Remove after replacement: `src/app/globals.scss`

**Interfaces:**
- `components.json` points the shadcn CLI to `src/index.css` and `@/components` aliases.
- ThemeProvider continues to expose `{ theme, toggleTheme }` and persist explicit theme choice.
- The directory uses Sheet and closes after chapter selection.

- [ ] Add a failing App test for opening the directory, selecting a chapter, and returning focus to the new heading.
- [ ] Verify the directory test fails before the shadcn Sheet UI exists.
- [ ] Add only the needed shadcn components and map the existing theme to complete semantic CSS variables.
- [ ] Move tutorial-specific rules to scoped plain CSS and remove Sass-only constructs.
- [ ] Re-run component tests, lint, and typecheck.
- [ ] Commit as `style: rebuild tutorial workspace with shadcn`.

### Task 5: Correct tutorial examples with regression tests

**Files:**
- Create: `src/components/Clock.test.tsx`
- Modify: `src/components/02_Clock(useEffect示例).tsx`
- Modify: `src/components/05_TodoList(列表渲染示例).tsx`
- Modify: `src/components/06_ContactForm(表单处理示例).tsx`
- Modify: `src/components/08_NotesWidget(自定义Hooks示例).tsx`
- Modify: `src/hooks/useLocalStorage.ts`
- Modify: `src/components/types.ts`

**Interfaces:**
- Clock clears its interval on unmount.
- Notes use stable IDs and remain persisted.
- Temporary examples rely on unmount/remount for reset.

- [ ] Write a failing test proving the tutorial no longer exposes an active "bad timer" control, plus a fake-timer regression test that proves Clock releases its interval on unmount.
- [ ] Run the Clock tests and verify the behavioral test fails because the old UI still exposes the misleading leak control; record that the committed baseline already contains correct interval cleanup.
- [ ] Keep the real cleanup and remove misleading active leak controls while retaining explanatory comments.
- [ ] Replace Todo `any`, remove accidental text, and give Notes stable IDs.
- [ ] Rewrite useCallback teaching copy to describe reference stability as conditional, not universal.
- [ ] Run targeted and full tests.
- [ ] Commit as `fix: align tutorial examples with react guidance`.

### Task 6: Documentation and full verification

**Files:**
- Modify: `README.md`
- Remove: obsolete Next.js-only files and dependencies not already removed.

**Interfaces:**
- README documents pnpm, Vite, A/D navigation, directory, persistence scope, and verification commands.

- [ ] Update README and remove stale Next.js 15/npm/single-Dashboard claims.
- [ ] Run `pnpm test --run` and expect all tests to pass with no warnings.
- [ ] Run `pnpm lint` and expect exit code 0.
- [ ] Run `pnpm typecheck` and expect exit code 0.
- [ ] Run `pnpm build` and expect Vite to produce `dist/` successfully.
- [ ] Start the dev server and verify the root page responds before browser inspection.
- [ ] Inspect desktop and mobile layouts, A/D, directory, theme, persistence, and chapter reset behavior.
- [ ] Commit as `docs: update tutorial migration guide`.
