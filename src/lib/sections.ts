export function toAnchorId(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

export interface TutorialSection {
  number: number;
  title: string;
  description: string;
  id: string;
}

const SECTION_DEFS = [
  {
    number: 1,
    title: 'State Management',
    description: 'useState + useEffect - The foundation of React components'
  },
  {
    number: 2,
    title: 'Component Architecture',
    description: 'Props & Composition - Building reusable components'
  },
  {
    number: 3,
    title: 'Conditional Rendering',
    description: 'Showing the right content at the right time (Loading states, error states, feature flags)'
  },
  {
    number: 4,
    title: 'Data Display',
    description: 'List Rendering & Keys - Efficiently displaying arrays of data'
  },
  {
    number: 5,
    title: 'User Interaction',
    description: 'Event Handling & Forms - Managing user input and validation'
  },
  {
    number: 6,
    title: 'Global State',
    description: 'Context API - Sharing state across components without prop drilling - useCallback'
  },
  {
    number: 7,
    title: 'Advanced Patterns',
    description: 'Custom Hooks & Performance - Reusable logic and optimization'
  }
] as const;

export const TUTORIAL_SECTIONS: TutorialSection[] = SECTION_DEFS.map((section) => ({
  ...section,
  id: toAnchorId(section.title)
}));

export function isTutorialSectionId(id: string): boolean {
  return TUTORIAL_SECTIONS.some((section) => section.id === id);
}
