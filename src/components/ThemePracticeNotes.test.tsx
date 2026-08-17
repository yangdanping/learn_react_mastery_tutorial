import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EFFECT_CLEANUP_THEME_ID, getThemePractice } from '@/lib/theme-practice';
import { ThemePracticeNotes } from './ThemePracticeNotes';

describe('ThemePracticeNotes', () => {
  it('shows guesses, demo and check answers without quiz controls', () => {
    const practice = getThemePractice(EFFECT_CLEANUP_THEME_ID);
    if (!practice) throw new Error('effect-cleanup practice is missing');

    render(
      <ThemePracticeNotes practice={practice}>
        <p>live example</p>
      </ThemePracticeNotes>
    );

    expect(screen.getByRole('heading', { name: '操作前先猜' })).toBeInTheDocument();
    expect(screen.getByText(practice.predict[0])).toBeInTheDocument();
    expect(screen.getByText('live example')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '正确理解' })).toBeInTheDocument();
    expect(screen.getByText(practice.check[0])).toBeInTheDocument();
    expect(screen.queryByText('先在心里答一遍，再看下面的示例。不用写下来。')).not.toBeInTheDocument();
    expect(screen.queryByText('合上 Tutorial 后，只按这些判断是否做完。不必长得一样。')).not.toBeInTheDocument();
    expect(screen.getByText('effect-cleanup')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();

    const root = screen.getByText('live example').closest('.theme-practice');
    expect(root).not.toBeNull();
    const regions = [
      ...(root as HTMLElement).querySelectorAll(
        '.theme-practice-predict, .theme-practice-demo, .theme-practice-check'
      )
    ];
    expect(regions.map((node) => [...node.classList].find((name) => name.startsWith('theme-practice-') && name !== 'theme-practice-block'))).toEqual([
      'theme-practice-predict',
      'theme-practice-demo',
      'theme-practice-check'
    ]);
  });

  it('keeps pitfalls and sandbox acceptance collapsed until opened', () => {
    const practice = getThemePractice(EFFECT_CLEANUP_THEME_ID);
    if (!practice) throw new Error('effect-cleanup practice is missing');

    render(<ThemePracticeNotes practice={practice} />);

    const pitfalls = screen.getByText('常见错误').closest('details');
    const accept = screen.getByText('以后验收').closest('details');

    expect(pitfalls).not.toBeNull();
    expect(accept).not.toBeNull();
    expect(pitfalls).not.toHaveAttribute('open');
    expect(accept).not.toHaveAttribute('open');
    expect(within(pitfalls as HTMLDetailsElement).getByText(practice.pitfalls[0])).toBeInTheDocument();
    expect(within(accept as HTMLDetailsElement).getByText(practice.sandboxAccept[0])).toBeInTheDocument();
  });
});
