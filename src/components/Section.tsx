// =====================================
// SECTION COMPONENT FOR ORGANIZATION
// =====================================

'use client';

import React from 'react';

interface SectionProps {
  id: string;
  number: number;
  title: string;
  description: string;
  hideHeader?: boolean;
  children: React.ReactNode;
}

export const Section = ({ id, number, title, description, hideHeader = false, children }: SectionProps) => {
  return (
    <section className="tutorial-section" id={id}>
      <div className="section-inner">
        {hideHeader ? null : (
          <div className="section-header">
            <div className="pattern-number">{number}</div>
            <div>
              <div className="section-title">{title}</div>
              <div className="section-description">{description}</div>
            </div>
          </div>
        )}
        <div className="widgets-grid">{children}</div>
      </div>
    </section>
  );
};
