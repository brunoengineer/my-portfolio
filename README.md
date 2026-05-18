# Bruno Peres — Portfolio

QA Engineer portfolio site. Built with Next.js (App Router, TypeScript, CSS Modules) and exported as static HTML for GitHub Pages.

## Clone

```powershell
git clone <repo-url>
cd my-portfolio
```

## Install & develop

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

## Build (static export for GitHub Pages)

```powershell
npm run build
```

The static site is written to `out/`. Deploy the contents of `out/` to GitHub Pages.

## Update site content

All content lives in JSON under `src/content/`. Edit those files; no code changes needed for adding/removing items.

- `src/content/site.json` — name, role, tagline, navbar links
- `src/content/projects.json` — project cards (title, description, optional image/GitHub/live links)
- (further JSON files added per component as the site grows: stack, timeline, testimonials, etc.)

### Adding a project

Append an entry to `src/content/projects.json`. `id` must be unique (it is used in `data-testid` values and as the React key). Set `image` to a path under `public/` or `null` for the gradient placeholder. Set `githubUrl` and/or `liveUrl` to a URL, or `null` to hide that link.

## Project structure

```
src/
  app/             # Next.js App Router pages, layouts, styles
  content/         # JSON content files (edit these to update the site)
```

## Tests

End-to-end tests use [Playwright](https://playwright.dev/). Every FE element is tagged with a stable `data-testid`; tests select by test ID only — never by text or CSS class.

```powershell
npx playwright install   # first time only — downloads browser binaries
npm run test:e2e         # run all tests headless (auto-starts the dev server)
npm run test:e2e:ui      # interactive UI mode
npm run test:e2e:report  # open the last HTML report
```

Specs live under `tests/e2e/`, organized by feature (e.g. `home.spec.ts`).

### CI

The suite runs on every push and pull request to `main` / `master` via `.github/workflows/playwright.yml`. The HTML report is uploaded as a workflow artifact (`playwright-report`) for 30 days.
