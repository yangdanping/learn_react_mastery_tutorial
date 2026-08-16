// =====================================
// PATTERN 4: Conditional Rendering - Loading states, error states, feature flags
// =====================================

/*
🎯 KEY TAKEAWAYS | 关键要点:
• Show different UI based on state (loading, error, success)
• 根据状态展示不同的 UI（加载、错误、成功）
• Use logical operators (&&) for simple show/hide conditions
• 用逻辑与（&&）处理简单的显示/隐藏
• Chain conditions to handle multiple states properly
• 通过条件分支链式判断正确处理多种状态
• Never show all states simultaneously - confuses users
• 不要同时展示所有状态——会让用户困惑
• Loading states improve user experience during async operations
• 异步操作中，加载状态可提升用户体验
*/

'use client';

import { useEffect, useState } from 'react';
import { CustomButton } from './03_ButtonShowcase(Props示例)';
import type { User } from './types';
import { Title } from './Title';
import { generateRandomNumber } from '../utils/getRamdomNum';

export const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    setUser(null);
    setRandomNumber(null);

    // Simulate API call
    setTimeout(() => {
      const random = generateRandomNumber(0, 1);
      // Store the random number in state to display in UI
      setRandomNumber(random);
      console.log('04_UserProfile Random number: ', random);

      if (random > 0.7) {
        setError('Failed to load user data');
      } else {
        setUser({ name: 'John Doe', email: 'john@example.com' });
      }
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ❌ BAD: Shows everything at once - confusing to users!(一次性展示所有状态——极其混乱)
  // return (
  //   <div className="widget">
  //     <h3>User Profile</h3>
  //     <div>Loading...</div>
  //     <div>Error: Something went wrong</div>
  //     <div>Welcome, John!</div>
  //     <div>Please log in</div>
  //   </div>
  // );

  // ✅ GOOD: Show appropriate state(仅展示与当前状态相符的内容)
  return (
    <div className="widget">
      <Title icon="👤" title="User Profile" patternBadge="Conditional" />

      {loading && (
        <div className="text-center p-8">
          <div className="status-loading">Loading user data...</div>
        </div>
      )}

      {error && (
        <div className="text-center p-8">
          <div className="status-error">❌ {error}</div>
          {randomNumber !== null && (
            <div className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Random number: <strong>{randomNumber.toFixed(3)}</strong>
              <span className="tint-text-destructive"> (&gt; 0.7 = Error)</span>
            </div>
          )}
          <CustomButton onClick={fetchUser} variant="secondary" className="mt-4">
            Try Again
          </CustomButton>
        </div>
      )}

      {!loading && !error && !user && (
        <div className="text-center p-8">
          <div className="status-loading">Please log in</div>
        </div>
      )}

      {user && (
        <div>
          <div className="status-success">✅ User loaded successfully!</div>
          {randomNumber !== null && (
            <div className="text-center mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Random number: <strong>{randomNumber.toFixed(3)}</strong>
              <span className="tint-text-success"> (≤ 0.7 = Success)</span>
            </div>
          )}
          <div className="mt-4">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
          <CustomButton onClick={fetchUser} variant="secondary" className="mt-4">
            Reload User
          </CustomButton>
        </div>
      )}
    </div>
  );
};
