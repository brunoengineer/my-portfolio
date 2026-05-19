import type { ReportMeta } from './playwright-report';

export type NormalizedThreshold = {
  metric: string;
  expression: string;
  passed: boolean;
};

export type NormalizedCheck = {
  name: string;
  passes: number;
  fails: number;
  rate: number; // 0..1
};

export type NormalizedK6Report = {
  meta: ReportMeta;
  stats: {
    vus: number;
    iterations: number;
    durationMs: number;
    httpRequests: number;
    failureRate: number; // 0..1
  };
  httpDuration: {
    avg: number;
    min: number;
    med: number;
    max: number;
    p90: number;
    p95: number;
  };
  checks: NormalizedCheck[];
  thresholds: NormalizedThreshold[];
};
