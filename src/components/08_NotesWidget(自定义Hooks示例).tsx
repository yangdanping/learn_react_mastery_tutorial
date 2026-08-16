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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CustomButton } from './03_ButtonShowcase(Props示例)';
import { Input } from './ui/input';
import { Title } from './Title';
import type { Note } from './types';

function isNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { id?: unknown; text?: unknown };
  return typeof candidate.id === 'string' && typeof candidate.text === 'string';
}

function normalizeStoredNotes(value: unknown): Note[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((note, index) => {
    if (typeof note === 'string') return [{ id: `legacy-${index}-${note.length}`, text: note }];
    return isNote(note) ? [note] : [];
  });
}

function isCanonicalNotes(value: unknown): value is Note[] {
  return Array.isArray(value) && value.every(isNote);
}

function createNoteId() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Custom hook - reusable logic
// 自定义 hook —— 可复用逻辑
// Note: The actual implementation is now in src/hooks/useLocalStorage.ts for better organization
// 说明：实际实现已迁移至 src/hooks/useLocalStorage.ts 以便更好组织

export const NotesWidget = () => {
  const [storedNotes, setStoredNotes] = useLocalStorage<unknown>('tutorial-notes', []);
  const [newNote, setNewNote] = useState('');
  const notes = useMemo(() => normalizeStoredNotes(storedNotes), [storedNotes]);

  useEffect(() => {
    if (!isCanonicalNotes(storedNotes)) setStoredNotes(notes);
  }, [notes, setStoredNotes, storedNotes]);

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
    return {
      total: notes.length,
      long: notes.filter((note) => note.text.length > 10).length,
      avgLength: notes.length > 0 ? Math.round(notes.reduce((sum, note) => sum + note.text.length, 0) / notes.length) : 0
    };
  }, [notes]);

  const addNote = useCallback(() => {
    if (newNote.trim()) {
      const note: Note = { id: createNoteId(), text: newNote.trim() };
      setStoredNotes((current: unknown) => [...normalizeStoredNotes(current), note]);
      setNewNote('');
    }
  }, [newNote, setStoredNotes]);

  const clearNotes = useCallback(() => {
    setStoredNotes([]);
  }, [setStoredNotes]);

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
          <Input
            aria-label="Add a note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="input flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') addNote();
            }}
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
          notes.map((note) => (
            <div key={note.id} className="note-item">
              {note.text}
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
