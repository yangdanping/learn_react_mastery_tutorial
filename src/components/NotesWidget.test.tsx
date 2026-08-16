import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { NotesWidget } from './08_NotesWidget(自定义Hooks示例)';

describe('NotesWidget persistence', () => {
  beforeEach(() => localStorage.clear());

  it('migrates legacy string notes to records with stable IDs', async () => {
    localStorage.setItem('tutorial-notes', JSON.stringify(['复习 useEffect']));
    render(<NotesWidget />);

    expect(screen.getByText('复习 useEffect')).toBeInTheDocument();
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('tutorial-notes') ?? '[]')).toEqual([
        { id: expect.any(String), text: '复习 useEffect' }
      ]);
    });
  });

  it('recovers from syntactically valid storage with the wrong shape', async () => {
    localStorage.setItem('tutorial-notes', JSON.stringify({ text: 'not an array' }));

    expect(() => render(<NotesWidget />)).not.toThrow();
    expect(screen.getByText('No notes yet. Add one above!')).toBeInTheDocument();
    await waitFor(() => expect(localStorage.getItem('tutorial-notes')).toBe('[]'));
  });

  it('keeps valid notes while discarding malformed array entries', async () => {
    localStorage.setItem(
      'tutorial-notes',
      JSON.stringify(['legacy', { id: 'valid-id', text: 'valid record' }, null, { id: 1 }])
    );

    render(<NotesWidget />);

    expect(screen.getByText('legacy')).toBeInTheDocument();
    expect(screen.getByText('valid record')).toBeInTheDocument();
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('tutorial-notes') ?? '[]')).toEqual([
        { id: expect.any(String), text: 'legacy' },
        { id: 'valid-id', text: 'valid record' }
      ]);
    });
  });
});
