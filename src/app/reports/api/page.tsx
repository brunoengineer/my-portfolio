import type { Metadata } from 'next';
import Link from 'next/link';
import report from '@/content/test-results/newman.json';
import {
  type NormalizedNewmanReport,
  executionStatusColor,
} from '@/lib/newman-report';
import { formatDuration } from '@/lib/playwright-report';
import DonutChart from '@/components/reports/DonutChart';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'API Test Report — Bruno Peres',
  description: 'Newman / Postman API test results for brunoengineer/my-portfolio.',
};

const data = report as NormalizedNewmanReport;

function formatRelative(iso?: string): string {
  if (!iso) return '—';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.round(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function APIReportPage() {
  const { meta, stats, executions } = data;
  const passRate =
    stats.assertions.total > 0
      ? Math.round((stats.assertions.passed / stats.assertions.total) * 100)
      : 0;

  const slices = [
    { id: 'passed', value: stats.assertions.passed, color: '#4ade80', label: 'passed' },
    { id: 'failed', value: stats.assertions.failed, color: '#f87171', label: 'failed' },
  ];

  return (
    <main className={styles.page} data-testid="report-api-page">
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
          <span className={styles.eyebrowNum}>API</span>
          <span className={styles.eyebrowSlash}> / </span>
          <span>newman + postman</span>
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
            centerValue={`${passRate}%`}
            centerLabel="assertions"
            size={220}
          />
        </div>

        <ul className={styles.statTiles}>
          <li className={`${styles.statTile} ${styles.tilePassed}`} data-testid="report-stat-assertions">
            <span className={styles.tileValue}>
              {stats.assertions.passed}
              <span className={styles.tileSubvalue}>/{stats.assertions.total}</span>
            </span>
            <span className={`mono ${styles.tileLabel}`}>assertions passed</span>
          </li>
          <li className={`${styles.statTile} ${styles.tileRequests}`} data-testid="report-stat-requests">
            <span className={styles.tileValue}>{stats.requests}</span>
            <span className={`mono ${styles.tileLabel}`}>requests</span>
          </li>
          <li className={`${styles.statTile} ${styles.tileLatency}`} data-testid="report-stat-latency">
            <span className={styles.tileValue}>{stats.responseTime.avg}ms</span>
            <span className={`mono ${styles.tileLabel}`}>avg response</span>
          </li>
          <li className={`${styles.statTile} ${styles.tileDuration}`} data-testid="report-stat-duration">
            <span className={styles.tileValue}>{formatDuration(stats.durationMs)}</span>
            <span className={`mono ${styles.tileLabel}`}>total time</span>
          </li>
        </ul>
      </section>

      <section className={styles.executions} aria-label="Requests">
        <h2 className={styles.suitesHeading}>Requests</h2>
        {executions.map((e) => {
          const passed = e.assertions.filter((a) => a.passed).length;
          const total = e.assertions.length;
          const allPassed = passed === total;
          return (
            <article
              key={e.id}
              className={`${styles.exec} ${!allPassed ? styles.execFailed : ''}`}
              data-testid={`report-exec-${e.id}`}
            >
              <header className={styles.execHead}>
                <span
                  className={`mono ${styles.method}`}
                  data-method={e.method}
                >
                  {e.method}
                </span>
                <span className={`mono ${styles.url}`} title={e.url}>
                  {new URL(e.url).pathname}
                </span>
                <span
                  className={`mono ${styles.status}`}
                  style={{ color: executionStatusColor(e.status) }}
                >
                  {e.status}
                </span>
                <span className={`mono ${styles.execDuration}`}>{e.responseTime}ms</span>
              </header>
              <ul className={styles.assertions}>
                {e.assertions.map((a, i) => (
                  <li key={`${a.name}-${i}`} className={styles.assertion}>
                    <span
                      className={`${styles.assertDot} ${a.passed ? styles.assertPass : styles.assertFail}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`${styles.assertName} ${!a.passed ? styles.assertNameFail : ''}`}
                    >
                      {a.name}
                    </span>
                    {a.error && <pre className={styles.assertError}>{a.error}</pre>}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <footer className={styles.footer}>
        <span className={`mono ${styles.footerLine}`}>
          $ newman report · static · {formatRelative(meta.timestamp)}
        </span>
      </footer>
    </main>
  );
}
