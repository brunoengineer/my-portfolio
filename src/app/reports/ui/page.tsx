import type { Metadata } from 'next';
import Link from 'next/link';
import report from '@/content/test-results/playwright.json';
import {
  type NormalizedReport,
  type NormalizedSuite,
  formatDuration,
  suiteStats,
} from '@/lib/playwright-report';
import { asset } from '@/lib/asset';
import DonutChart from '@/components/reports/DonutChart';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'UI Test Report — Bruno Peres',
  description: 'Playwright end-to-end test results for brunoengineer/my-portfolio.',
};

const data = report as NormalizedReport;

const COLORS = {
  passed: '#4ade80',
  failed: '#f87171',
  skipped: '#94a3b8',
  flaky: '#fbbf24',
};

function statusClass(status: string): string {
  if (status === 'passed') return styles.statusPassed;
  if (status === 'failed' || status === 'timedOut' || status === 'interrupted') return styles.statusFailed;
  if (status === 'skipped') return styles.statusSkipped;
  return styles.statusFlaky;
}

function formatRelative(iso?: string): string {
  if (!iso) return '—';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.round(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

function SuiteRow({ suite }: { suite: NormalizedSuite }) {
  const stats = suiteStats(suite);
  const hasFailed = stats.failed > 0;

  return (
    <section
      className={`${styles.suite} ${hasFailed ? styles.suiteFailed : ''}`}
      data-testid={`report-suite-${suite.file}`}
    >
      <header className={styles.suiteHead}>
        <h3 className={`mono ${styles.suiteTitle}`}>{suite.title}</h3>
        <div className={styles.suiteMeta}>
          <span className={styles.suiteCount}>
            <span className={styles.suitePassed}>{stats.passed}</span>
            <span className={styles.suiteSep}>/</span>
            <span>{stats.total}</span>
          </span>
          <span className={`mono ${styles.suiteDuration}`}>{formatDuration(stats.durationMs)}</span>
        </div>
      </header>
      <ul className={styles.testList}>
        {suite.tests.map((t, i) => (
          <li key={`${t.title}-${i}`} className={styles.testRow}>
            <span className={`${styles.statusDot} ${statusClass(t.status)}`} aria-hidden="true" />
            <span className={`${styles.testTitle} ${t.status === 'failed' ? styles.testTitleFail : ''}`}>
              {t.title}
            </span>
            <span className={`mono ${styles.testDuration}`}>{formatDuration(t.duration)}</span>
            {t.error && (
              <pre className={styles.testError}>{t.error}</pre>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function UIReportPage() {
  const { meta, stats, suites } = data;
  const passRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;

  const slices = [
    { id: 'passed', value: stats.passed, color: COLORS.passed, label: 'passed' },
    { id: 'failed', value: stats.failed, color: COLORS.failed, label: 'failed' },
    { id: 'skipped', value: stats.skipped, color: COLORS.skipped, label: 'skipped' },
    { id: 'flaky', value: stats.flaky, color: COLORS.flaky, label: 'flaky' },
  ];

  return (
    <main className={styles.page} data-testid="report-ui-page">
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
          <span className={styles.eyebrowNum}>UI</span>
          <span className={styles.eyebrowSlash}> / </span>
          <span>playwright</span>
        </p>
        <h1 className={styles.title}>
          Test Report
        </h1>
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
          <p className={styles.commit} data-testid="report-commit">
            &quot;{meta.commitMessage}&quot;
          </p>
        )}
      </header>

      <section className={styles.summary} aria-label="Summary">
        <div className={styles.chartWrap}>
          <DonutChart
            slices={slices}
            centerValue={`${passRate}%`}
            centerLabel="pass rate"
            size={220}
          />
        </div>

        <ul className={styles.statTiles}>
          <li className={`${styles.statTile} ${styles.tilePassed}`} data-testid="report-stat-passed">
            <span className={styles.tileValue}>{stats.passed}</span>
            <span className={`mono ${styles.tileLabel}`}>passed</span>
          </li>
          <li className={`${styles.statTile} ${styles.tileFailed}`} data-testid="report-stat-failed">
            <span className={styles.tileValue}>{stats.failed}</span>
            <span className={`mono ${styles.tileLabel}`}>failed</span>
          </li>
          <li className={`${styles.statTile} ${styles.tileSkipped}`} data-testid="report-stat-skipped">
            <span className={styles.tileValue}>{stats.skipped}</span>
            <span className={`mono ${styles.tileLabel}`}>skipped</span>
          </li>
          <li className={`${styles.statTile} ${styles.tileDuration}`} data-testid="report-stat-duration">
            <span className={styles.tileValue}>{formatDuration(stats.durationMs)}</span>
            <span className={`mono ${styles.tileLabel}`}>total time</span>
          </li>
        </ul>
      </section>

      <section className={styles.suites} aria-label="Suites">
        <h2 className={styles.suitesHeading}>Suites</h2>
        {suites.map((s) => (
          <SuiteRow key={s.file} suite={s} />
        ))}
      </section>

      <footer className={styles.footer}>
        <span className={`mono ${styles.footerLine}`}>
          $ playwright report · static · {formatRelative(meta.timestamp)}
        </span>
      </footer>
    </main>
  );
}
