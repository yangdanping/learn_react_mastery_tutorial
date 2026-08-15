/**
 * File: src/components/Dashboard.tsx
 *
 * Progressive React Tutorial - Personal Dashboard
 * 渐进式 React 教程 - 个人仪表盘
 * Uncomment sections as you teach each pattern!
 * 教学时按需取消注释对应模块
 */

'use client';

import React, { Activity } from 'react';
import { Counter } from './01_Counter(useState示例)';
import { Clock } from './02_Clock(useEffect示例)';
import { ButtonShowcase } from './03_ButtonShowcase(Props示例)';
import { UserProfile } from './04_UserProfile(条件渲染示例)';
import { TodoList } from './05_TodoList(列表渲染示例)';
import { ContactForm } from './06_ContactForm(表单处理示例)';
import { ThemeToggle } from './07_ThemeToggle(Context API示例)';
import { NotesWidget } from './08_NotesWidget(自定义Hooks示例)';
import { Section } from './Section';
import { TableOfContents, type TocSide } from './TableOfContents';
import { TUTORIAL_SECTIONS } from '../lib/sections';

interface DashboardProps {
  tocSide?: TocSide;
  zenMode: boolean;
  activeId: string;
  onActiveIdChange: (id: string) => void;
  onEnterZen: () => void;
}

function renderSectionBody(id: string) {
  switch (id) {
    case 'state-management':
      return (
        <>
          <Counter />
          <Clock />
        </>
      );
    case 'component-architecture':
      return <ButtonShowcase />;
    case 'conditional-rendering':
      return <UserProfile />;
    case 'data-display':
      return <TodoList />;
    case 'user-interaction':
      return <ContactForm />;
    case 'global-state':
      return <ThemeToggle />;
    case 'advanced-patterns':
      return <NotesWidget />;
    default:
      return null;
  }
}

const DashboardContent = ({ zenMode, activeId }: { zenMode: boolean; activeId: string }) => {
  return (
    <div className="dashboard-center">
      {TUTORIAL_SECTIONS.map((section) => (
        <Activity
          key={section.id}
          name={section.title}
          // Hidden sections destroy Effects (timers/subscriptions) but keep widget state.
          // 隐藏章节会销毁 Effect（计时器/订阅），但保留组件内部状态。
          mode={!zenMode || section.id === activeId ? 'visible' : 'hidden'}
        >
          <Section
            id={section.id}
            number={section.number}
            title={section.title}
            description={section.description}
            hideHeader={zenMode}
          >
            {renderSectionBody(section.id)}
          </Section>
        </Activity>
      ))}
    </div>
  );
};

const Dashboard = ({
  tocSide = 'right',
  zenMode,
  activeId,
  onActiveIdChange,
  onEnterZen
}: DashboardProps) => {
  return (
    <>
      {zenMode ? null : (
        <TableOfContents
          side={tocSide}
          items={TUTORIAL_SECTIONS}
          activeId={activeId}
          onActiveIdChange={onActiveIdChange}
          onEnterZen={onEnterZen}
        />
      )}
      <DashboardContent zenMode={zenMode} activeId={activeId} />
    </>
  );
};

export default Dashboard;
