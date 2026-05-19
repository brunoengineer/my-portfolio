# Testing

This portfolio is the test bench it claims to be. Three real test suites run on every push, each generating a custom HTML report rendered as part of the site itself.

| Layer | Tool | Workflow | Report |
|---|---|---|---|
| UI (E2E) | [Playwright](https://playwright.dev/) | `.github/workflows/playwright.yml` | `/reports/ui/` |
| API | [Newman](https://github.com/postmanlabs/newman) + [Postman](https://www.postman.com/) | `.github/workflows/newman.yml` | `/reports/api/` |
| Performance | [K6](https://k6.io/) | `.github/workflows/k6.yml` | `/reports/perf/` |

Deploy is a separate workflow (`.github/workflows/deploy.yml`) that builds the static site and publishes to GitHub Pages.

---

## Quick reference

```powershell
# UI / E2E (Playwright)
npx playwright install        # first time only — downloads browser binaries
npm run test:e2e              # headless, auto-starts dev server
npm run test:e2e:ui           # interactive UI mode
npm run test:e2e:report       # open the last HTML report

# API (Newman + Postman)
npm install -g newman newman-reporter-htmlextra
newman run tests/api/collection.json --reporters cli,htmlextra

# Performance (K6)
# install K6: https://k6.io/docs/getting-started/installation/
k6 run tests/perf/script.js
```

---

## Layer 1 — UI tests (Playwright)

Every component on the site has a stable `data-testid`. Specs select **only** by test ID — never by text content or CSS class — so visual or copy changes don't break the suite.

### Conventions

- **Test ID format**: `<feature>-<element>` (e.g. `hero-name`, `project-card-<id>`, `stack-link-<id>`).
- **One spec file per feature**: `tests/e2e/home.spec.ts`, `about.spec.ts`, `projects.spec.ts`, `stack.spec.ts`, `tests.spec.ts`, `contact.spec.ts`, `footer.spec.ts`.
- **JSON-driven assertions**: specs import the same JSON the components read, then assert that every entry renders. Adding an item to JSON automatically extends test coverage.
- **Mobile coverage**: each spec includes a `test.describe(..., — mobile viewport)` block at `375 × 812`.

### Layout

```
tests/e2e/
  home.spec.ts        # hero + nav
  about.spec.ts       # bio, stats, timeline, CV
  projects.spec.ts    # project grid
  stack.spec.ts       # tech grid + hover-text swap
  tests.spec.ts       # Tests section + terminal replay + report links
  contact.spec.ts     # channels grid
  footer.spec.ts      # socials + status line
```

### Config

`playwright.config.ts` runs Chromium only, in parallel, with 1 retry locally and 2 in CI. The dev server auto-starts via the `webServer` config.

---

## Layer 2 — API tests (Newman + Postman)

A Postman collection at `tests/api/collection.json` runs against the public [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API to demonstrate API-testing patterns without needing a backend.

### What it covers

- **Smoke**: `GET /posts/1` — status code, payload identity, response-time threshold.
- **Payload shape**: `GET /users` — list length, every item has email and name.
- **Create**: `POST /posts` — 201 response, echoed payload, generated id.
- **Negative**: `GET /posts/9999` — 404 path.

### How to extend

Open `tests/api/collection.json` in Postman (`Import`), add a new request, write `pm.test(...)` assertions in the **Tests** tab, export the collection (`Export → Collection v2.1`) back to the same file. Re-run with `newman run tests/api/collection.json --reporters cli,htmlextra`.

---

## Layer 3 — Performance tests (K6)

A small load scenario at `tests/perf/script.js`: 5 virtual users for 20 seconds (~100 requests) against the same JSONPlaceholder endpoint, with thresholds on p95 latency, failure rate, and check pass rate.

### Thresholds

| Metric | Expression | Why |
|---|---|---|
| `http_req_duration` | `p(95)<800` | 95th-percentile request stays under 800ms |
| `http_req_failed` | `rate<0.01` | Fewer than 1% of requests may fail |
| `checks` | `rate>0.99` | Per-iteration assertions stay above 99% pass rate |

K6 exits non-zero if any threshold fails — that's what flips the **Performance** card to a red `failing` badge on the portfolio.

---

## CI / GitHub Actions

Four separate workflows fire on every push to `main`:

1. **Playwright Tests** (`playwright.yml`) — runs the E2E suite, uploads `playwright-report/` as an artifact.
2. **API Tests** (`newman.yml`) — runs the Postman collection with the htmlextra reporter, uploads `newman-report/`.
3. **Performance Tests** (`k6.yml`) — installs K6, runs the script with the web-dashboard HTML export, uploads `k6-report/`.
4. **Deploy to GitHub Pages** (`deploy.yml`) — builds the portfolio and deploys to Pages.

Splitting them keeps each layer independently re-runnable, gives each its own status badge, and lets the portfolio's Tests cards fetch status from one endpoint per layer.

---

## Reports

### Custom in-portfolio reports

Each layer has a custom HTML report rendered as a Next.js route, sharing the portfolio's design language (dark theme, Space Grotesk + JetBrains Mono, accent-blue palette):

- `/reports/ui/` — donut chart with pass-rate %, per-spec breakdown with inline error display.
- `/reports/api/` — donut on assertion pass rate, per-request cards with HTTP method badge, status code, response time, and assertions list.
- `/reports/perf/` — donut on check pass rate, threshold table with pass/fail per expression, p50/p90/p95 latency cells, per-check counts.

Each page reads its normalized JSON from `src/content/test-results/` at build time. The deploy workflow runs all three test suites, transforms their raw output into the normalized shape, writes the JSONs, then builds.

### GitHub Actions reports

Each test workflow also uploads its native HTML report (Playwright's built-in, Newman's `htmlextra`, K6's web dashboard) as a workflow artifact, retained for 30 days. The "View on GitHub Actions ↗" button on each Tests card links to the run page where logged-in viewers can download these artifacts.

---

## Adding a new test layer

To add a new layer (e.g. accessibility tests with axe-core):

1. **Write the tests** under `tests/<layer>/`.
2. **Create a workflow** at `.github/workflows/<layer>.yml` following the existing patterns: runs on push + PR, uploads an HTML report artifact.
3. **Add a card** to `src/content/tests.json` with `workflowFile`, `command`, `status: "live"`, and an optional `reportPath`.
4. **Build the report page** at `src/app/reports/<layer>/page.tsx` reading from `src/content/test-results/<layer>.json`. Reuse `DonutChart`, copy the layout shell from one of the existing report pages.
5. **Wire the deploy workflow** to run the tests, normalize the output to JSON, and write it into `src/content/test-results/` before `npm run build`.

---

## Conventions cheat sheet

- Every interactive element gets a `data-testid`. Tests select by ID only.
- Content lives in JSON. Adding/removing/reordering an item should never require code edits.
- Each component ships responsive (desktop + mobile) and is covered by Playwright.
- Each test layer has its own workflow file, status badge, and Tests-card entry — no shared workflows.
