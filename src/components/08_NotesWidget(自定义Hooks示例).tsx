// =====================================
// PATTERN 8: Custom Hooks & Performance -- useMemo
// =====================================

/*
🎯 KEY TAKEAWAYS | 关键要点:
• Custom hooks extract reusable stateful logic between components
• 自定义 hook 抽离可复用的有状态逻辑
• useMemo prevents expensive calculations on every render
• useMemo 避免每次渲染都进行昂贵计算
• Only memoize when you have actual performance problems
• 仅在存在实际性能问题时再做记忆化
• Custom hooks follow the same rules as built-in hooks
• 自定义 hook 遵循与内置 hook 相同的规则
• Hooks must start with "use" and only be called at top level
• hook 必须以 "use" 开头，并只在顶层调用
• localStorage integration is a perfect use case for custom hooks
• 将 localStorage 封装为自定义 hook 是极佳用例
*/

'use client';

import { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CustomButton } from './03_ButtonShowcase(Props示例)';
import { Title } from './Title';

// Custom hook - reusable logic
// 自定义 hook —— 可复用逻辑
// Note: The actual implementation is now in src/hooks/useLocalStorage.ts for better organization
// 说明：实际实现已迁移至 src/hooks/useLocalStorage.ts 以便更好组织

export const NotesWidget = () => {
  const [notes, setNotes] = useLocalStorage<string[]>('tutorial-notes', []);
  const [newNote, setNewNote] = useState('');

  // ❌ BAD: Expensive calculation runs on every render (even when notes don't change)
  // ❌ 不佳：开销大的计算在每次渲染都会执行（即便 notes 未变）
  // const noteStats = {
  //   total: notes.length,
  //   long: notes.filter(note => note.length > 10).length,
  //   avgLength: notes.reduce((sum, note) => sum + note.length, 0) / notes.length
  // };
  // console.log('📊 Calculating note statistics...'); // This runs on EVERY render!

  // ✅ GOOD: useMemo only recalculates when notes change
  // ✅ 良好：useMemo 仅在 notes 变化时重新计算
  // 🐍 Python: Like @lru_cache decorator
  // 🐍 Python 类比：类似 @lru_cache 装饰器
  const noteStats = useMemo(() => {
    console.log('📊 Calculating note statistics...'); // You'll only see this when notes change
    return {
      total: notes.length,
      long: notes.filter((note) => note.length > 10).length,
      avgLength: notes.length > 0 ? Math.round(notes.reduce((sum, note) => sum + note.length, 0) / notes.length) : 0
    };
  }, [notes]);

  const addNote = useCallback(() => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  }, [notes, newNote, setNotes]);

  const clearNotes = useCallback(() => {
    setNotes([]);
  }, [setNotes]);

  return (
    <div className="widget">
      <Title icon="📚" title="Smart Notes" patternBadge="Custom Hooks" />

      <div
        className="grid grid-cols-3 gap-2 text-center p-3 rounded mb-4"
        style={{
          background: 'var(--muted)'
        }}
      >
        <div>
          <div className="font-bold">{noteStats.total}</div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Notes
          </div>
        </div>
        <div>
          <div className="font-bold">{noteStats.long}</div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Long
          </div>
        </div>
        <div>
          <div className="font-bold">{noteStats.avgLength}</div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Avg chars
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="input flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
          />
          <CustomButton onClick={addNote}>Add</CustomButton>
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {notes.length === 0 ? (
          <p
            className="text-sm text-center p-4"
            style={{
              color: 'var(--muted-foreground)'
            }}
          >
            No notes yet. Add one above!
          </p>
        ) : (
          notes.map((note, index) => (
            <div key={index} className="note-item">
              {note}
            </div>
          ))
        )}
      </div>

      {notes.length > 0 && (
        <div className="mt-4 text-center">
          <CustomButton variant="destructive" onClick={clearNotes}>
            Clear All Notes
          </CustomButton>
        </div>
      )}
    </div>
  );
};
