'use client';

import { memo } from 'react';
import { TitleProps } from './types';

export const Title = memo(({ icon, title, patternBadge }: TitleProps) => {
  console.log('Title rendered');
  return (
    <h3>
      <span className="widget-icon">{icon}</span>
      {title}
      <span className="pattern-badge">{patternBadge}</span>
    </h3>
  );
});
Title.displayName = 'Title';
