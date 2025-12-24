// =====================================
// PATTERN 7: Context API (Global State)
// =====================================

/*
🎯 KEY TAKEAWAYS | 关键要点:
• Context API eliminates "prop drilling" (passing props through many levels)
• Context API 可消除"属性层层传递"（跨多层传递 props）
• Create context with createContext, provide with Provider, consume with useContext/use
• 使用 createContext 创建、用 Provider 提供、用 useContext/use 消费
• Only use context for truly global state (theme, user auth, language)
• 仅在真正全局的状态中使用（主题、用户认证、语言）
• Don't overuse context - local state is often better
• 不要滥用 context —— 局部 state 往往更好
• Always check if context exists before using it
• 使用前务必检查 context 是否存在
*/

'use client';

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { CustomButton } from './03_ButtonShowcase(Props示例)';
import { Title } from './Title';

// ❌ BAD: Prop drilling nightmare - passing props through every level
// function App() {
//   const [theme, setTheme] = useState('light');
//   return (
//     <Header theme={theme} setTheme={setTheme} />
//     <Main theme={theme} setTheme={setTheme} />
//     <Footer theme={theme} setTheme={setTheme} />
//   );
// }
// function Header({ theme, setTheme }) {
//   return <Nav theme={theme} setTheme={setTheme} />;
// }
// function Nav({ theme, setTheme }) {
//   return <ThemeButton theme={theme} onClick={setTheme} />;
// }

// ✅ GOOD: Context API eliminates prop drilling (Context API 消除了层层传递 props)
// 🐍 Python: Like a global variable, but better managed (类比：像全局变量，但管理更规范)
// Note: The actual implementation is now in src/contexts/ThemeContext.tsx for better organization (说明：实际实现已移动到 src/contexts/ThemeContext.tsx，便于组织)

export const ThemeToggle = () => {
  // Using the custom hook from our contexts folder
  // 使用 contexts 目录中的自定义 hook
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="widget">
      <Title icon="🎨" title="Theme Switcher" patternBadge="Context API" />
      <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
        Global state without prop drilling
        {/* 无需层层传递的全局状态 */}
      </p>
      <div className="text-center">
        <div className="text-xl mb-4">
          Current theme: <strong>{theme}</strong>
        </div>
        {/* 切换主题模式 */}
        <CustomButton onClick={toggleTheme}>Switch to {theme === 'light' ? '🌙 Dark' : '☀️ Light'} mode</CustomButton>
      </div>
    </div>
  );
};
