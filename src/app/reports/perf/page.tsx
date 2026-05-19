import type { Metadata } from 'next';
import Link from 'next/link';
import report from '@/content/test-results/k6.json';
import { type NormalizedK6Report } from '@/lib/k6-report';
import { formatDuration } from '@/lib/playwright-report';
import DonutChart from '@/components/reports/DonutChart';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Performance Test Report — Bruno Peres',
  description: 'K6 load test results for brunoengineer/my-portfolio.',
};

const data = report as NormalizedK6Report;

function formatRelative(iso?: string): string {
  if (!iso) return '—';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.round(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function PerfReportPage() {
  const { meta, stats, httpDuration, checks, thresholds } = data;

  const totalChecks = checks.reduce((s, c) => s + c.passes + c.fails, 0);
  const passedChecks = checks.reduce((s, c) => s + c.passes, 0);
  const checkRate = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

  const slices = [
    { id: 'passed', value: passedChecks, color: '#4ade80', label: 'passed' },
    { id: 'failed', value: totalChecks - passedChecks, color: '#f87171', label: 'failed' },
  ];

  const allThresholdsPassed = thresholds.every((t) => t.passed);

  return (
    <main className={styles.page} data-testid="report-perf-page">
      <nav className={styles.topNav} aria-label="Report navigation">
        <Link href="/#tests" className={`mono ${styles.back}`} data-testid="report-back">
          ← back to portfolio
        </Link>
        {meta.htmlUrl && (
          <a
            href={meta.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mono ${styles.ghLink}`}
            data-testid="report-gh-link"
          >
            view on github actions ↗
          </a>
        )}
      </nav>

      <header className={styles.header}>
        <p className={`eyebrow ${styles.eyebrow}`}>
          <span className={styles.eyebrowNum}>PERF</span>
          <span className={styles.eyebrowSlash}> / </span>
          <span>k6 load</span>
        </p>
        <h1 className={styles.title}>Test Report</h1>
        <div className={`mono ${styles.metaLine}`} data-testid="report-meta">
          {meta.runNumber && <span>#{meta.runNumber}</span>}
          {meta.runNumber && <span className={styles.metaSep}>·</span>}
          <span>{meta.branch ?? 'main'}</span>
          <span className={styles.metaSep}>·</span>
          <span>{formatRelative(meta.timestamp)}</span>
          {meta.sha && <span className={styles.metaSep}>·</span>}
          {meta.sha && <span>{meta.sha.slice(0, 7)}</span>}
        </div>
        {meta.commitMessage && (
          <p className={styles.commit}>&quot;{meta.commitMessage}&quot;</p>
        )}
      </header>

      <section className={styles.summary} aria-label="Summary">
        <div className={styles.chartWrap}>
          <DonutChart
            slices={slices}
            centerValue={`${checkRate}%`}
            centerLabel="checks"
            size={220}
          />
        </div>

        <ul className={styles.statTiles}>
          <li className={`${styles.statTile} ${styles.tileVus}`}>
            <span className={styles.tileValue}>{stats.vus}</span>
            <span className={`mono ${styles.tileLabel}`}>virtual users</span>
          </li>
          <li className={`${styles.statTile} ${styles.tileIter}`}>
            <span className={styles.tileValue}>{stats.iterations}</span>
            <span className={`mono ${styles.tileLabel}`}>iterations</span>
          </li>
          <li className={`${styles.statTile} ${styles.tileLatency}`}>
            <span className={styles.tileValue}>{httpDuration.p95}ms</span>
            <span className={`mono ${styles.tileLabel}`}>p95 latency</span>
          </li>
          <li className={`${styles.statTile} ${styles.tileFail}`}>
            <span className={styles.tileValue}>{(stats.failureRate * 100).toFixed(2)}%</span>
            <span className={`mono ${styles.tileLabel}`}>failure rate</span>
          </li>
        </ul>
      </section>

      <section className={styles.block} aria-label="Thresholds">
        <h2 className={styles.blockHeading}>
          Thresholds
          <span
            className={`mono ${styles.headingBadge} ${allThresholdsPassed ? styles.badgePass : styles.badgeFail}`}
          >
            {allThresholdsPassed ? 'all passed' : 'one or more failed'}
          </span>
        </h2>
        <ul className={styles.thresholdList}>
          {thresholds.map((t, i) => (
            <li
              key={`${t.metric}-${i}`}
              className={`${styles.thresholdItem} ${t.passed ? styles.thresholdPass : styles.thresholdFail}`}
            >
              <span className={`mono ${styles.thresholdMetric}`}>{t.metric}</span>
              <span className={`mono ${styles.thresholdExpr}`}>{t.expression}</span>
              <span className={`mono ${styles.thresholdStatus}`}>
                {t.passed ? '✓ passed' : '✗ failed'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.block} aria-label="HTTP request duration">
        <h2 className={styles.blockHeading}>HTTP request duration</h2>
        <ul className={styles.metricGrid}>
          <li className={styles.metricCell}>
            <span className={`mono ${styles.metricLabel}`}>min</span>
            <span className={styles.metricValue}>{httpDuration.min}ms</span>
          </li>
          <li className={styles.metricCell}>
            <span className={`mono ${styles.metricLabel}`}>avg</span>
            <span className={styles.metricValue}>{httpDuration.avg}ms</span>
          </li>
          <li className={styles.metricCell}>
            <span className={`mono ${styles.metricLabel}`}>med</span>
            <span className={styles.metricValue}>{httpDuration.med}ms</span>
          </li>
          <li className={styles.metricCell}>
            <span className={`mono ${styles.metricLabel}`}>p90</span>
            <span className={styles.metricValue}>{httpDuration.p90}ms</span>
          </li>
          <li className={styles.metricCell}>
            <span className={`mono ${styles.metricLabel}`}>p95</span>
            <span className={styles.metricValue}>{httpDuration.p95}ms</span>
          </li>
          <li className={styles.metricCell}>
            <span className={`mono ${styles.metricLabel}`}>max</span>
            <span className={styles.metricValue}>{httpDuration.max}ms</span>
          </li>
        </ul>
      </section>

      <section className={styles.block} aria-label="Checks">
        <h2 className={styles.blockHeading}>Checks</h2>
        <ul className={styles.checkList}>
          {checks.map((c, i) => (
            <li key={`${c.name}-${i}`} className={styles.checkItem}>
              <span
                className={`${styles.assertDot} ${c.fails === 0 ? styles.assertPass : styles.assertFail}`}
                aria-hidden="true"
              />
              <span className={styles.checkName}>{c.name}</span>
              <span className={`mono ${styles.checkCount}`}>
                <span className={styles.checkPass}>{c.passes}</span>
                <span className={styles.checkSep}>/</span>
                <span>{c.passes + c.fails}</span>
              </span>
              <span className={`mono ${styles.checkRate}`}>{Math.round(c.rate * 100)}%</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className={styles.footer}>
        <span className={`mono ${styles.footerLine}`}>
          $ k6 report · static · {formatRelative(meta.timestamp)} · duration {formatDuration(stats.durationMs)}
        </span>
      </footer>
    </main>
  );
}
