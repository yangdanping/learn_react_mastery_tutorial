/**
 * File: src/components/Dashboard.tsx
 *
 * Progressive React Tutorial - Personal Dashboard
 * 渐进式 React 教程 - 个人仪表盘
 * Uncomment sections as you teach each pattern!
 * 教学时按需取消注释对应模块
 */

'use client';

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Counter } from './01_Counter(useState示例)';
import { Clock } from './02_Clock(useEffect示例)';
import { ButtonShowcase } from './03_ButtonShowcase(Props示例)';
import { UserProfile } from './04_UserProfile(条件渲染示例)';
import { TodoList } from './05_TodoList(列表渲染示例)';
import { ContactForm } from './06_ContactForm(表单处理示例)';
import { ThemeToggle } from './07_ThemeToggle(Context API示例)';
import { NotesWidget } from './08_NotesWidget(自定义Hooks示例)';
import { Section } from './Section';

// =====================================
// MAIN DASHBOARD COMPONENT
// 主页仪表盘组件(示例组件现已从独立文件中导入)
// =====================================
const DashboardContent = () => {
  // Using the custom hook from our contexts folder
  // 使用来自 contexts 目录的自定义 hook
  const { theme } = useTheme();

  return (
    <div className={`dashboard-center ${theme}`}>
      {/* Foundation Patterns */}
      {/* 基础模式 */}
      <Section number={1} title="State Management" description="useState + useEffect - The foundation of React components">
        <Counter />
        <Clock />
      </Section>

      <Section number={2} title="Component Architecture" description="Props & Composition - Building reusable components">
        <ButtonShowcase />
      </Section>

      <Section number={3} title="Conditional Rendering" description="Showing the right content at the right time (Loading states, error states, feature flags)">
        <UserProfile />
      </Section>

      <Section number={4} title="Data Display" description="List Rendering & Keys - Efficiently displaying arrays of data">
        <TodoList />
      </Section>

      <Section number={5} title="User Interaction" description="Event Handling & Forms - Managing user input and validation">
        <ContactForm />
      </Section>

      <Section number={6} title="Global State" description="Context API - Sharing state across components without prop drilling - useCallback">
        <ThemeToggle />
      </Section>

      <Section number={7} title="Advanced Patterns" description="Custom Hooks & Performance - Reusable logic and optimization">
        <NotesWidget />
      </Section>
    </div>
  );
};

const Dashboard = () => {
  return <DashboardContent />;
};

export default Dashboard;
