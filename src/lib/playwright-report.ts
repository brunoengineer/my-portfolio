/**
 * Normalized report shape consumed by the custom report pages.
 *
 * In CI a small Node script (scripts/build-reports.mjs) flattens Playwright's
 * raw --reporter=json output into this shape and writes it to
 * src/content/test-results/playwright.json. Locally we ship a fixture so the
 * page renders without needing a CI run.
 */
export type ReportStatus =
  | 'passed'
  | 'failed'
  | 'skipped'
  | 'flaky'
  | 'timedOut'
  | 'interrupted';

export type NormalizedTest = {
  title: string;
  status: ReportStatus;
  duration: number; // ms
  error?: string;
};

export type NormalizedSuite = {
  title: string;
  file: string;
  tests: NormalizedTest[];
};

export type ReportMeta = {
  runNumber?: number;
  branch?: string;
  sha?: string;
  commitMessage?: string;
  htmlUrl?: string;
  timestamp?: string; // ISO
};

export type NormalizedReport = {
  meta: ReportMeta;
  stats: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    flaky: number;
    durationMs: number;
  };
  suites: NormalizedSuite[];
};

export function suiteStats(suite: NormalizedSuite) {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let durationMs = 0;
  for (const t of suite.tests) {
    durationMs += t.duration;
    if (t.status === 'passed') passed++;
    else if (t.status === 'skipped') skipped++;
    else failed++;
  }
  return { passed, failed, skipped, total: suite.tests.length, durationMs };
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return `${m}m ${s}s`;
}
