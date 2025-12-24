// =====================================
// SECTION COMPONENT FOR ORGANIZATION
// =====================================

'use client';

import React from 'react';

interface SectionProps {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

// 将标题转换为URL友好的锚点ID
// 例如: "State Management" -> "state-management"
const generateAnchorId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/[^\w\-]/g, ''); // 移除特殊字符
};

export const Section = ({ number, title, description, children }: SectionProps) => {
  const anchorId = generateAnchorId(title);

  return (
    <div className="tutorial-section" id={anchorId}>
      <div className="section-inner">
        <div className="section-header">
          <div className="pattern-number">{number}</div>
          <div>
            <a href={`#${anchorId}`} className="section-title-link">
              <div className="section-title">{title}</div>
            </a>
            <div className="section-description">{description}</div>
            {/* 上述标题/描述由父组件传入，这里只负责展示 */}
            {/* 点击标题可更新URL hash并定位到此section */}
          </div>
        </div>
        <div className="widgets-grid">{children}</div>
      </div>
    </div>
  );
};
