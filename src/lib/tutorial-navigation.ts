import type { TutorialSection } from './sections';

export const TUTORIAL_PREFS_STORAGE_KEY = 'tutorial-prefs:v2';
export const LEGACY_TUTORIAL_PREFS_STORAGE_KEY = 'tutorial-prefs:v1';

export interface TutorialPrefs {
  activeId: string;
}

type ReadableStorage = Pick<Storage, 'getItem'>;
type WritableStorage = Pick<Storage, 'setItem'>;

function firstSectionId(sections: readonly TutorialSection[]) {
  return sections[0]?.id ?? '';
}

function isSectionId(id: unknown, sections: readonly TutorialSection[]): id is string {
  return typeof id === 'string' && sections.some((section) => section.id === id);
}

function parsePrefs(raw: string | null, sections: readonly TutorialSection[]): TutorialPrefs | null {
  if (!raw) return null;

  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object' || !('activeId' in data)) return null;
    const activeId = (data as { activeId?: unknown }).activeId;
    return isSectionId(activeId, sections) ? { activeId } : null;
  } catch {
    return null;
  }
}

export function readTutorialPrefs(
  storage: ReadableStorage,
  sections: readonly TutorialSection[]
): TutorialPrefs {
  try {
    return (
      parsePrefs(storage.getItem(TUTORIAL_PREFS_STORAGE_KEY), sections) ??
      parsePrefs(storage.getItem(LEGACY_TUTORIAL_PREFS_STORAGE_KEY), sections) ?? {
        activeId: firstSectionId(sections)
      }
    );
  } catch {
    return { activeId: firstSectionId(sections) };
  }
}

export function writeTutorialPrefs(storage: WritableStorage, prefs: TutorialPrefs) {
  try {
    storage.setItem(TUTORIAL_PREFS_STORAGE_KEY, JSON.stringify({ activeId: prefs.activeId }));
  } catch {
    // Storage can be unavailable in private mode or restrictive embeds.
  }
}

export function resolveInitialSectionId(
  locationHash: string,
  storedPrefs: TutorialPrefs,
  sections: readonly TutorialSection[]
): string {
  const hashId = locationHash.startsWith('#') ? locationHash.slice(1) : locationHash;
  if (isSectionId(hashId, sections)) return hashId;
  if (isSectionId(storedPrefs.activeId, sections)) return storedPrefs.activeId;
  return firstSectionId(sections);
}

export function getAdjacentSectionId(
  activeId: string,
  direction: -1 | 1,
  sections: readonly TutorialSection[]
): string {
  const currentIndex = sections.findIndex((section) => section.id === activeId);
  if (currentIndex < 0) return firstSectionId(sections);
  const nextIndex = Math.min(Math.max(currentIndex + direction, 0), sections.length - 1);
  return sections[nextIndex]?.id ?? activeId;
}
