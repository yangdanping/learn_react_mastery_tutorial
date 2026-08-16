// =====================================
// SECTION COMPONENT FOR ORGANIZATION
// =====================================

'use client';

import type { ReactNode, Ref } from 'react';

interface SectionProps {
  id: string;
  number: number;
  title: string;
  description: string;
  headingRef?: Ref<HTMLHeadingElement>;
  children: ReactNode;
}

export const Section = ({ id, number, title, description, headingRef, children }: SectionProps) => {
  return (
    <section className="tutorial-section" id={id}>
      <div className="section-inner">
        <div className="section-header">
          <div className="pattern-number" aria-hidden="true">
            {number}
          </div>
          <div>
            <h2 className="section-title" ref={headingRef} tabIndex={-1}>
              {title}
            </h2>
            <p className="section-description">{description}</p>
          </div>
        </div>
        <div className="widgets-grid">{children}</div>
      </div>
    </section>
  );
};
