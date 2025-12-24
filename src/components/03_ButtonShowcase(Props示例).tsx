// =====================================
// PATTERN 3: Props & Component Composition
// =====================================

/*
🎯 KEY TAKEAWAYS | 关键要点:
• Props make components reusable instead of hardcoded
• 通过 props 让组件可复用，而不是写死内容
• One flexible component is better than many rigid components
• 一个灵活组件优于多个僵硬组件
• TypeScript interfaces define what props a component expects
• TypeScript 接口用于定义组件所需的 props
• Default parameters make components more convenient to use
• 默认参数让组件更易用
• Component composition allows building complex UIs from simple parts
• 组件组合能用简单拼装构建复杂 UI
*/

'use client';

import React, { memo, useState } from 'react';
import { ButtonProps } from './types';
import { Title } from './Title';
// ❌ BAD: Hardcoded, not reusable(硬编码，不可复用)
// function SubmitButton() {
//   return <button className="btn btn-primary">Submit</button>;
// }
// function CancelButton() {
//   return <button className="btn btn-secondary">Cancel</button>;
// }

// ✅ GOOD: Reusable component with props(可复用组件)
export const CustomButton = memo((props: ButtonProps) => {
  // 🐍 Python: Like function parameters with defaults(就像带默认值的函数参数)
  // def button(variant='primary', children=None, on_click=None, disabled=False):
  const { variant = 'primary', children, onClick, disabled = false, type = 'button', style, className } = props;
  return (
    <button className={`btn btn-${variant} ${className || ''}`} onClick={onClick} disabled={disabled} type={type} style={style}>
      {children}
    </button>
  );
});

export const ButtonShowcase = () => {
  return (
    <div className="widget">
      <Title icon="🎨" title="CustomButton Variants" patternBadge="Props" />
      <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
        One component, multiple styles via props
      </p>
      <div className="flex flex-row gap-3 justify-center">
        {/* 复用同一个组件 */}
        <CustomButton variant="primary" onClick={() => alert('Primary!')}>
          Primary CustomButton
        </CustomButton>
        <CustomButton variant="secondary" onClick={() => alert('Secondary!')}>
          Secondary CustomButton
        </CustomButton>
        <CustomButton variant="destructive" onClick={() => alert('Danger!')}>
          Destructive CustomButton
        </CustomButton>
        <CustomButton disabled onClick={() => alert('Never fires')}>
          Disabled CustomButton
        </CustomButton>
        <CustomButton variant="primary" onClick={() => alert('Sean is on fire!')}>
          Sean CustomButton
        </CustomButton>
      </div>
    </div>
  );
};
