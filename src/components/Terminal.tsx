'use client';

import { useEffect, useState } from 'react';
import styles from './Terminal.module.css';

export type TerminalLine = {
  text: string;
  kind?: 'cmd' | 'info' | 'success' | 'fail' | 'link';
};

type Props = {
  lines: TerminalLine[];
  speed?: number;
  onComplete?: () => void;
};

export default function Terminal({ lines, speed = 380, onComplete }: Props) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (n >= lines.length) {
      onComplete?.();
      return;
    }
    const t = setTimeout(() => setN((s) => s + 1), speed);
    return () => clearTimeout(t);
    // onComplete intentionally not in deps — treat as stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, lines.length, speed]);

  return (
    <div className={styles.terminal} role="log" aria-live="polite">
      <div className={styles.bar} aria-hidden="true">
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
      </div>
      <pre className={styles.body}>
        {lines.slice(0, n).map((line, i) => (
          <span
            key={i}
            className={`${styles.line} ${line.kind ? styles[line.kind] : ''}`}
          >
            {line.text}
            {'\n'}
          </span>
        ))}
        {n < lines.length && <span className={styles.cursor}>▌</span>}
      </pre>
    </div>
  );
}
