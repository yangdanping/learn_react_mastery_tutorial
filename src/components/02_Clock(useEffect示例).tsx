// =====================================
// PATTERN 2: useEffect - Side Effects
// =====================================

/*
🎯 KEY TAKEAWAYS | 关键要点:
• useEffect handles side effects (timers, API calls, subscriptions)
• useEffect 负责处理副作用（定时器、API 调用、订阅）
• Never run side effects directly in render function - causes infinite loops
• 不要在渲染函数内直接执行副作用——会导致无限循环
• Always clean up side effects to prevent memory leaks
• 始终清理副作用以避免内存泄漏
• Empty dependency array [] means "run once on mount"
• 依赖数组为空 [] 表示仅在挂载时运行一次
• useEffect cleanup function runs when component unmounts
• 组件卸载时会执行 useEffect 的清理函数
*/

import { useEffect, useState } from 'react';
import { Title } from './Title';

export const Clock = () => {
  const [time, setTime] = useState<Date | null>(null);

  // ❌ BAD: Calling setTimeout during render creates another timer on every render.
  // 不佳：在 render 中调用 setTimeout，会在每次渲染时创建新的计时器。
  // This anti-pattern stays as source commentary instead of running in the page.

  // ✅ GOOD: useEffect handles side effects properly
  // ✅ 良好：使用 useEffect 正确处理副作用
  useEffect(() => {
    setTime(new Date());

    // 🐍 Python: Like __enter__ in context manager(类比：类似上下文管理器中的 __enter__)
    const timer = setInterval(() => setTime(new Date()), 1000);

    // 🐍 Python: Like __exit__ in context manager (Python 类比：类似上下文管理器中的 __exit__)
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="widget">
      <Title icon="⏰" title="Live Clock" patternBadge="useEffect" />

      <div className="rounded mb-4 p-3 tint tint-primary text-sm">
        离开本章时组件会卸载，Effect cleanup 会立即清除 interval；错误写法保留在源码注释中。
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold my-4">{time ? time.toLocaleTimeString() : '--:--:-- --'}</div>
        <p className="text-sm mb-0" style={{ color: 'var(--muted-foreground)' }}>
          Updates every second with automatic cleanup
        </p>
      </div>
    </div>
  );
};
