import type { ReportMeta } from './playwright-report';

export type NormalizedAssertion = {
  name: string;
  passed: boolean;
  error?: string;
};

export type NormalizedExecution = {
  id: string;
  name: string;
  method: string;
  url: string;
  status: number;
  responseTime: number;
  assertions: NormalizedAssertion[];
};

export type NormalizedNewmanReport = {
  meta: ReportMeta;
  stats: {
    requests: number;
    assertions: { total: number; passed: number; failed: number };
    responseTime: { avg: number; min: number; max: number };
    durationMs: number;
  };
  executions: NormalizedExecution[];
};

export function executionStatusColor(status: number): string {
  if (status >= 200 && status < 300) return '#4ade80';
  if (status >= 300 && status < 400) return '#fbbf24';
  if (status >= 400) return '#f87171';
  return '#94a3b8';
}
