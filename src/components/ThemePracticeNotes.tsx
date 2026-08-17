import type { ReactNode } from 'react';
import type { ThemePractice } from '@/lib/theme-practice';

interface ThemePracticeNotesProps {
  practice: ThemePractice;
  children?: ReactNode;
}

function PracticeDisclosure({
  className,
  summaryId,
  summary,
  children
}: {
  className: string;
  summaryId: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <details className={`theme-practice-disclosure ${className}`}>
      <summary id={summaryId}>{summary}</summary>
      {children}
    </details>
  );
}

export function ThemePracticeNotes({ practice, children }: ThemePracticeNotesProps) {
  const predictId = `${practice.themeId}-predict`;
  const checkId = `${practice.themeId}-check`;
  const pitfallsId = `${practice.themeId}-pitfalls`;
  const acceptId = `${practice.themeId}-accept`;

  return (
    <div className="theme-practice">
      <section className="theme-practice-block theme-practice-predict" aria-labelledby={predictId}>
        <h4 id={predictId}>操作前先猜</h4>
        <ol>
          {practice.predict.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      {children ? <div className="theme-practice-demo">{children}</div> : null}

      <section className="theme-practice-block theme-practice-check" aria-labelledby={checkId}>
        <h4 id={checkId}>正确理解</h4>
        <ol>
          {practice.check.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <PracticeDisclosure className="theme-practice-pitfalls" summaryId={pitfallsId} summary="常见错误">
        <ul aria-labelledby={pitfallsId}>
          {practice.pitfalls.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </PracticeDisclosure>

      <PracticeDisclosure className="theme-practice-accept" summaryId={acceptId} summary="以后验收">
        <ol aria-labelledby={acceptId}>
          {practice.sandboxAccept.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </PracticeDisclosure>

      <p className="theme-practice-id">
        <span className="sr-only">主题 ID </span>
        {practice.themeId}
      </p>
    </div>
  );
}
