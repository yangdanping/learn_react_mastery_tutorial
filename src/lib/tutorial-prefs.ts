import { isTutorialSectionId, TUTORIAL_SECTIONS } from './sections';

export const TUTORIAL_PREFS_STORAGE_KEY = 'tutorial-prefs:v1';

export interface TutorialPrefs {
  activeId: string;
  zenMode: boolean;
}

export const DEFAULT_TUTORIAL_PREFS: TutorialPrefs = {
  activeId: TUTORIAL_SECTIONS[0]?.id ?? 'state-management',
  zenMode: false
};

export const TUTORIAL_PREFS_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem('${TUTORIAL_PREFS_STORAGE_KEY}');if(!raw)return;var p=JSON.parse(raw);if(!p||typeof p!=='object')return;var hash=location.hash.slice(1);var id=hash||p.activeId;if(p.zenMode===true)document.documentElement.classList.add('is-zen');if(typeof id==='string'&&id)document.documentElement.setAttribute('data-tutorial-section',id);}catch(e){}})();`;

function parseTutorialPrefs(raw: string | null): TutorialPrefs | null {
  if (!raw) return null;
  const data = JSON.parse(raw) as Partial<TutorialPrefs>;
  if (!data || typeof data !== 'object') return null;

  return {
    activeId: typeof data.activeId === 'string' && isTutorialSectionId(data.activeId) ? data.activeId : DEFAULT_TUTORIAL_PREFS.activeId,
    zenMode: data.zenMode === true
  };
}

export function readTutorialPrefs(): TutorialPrefs {
  try {
    return parseTutorialPrefs(localStorage.getItem(TUTORIAL_PREFS_STORAGE_KEY)) ?? DEFAULT_TUTORIAL_PREFS;
  } catch {
    return DEFAULT_TUTORIAL_PREFS;
  }
}

export function applyTutorialPrefsToDom(prefs: TutorialPrefs) {
  const root = document.documentElement;
  root.classList.toggle('is-zen', prefs.zenMode);
  if (prefs.activeId) {
    root.setAttribute('data-tutorial-section', prefs.activeId);
  } else {
    root.removeAttribute('data-tutorial-section');
  }
}

export function writeTutorialPrefs(prefs: TutorialPrefs) {
  try {
    localStorage.setItem(TUTORIAL_PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage can be unavailable in private mode
  }
  applyTutorialPrefsToDom(prefs);
}

export function resolveInitialTutorialPrefs(): TutorialPrefs {
  const stored = readTutorialPrefs();
  const hash = window.location.hash.slice(1);
  return {
    activeId: isTutorialSectionId(hash) ? hash : stored.activeId,
    zenMode: stored.zenMode
  };
}
