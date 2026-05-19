'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import tests from '@/content/tests.json';
import styles from './Tests.module.css';
import SectionHeading from './SectionHeading';
import Terminal, { type TerminalLine } from './Terminal';
import { asset } from '@/lib/asset';

type WorkflowRun = {
  run_number: number;
  status: string;
  conclusion: string | null;
  html_url: string;
  updated_at: string;
  head_commit: { message: string; id: string };
  head_branch: string;
};

type Card = {
  id: string;
  title: string;
  description: string;
  workflowFile: string;
  command: string;
  status: 'live' | 'coming-soon';
  reportPath?: string;
};

async function fetchLatestRun(owner: string, repo: string, workflow: string): Promise<WorkflowRun | null> {
  const key = `gh-run-${owner}-${repo}-${workflow}`;
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached) as WorkflowRun;
      // only trust the cache for terminal-state runs; otherwise evict and refetch
      if (parsed?.status === 'completed') return parsed;
      sessionStorage.removeItem(key);
    }
  } catch {
    try { sessionStorage.removeItem(key); } catch {}
  }
  const r = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/runs?per_page=1`,
    { headers: { Accept: 'application/vnd.github+json' } }
  );
  if (!r.ok) return null;
  const data = await r.json();
  const run = data.workflow_runs?.[0] ?? null;
  if (run && run.status === 'completed') {
    try { sessionStorage.setItem(key, JSON.stringify(run)); } catch {}
  }
  return run;
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.max(1, Math.round(diff))}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.round(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

type StatusColor = 'success' | 'failure' | 'running' | 'neutral';

function statusInfo(run: WorkflowRun | null, isLive: boolean): { label: string; color: StatusColor } {
  if (!isLive) return { label: 'coming soon', color: 'neutral' };
  if (!run) return { label: 'no runs yet', color: 'neutral' };
  if (run.status !== 'completed') return { label: 'running', color: 'running' };
  if (run.conclusion === 'success') return { label: 'passing', color: 'success' };
  if (run.conclusion === 'failure') return { label: 'failing', color: 'failure' };
  return { label: run.conclusion ?? 'unknown', color: 'neutral' };
}

function buildLines(command: string, run: WorkflowRun): TerminalLine[] {
  const commit = run.head_commit.message.split('\n')[0];
  const shortSha = run.head_commit.id.slice(0, 7);
  const success = run.conclusion === 'success';
  return [
    { text: `$ ${command}`, kind: 'cmd' },
    { text: `> github actions · run #${run.run_number}`, kind: 'info' },
    { text: `> branch ${run.head_branch} · commit ${shortSha}`, kind: 'info' },
    { text: `> "${commit}"`, kind: 'info' },
    success
      ? { text: `✓ all tests passed`, kind: 'success' }
      : { text: `✗ run ${run.conclusion ?? 'incomplete'}`, kind: 'fail' },
    { text: `→ view full report on github actions`, kind: 'link' },
  ];
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] } },
};

function TestCard({ card, repo }: { card: Card; repo: { owner: string; name: string } }) {
  const [run, setRun] = useState<WorkflowRun | null>(null);
  const [loading, setLoading] = useState(card.status === 'live');
  const [open, setOpen] = useState(false);
  const [animDone, setAnimDone] = useState(false);

  useEffect(() => {
    if (card.status !== 'live') return;
    let cancelled = false;
    fetchLatestRun(repo.owner, repo.name, card.workflowFile)
      .then((r) => {
        if (!cancelled) setRun(r);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [card, repo]);

  const isLive = card.status === 'live';
  const s = statusInfo(run, isLive);
  const canRun = isLive && !loading && !!run;

  return (
    <motion.li
      className={`${styles.card} ${!isLive ? styles.disabled : ''}`}
      data-testid={`test-card-${card.id}`}
      variants={cardVariants}
    >
      <div className={styles.head}>
        <h3 className={styles.title} data-testid={`test-title-${card.id}`}>
          {card.title}
        </h3>
        <span
          className={`${styles.badge} ${styles[`badge-${s.color}`]}`}
          data-testid={`test-status-${card.id}`}
        >
          <span className={styles.statusDot} aria-hidden="true" />
          {isLive && loading ? 'loading' : s.label}
        </span>
      </div>

      <p className={styles.desc} data-testid={`test-desc-${card.id}`}>
        {card.description}
      </p>

      {isLive && run && (
        <div className={`mono ${styles.meta}`} data-testid={`test-meta-${card.id}`}>
          <span>#{run.run_number}</span>
          <span className={styles.metaSep}>·</span>
          <span>{timeAgo(run.updated_at)}</span>
        </div>
      )}

      {!open && (
        <button
          className={styles.runBtn}
          data-testid={`test-run-${card.id}`}
          disabled={!canRun}
          onClick={() => {
            setOpen(true);
            setAnimDone(false);
          }}
          type="button"
        >
          {!isLive ? '○ Not yet wired up' : !canRun ? '○ Loading…' : `▶ Replay last run`}
        </button>
      )}

      {open && run && (
        <div className={styles.terminalWrap} data-testid={`test-terminal-${card.id}`}>
          <Terminal
            lines={buildLines(card.command, run)}
            onComplete={() => setAnimDone(true)}
          />
          {animDone && (
            <div className={styles.reportLinks}>
              {card.reportPath && (
                <a
                  href={asset(card.reportPath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.reportLink} ${styles.reportPrimary}`}
                  data-testid={`test-report-link-${card.id}`}
                >
                  View HTML report ↗
                </a>
              )}
              <a
                href={run.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.reportLink}
                data-testid={`test-gh-link-${card.id}`}
              >
                View on GitHub Actions ↗
              </a>
            </div>
          )}
        </div>
      )}
    </motion.li>
  );
}

const gridVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function Tests() {
  const reduce = useReducedMotion();
  return (
    <section
      id="tests"
      className={styles.section}
      data-testid="tests-section"
      aria-labelledby="tests-heading"
    >
      <SectionHeading
        number="04"
        label="quality engineering"
        title="Tests"
        testIdPrefix="tests"
        description={tests.intro}
      />

      <motion.ul
        className={styles.grid}
        data-testid="tests-grid"
        variants={gridVariants}
        initial={reduce ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {(tests.cards as Card[]).map((c) => (
          <TestCard key={c.id} card={c} repo={tests.repo} />
        ))}
      </motion.ul>
    </section>
  );
}
