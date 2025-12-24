// =====================================
// PATTERN 1: useState - State Management
// =====================================

/*
🎯 KEY TAKEAWAYS | 关键要点:
• useState triggers automatic UI re-renders when state changes
• 当状态变化时，useState 会触发 UI 自动重新渲染
• Regular variables change internally but don't update the UI
• 普通变量只在内部改变，不会更新 UI
• useState is React's way of connecting data to the visual interface
• useState 是将数据与可视界面连接的方式
• Always use setState functions, never mutate state directly
• 总是使用 setState 函数，不要直接修改 state
*/

'use client';

import React, { useState } from 'react';
import { Title } from './Title';

export const Counter = () => {
  // 🐍 Python equivalent: self.count = 0 in __init__(对比：在 __init__ 中设置 self.count = 0)
  // But Python needs manual UI updates, React auto-updates!(但 Python 需要手动更新 UI，而 React 会自动更新！)

  // ❌ BAD: Variable doesn't trigger re-renders(不佳：变量不会触发重新渲染)
  // let count = 0;
  // const increment = () => {
  //   count += 1;  // Changes but UI doesn't update!
  //   console.log('Count changed to:', count); // Only shows in console
  // };
  // const decrement = () => {
  //   count -= 1;  // Changes but UI doesn't update!
  //   console.log('Count changed to:', count);
  // };
  // const reset = () => {
  //   count = 0;  // Changes but UI doesn't update!
  //   console.log('Count reset to:', count);
  // };

  // ✅ GOOD: useState triggers automatic re-renders
  // ✅ 良好：useState 会触发自动重新渲染
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="widget">
      <Title icon="🔢" title="Counter Widget" patternBadge="useState" />
      <div className="text-center mb-4">
        <div className="text-3xl font-bold my-4">{count}</div>
        <p className="text-sm mb-0" style={{ color: 'var(--muted-foreground)' }}>
          Click buttons to see automatic re-renders
        </p>
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={decrement} className="btn btn-secondary">
          -
        </button>
        <button onClick={reset} className="btn btn-secondary">
          Reset
        </button>
        <button onClick={increment} className="btn btn-primary">
          +
        </button>
      </div>
    </div>
  );
};
