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

import { memo } from 'react';
import type { ButtonProps } from './types';
import { PROPS_COMPOSITION_PRACTICE, PROPS_COMPOSITION_THEME_ID } from '@/lib/theme-practice';
import { tutorialLog } from '@/lib/tutorial-log';
import { PracticeWidget } from './PracticeWidget';
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
  const { variant = 'primary', children, className, type = 'button', ...buttonProps } = props;
  return (
    <button {...buttonProps} className={`btn btn-${variant} ${className || ''}`} type={type}>
      {children}
    </button>
  );
});

export const ButtonShowcase = () => {
  const clickVariant = (variant: string, message: string) => () => {
    tutorialLog(PROPS_COMPOSITION_THEME_ID, `同一个 CustomButton，variant=${variant}`);
    alert(message);
  };

  return (
    <PracticeWidget
      icon="🎨"
      title="CustomButton Variants"
      patternBadge="Props"
      practice={PROPS_COMPOSITION_PRACTICE}
    >
      <div className="flex flex-row flex-wrap gap-3 justify-center">
        {/* 复用同一个组件 */}
        <CustomButton variant="primary" onClick={clickVariant('primary', 'Primary!')}>
          Primary CustomButton
        </CustomButton>
        <CustomButton variant="secondary" onClick={clickVariant('secondary', 'Secondary!')}>
          Secondary CustomButton
        </CustomButton>
        <CustomButton variant="destructive" onClick={clickVariant('destructive', 'Danger!')}>
          Destructive CustomButton
        </CustomButton>
        <CustomButton
          disabled
          onClick={() => tutorialLog(PROPS_COMPOSITION_THEME_ID, 'disabled 的 onClick 不应出现这条')}
        >
          Disabled CustomButton
        </CustomButton>
        <CustomButton variant="primary" onClick={clickVariant('primary', 'Sean is on fire!')}>
          Sean CustomButton
        </CustomButton>
      </div>
    </PracticeWidget>
  );
};
