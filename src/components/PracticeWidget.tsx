import type { ReactNode } from 'react';
import type { ThemePractice } from '@/lib/theme-practice';
import { ThemePracticeNotes } from './ThemePracticeNotes';
import { Title } from './Title';

interface PracticeWidgetProps {
  icon: string;
  title: string;
  patternBadge: string;
  practice: ThemePractice;
  children: ReactNode;
}

export function PracticeWidget({ icon, title, patternBadge, practice, children }: PracticeWidgetProps) {
  return (
    <div className="widget">
      <Title icon={icon} title={title} patternBadge={patternBadge} />
      <ThemePracticeNotes practice={practice}>{children}</ThemePracticeNotes>
    </div>
  );
}
