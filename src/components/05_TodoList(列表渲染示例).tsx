// =====================================
// PATTERN 5: List Rendering & Keys
// =====================================

/*
🎯 KEY TAKEAWAYS | 关键要点:
• Always use unique keys when rendering lists in React
• 在渲染列表时务必使用唯一 key
• Keys help React track which items changed, added, or removed
• key 帮助 React 追踪哪些项被修改、添加或移除
• Without keys, React may incorrectly update or re-render components
• 没有 key，React 可能会错误更新或重渲染组件
• Use stable, unique identifiers as keys (not array indexes when possible)
• 使用稳定且唯一的标识作为 key（尽量不要用数组索引）
• Array indexes as keys can cause bugs when list order changes
• 当列表顺序变化时，使用索引作为 key 可能导致问题
*/

'use client';

import React, { memo, useState } from 'react';
import { Todo } from './types';
import { Title } from './Title';
import c from 'classnames';
const ProgressBar = ({ completedCount, total }: any) => {
  return (
    <>
      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
        Progress: {completedCount}/{total} completed
      </p>
      <div className="h-2 rounded overflow-hidden" style={{ background: 'var(--muted)' }}>
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            background: 'var(--primary)',
            width: `${(completedCount / total) * 100}%`
          }}
        />
      </div>
    </>
  );
};

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React useState', completed: true },
    { id: 2, text: 'Master useEffect', completed: true },
    { id: 3, text: 'Understand props', completed: false },
    { id: 4, text: 'Practice conditional rendering', completed: false },
    { id: 5, text: 'Build awesome apps', completed: false }
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  return (
    <div className="widget">
      <Title icon="📝" title="Learning Checklist" patternBadge="List Rendering" />
      {/* 进度条 */}
      <div className="mb-4">
        <ProgressBar completedCount={todos.filter((todo) => todo.completed).length} total={todos.length} />
      </div>
      1{/* ❌ BAD: No keys - React gets confused when list changes(没有 key —— 列表变化时 React 难以追踪) */}
      {/* <div>
        <h3>This is the bad example</h3>
        {todos.map(todo =>  <div onClick={() => toggleTodo(todo.id)} className="todo-item">...</div> )}
      </div> */}
      {/* ✅ GOOD: Unique keys help React track items(唯一 key 帮助 React 精确追踪) */}
      <div>
        <h3>This is the good example</h3>
        {todos.map((todo) => (
          <div key={todo.id} onClick={() => toggleTodo(todo.id)} className={c('todo-item', { 'todo-completed': todo.completed })}>
            <span className="mr-2">{todo.completed ? '✅' : '⬜'}</span> <span>{todo.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
