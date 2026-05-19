# Bruno Peres — Portfolio

QA Engineer portfolio site. Next.js 15 (App Router, TypeScript, CSS Modules), Framer Motion for the motion layer, exported as static HTML and deployed to GitHub Pages.

Live: **https://brunoengineer.github.io/my-portfolio/**

---

## Highlights

- Dark, modern, motion-led design (Space Grotesk + Inter + JetBrains Mono, electric-blue accent).
- 100% JSON-driven content — adding items is editing JSON, not code.
- Every visible element ships with a stable `data-testid`.
- Three test layers run on every push (Playwright UI, Newman API, K6 Performance), each with a custom in-portfolio HTML report rendered as a Next.js route.
- Deploys automatically to GitHub Pages on push to `main`.

---

## Sections

| # | Section | Content source |
|---|---|---|
| 00 | Hero | `src/content/site.json` (name, role, tagline, nav) |
| 01 | About — bio, stats, CV button, career timeline | `src/content/about.json` |
| 02 | Projects | `src/content/projects.json` |
| 03 | Stack (hover any tile to swap the description) | `src/content/stack.json` |
| 04 | Tests — live CI status, terminal replay, links to custom reports | `src/content/tests.json` |
| 05 | Contact | `src/content/contact.json` |
| — | Footer (terminal status line + social icons) | `src/content/footer.json` |

---

## Local development

```powershell
git clone https://github.com/brunoengineer/my-portfolio.git
cd my-portfolio
npm install
npx playwright install   # first time only — downloads browser binaries
npm run dev              # http://localhost:3000
```

### Available scripts

```powershell
npm run dev              # dev server with hot reload
npm run build            # static export to ./out
npm run test:e2e         # Playwright tests headless
npm run test:e2e:ui      # interactive Playwright UI mode
npm run test:e2e:report  # open the last Playwright HTML report
```

---

## Updating content

Everything that appears on the site lives in JSON under `src/content/`. To change a project, edit `projects.json`. To add a stack item, append to `stack.json`. Components read the JSON — they don't hard-code content.

| File | What it controls |
|---|---|
| `site.json` | Name, role, tagline, navbar links |
| `about.json` | Bio, extras line, stats tiles, CV link, career timeline entries |
| `projects.json` | Project cards (title, description, image, GitHub / live links) |
| `stack.json` | Tech stack tiles (name, URL, icon source, hover description) |
| `tests.json` | Tests-section copy and per-card config (workflow file, command, report path) |
| `contact.json` | Intro line and contact channels (id, label, value, href) |
| `footer.json` | Social links (id, name, URL, icon source) |

### Adding a stack item

Append to `src/content/stack.json`:

```json
{
  "id": "kotlin",
  "name": "Kotlin",
  "url": "https://kotlinlang.org/",
  "iconSlug": "kotlin",
  "hoverText": "What I want to say about Kotlin when someone hovers it."
}
```

Set `iconSlug` to a [Simple Icons](https://simpleicons.org/) slug. If the brand isn't in Simple Icons (e.g. BrowserStack, TestRail, Xray), drop the SVG under `public/stack/<name>.svg` and use:

```json
{ "iconSlug": null, "iconPath": "/stack/kotlin.svg" }
```

### Adding a project

Append to `src/content/projects.json`. `id` must be unique (it is used as a React key and in `data-testid`s). Set `image` to a path under `public/` or `null` for the gradient placeholder. Set `githubUrl` / `liveUrl` to a URL or `null` to hide that link.

---

## Testing

Full details in [`docs/testing.md`](./docs/testing.md). Quick summary:

| Layer | Tool | Workflow | Custom report |
|---|---|---|---|
| UI / E2E | Playwright | `.github/workflows/playwright.yml` | `/reports/ui/` |
| API | Newman + Postman | `.github/workflows/newman.yml` | `/reports/api/` |
| Performance | K6 | `.github/workflows/k6.yml` | `/reports/perf/` |

Each layer has its own GitHub Actions workflow that runs on every push and PR, uploads its native HTML report as a 30-day artifact, and exposes a status badge that the portfolio's **Tests** section reads live via the GitHub REST API.

Convention: every interactive element has a `data-testid` and specs select by ID only — never by text or CSS class.

---

## Deployment

A separate workflow at `.github/workflows/deploy.yml` runs on push to `main`:

1. `npm ci` and `npm run build` (`next build` with `output: 'export'` → `./out`).
2. Touch `out/.nojekyll` so GitHub Pages doesn't strip files starting with `_`.
3. Upload `out/` as the Pages artifact and deploy via `actions/deploy-pages`.

`basePath` is set from `NEXT_PUBLIC_BASE_PATH` (configured to `/my-portfolio` in the workflow) so URLs work under the project-page subpath. Local dev leaves it unset so the site builds at root.

### One-time GitHub Pages setup

Repo Settings → Pages → **Source: GitHub Actions**.

---

## Project structure

```
src/
  app/
    layout.tsx              # root layout, fonts, metadata
    page.tsx                # home page composition
    globals.css             # design tokens + body styles
    reports/
      ui/page.tsx           # custom Playwright HTML report
      api/page.tsx          # custom Newman HTML report
      perf/page.tsx         # custom K6 HTML report
  components/               # all UI components, one .tsx + .module.css per component
    reports/                # report-specific components (DonutChart, etc.)
  content/                  # JSON content files (edit these to update the site)
    test-results/           # normalized test result JSONs (overwritten by CI before deploy)
  lib/
    asset.ts                # basePath-aware asset path helper
    playwright-report.ts    # types + utilities for the UI report
    newman-report.ts        # types for the API report
    k6-report.ts            # types for the perf report

tests/
  e2e/                      # Playwright specs (one per feature)
  api/collection.json       # Postman collection run by Newman
  perf/script.js            # K6 load scenario

.github/workflows/
  playwright.yml            # UI tests
  newman.yml                # API tests
  k6.yml                    # performance tests
  deploy.yml                # build + deploy to Pages

docs/
  testing.md                # full testing documentation

public/
  me.jpg                    # hero photo
  stack/                    # locally-hosted brand SVGs (CSS, Playwright, BrowserStack, etc.)
  footer/                   # locally-hosted social SVG (LinkedIn)
```

---

## Stack

- **Framework**: Next.js 15 (App Router, static export)
- **Language**: TypeScript
- **Styling**: CSS Modules with a small token system in `globals.css`
- **Fonts**: `next/font/google` — Space Grotesk (display), Inter (body), JetBrains Mono (code)
- **Motion**: Framer Motion (hero stagger, scroll reveals, terminal-style animations)
- **Tests**: Playwright (UI), Newman + Postman (API), K6 (performance)
- **Icons**: Simple Icons CDN for brands in the catalog; locally-hosted SVGs for the rest
- **Hosting**: GitHub Pages (via `actions/deploy-pages`)
