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
import { EFFECT_CLEANUP_PRACTICE, EFFECT_CLEANUP_THEME_ID } from '@/lib/theme-practice';
import { tutorialLog } from '@/lib/tutorial-log';
import { PracticeWidget } from './PracticeWidget';

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
    tutorialLog(EFFECT_CLEANUP_THEME_ID, 'setup: setInterval', timer);

    // 🐍 Python: Like __exit__ in context manager (Python 类比：类似上下文管理器中的 __exit__)
    return () => {
      tutorialLog(EFFECT_CLEANUP_THEME_ID, 'cleanup: clearInterval', timer);
      clearInterval(timer);
    };
  }, []);

  return (
    <PracticeWidget icon="⏰" title="Live Clock" patternBadge="useEffect" practice={EFFECT_CLEANUP_PRACTICE}>
      <div className="text-center">
        <div className="text-2xl font-bold my-4">{time ? time.toLocaleTimeString() : '--:--:-- --'}</div>
      </div>
    </PracticeWidget>
  );
};
