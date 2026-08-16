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

'use client';

import { useEffect, useState } from 'react';
import { Title } from './Title';

export const Clock = () => {
  const [time, setTime] = useState<Date | null>(null);
  const [showBadExample, setShowBadExample] = useState(false);
  const [renderCount] = useState(0);

  // // Track renders for demonstration
  // useEffect(() => setRenderCount((prev) => prev + 1));

  // // ❌ BAD: Side effect in render function (when demo is active)
  // if (showBadExample) {
  //   console.log(`🔥 重新渲染了 ${renderCount} 次: 创建了新timer...`);
  //   setTimeout(() => {
  //     setTime(new Date()); // This will trigger another render!(会触发重新渲染)
  //   }, 1000);
  // }

  // ✅ GOOD: useEffect handles side effects properly
  // ✅ 良好：使用 useEffect 正确处理副作用
  useEffect(() => {
    if (!showBadExample) {
      // Fix hydration mismatch by only setting time after client mount
      // 通过仅在客户端挂载后设置时间来修复水合不匹配
      setTime(new Date());

      // 🐍 Python: Like __enter__ in context manager(类比：类似上下文管理器中的 __enter__)
      const timer = setInterval(() => setTime(new Date()), 1000);

      // 🐍 Python: Like __exit__ in context manager (Python 类比：类似上下文管理器中的 __exit__)
      return () => {
        console.log('Clock 清理函数执行');
        clearInterval(timer);
      }; // 清理可防止内存泄漏
    }
  }, [showBadExample]); // Re-run when demo mode changes(当演示模式变化时重新运行)

  return (
    <div className="widget">
      <Title icon="⏰" title="Live Clock" patternBadge="useEffect" />

      {/* Demo Toggle(演示切换) */}
      <div className="mb-4 text-center">
        <button onClick={() => setShowBadExample(!showBadExample)} className={`btn ${showBadExample ? 'btn-destructive' : 'btn-secondary'}`}>
          {showBadExample ? '🛑 Stop Bad Demo' : '🔥 Show Bad Example'}
        </button>
      </div>

      {/* Visual Feedback(可视化反馈) */}
      {showBadExample && (
        <div className="rounded mb-4 text-center p-2 tint tint-destructive">
          <div className="text-sm font-bold tint-text-destructive">
            ⚠️ Renders: {renderCount} | Check console!
          </div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            New timer created every render
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="text-2xl font-bold my-4">{time ? time.toLocaleTimeString() : '--:--:-- --'}</div>
        <p className="text-sm mb-0" style={{ color: 'var(--muted-foreground)' }}>
          {showBadExample ? '🚨 Using setTimeout in render (creating memory leaks!)' : 'Updates every second with automatic cleanup'}
        </p>
      </div>
    </div>
  );
};
