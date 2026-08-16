import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NotesWidget } from './08_NotesWidget(自定义Hooks示例)';

describe('NotesWidget persistence', () => {
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
});
