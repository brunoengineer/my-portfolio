# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Planning phase. The only file is `first-plan.md` — no source code, no commits, no `package.json` yet. **`first-plan.md` is the authoritative spec for what to build**; read it before suggesting changes to architecture or scope.

## Goal

Replace Bruno's current portfolio at https://brunoengineer.github.io/ (source: https://github.com/brunoengineer/portfolio_website, local clone at `../portfolio_website/`) with a new site that better showcases his work as a QA Engineer. The existing repo is a useful reference for content (bio, projects, links) but is not the codebase being built here.

## Stack (locked in by the plan)

- **React + Next.js**, deployed to **GitHub Pages** (so the build must produce a static export — `next export` or `output: 'export'`).
- **Playwright** for end-to-end tests, wired into **GitHub Actions**.
- No backend; content lives in JSON.

Treat this stack as decided. Don't propose swapping frameworks without checking with Bruno first. For *new* dependencies beyond this core set, prefer the minimal option and justify the addition.

## Non-negotiable conventions

These come from the plan and must hold across every component added:

1. **Every FE element gets a stable `data-testid`.** Playwright tests select by these — don't rely on text or CSS-class selectors.
2. **Content is JSON-driven.** Projects, stack items, timeline entries, testimonials, friends-photos, etc. each live in a JSON file under a content directory. Components read from JSON; adding/removing an item should mean editing JSON only, not touching component code.
3. **Responsive: desktop and mobile.** Every component ships both layouts.
4. **Playwright suite mirrors features.** Folder structure follows the site's components/pages so a feature and its tests are easy to pair.
5. **Docs to maintain:** `README.md` (clone / install / how to edit content), plus `docs/` for Test and Architecture notes.

## Sections to build (from `first-plan.md`)

Home (photo, name, role, tagline, navbar) · Projects · Stack (clickable logos linking to each tech's site) · Testimonials carousel · CV link · Interactive career timeline · Friends-at-work photos · Contact · About. See `first-plan.md` for the full content brief.

## Commands

```powershell
npm install                  # first time only
npx playwright install       # first time only — downloads browser binaries
npm run dev                  # dev server at http://localhost:3000
npm run build                # static export to ./out (deploy this dir to GH Pages)
npm run test:e2e             # Playwright tests headless (auto-starts dev server)
npm run test:e2e:ui          # Playwright UI mode (interactive)
npm run test:e2e:report      # open the last HTML report
```

`output: 'export'` is set in `next.config.js`, so `next start` is not used — to preview the production build, serve `out/` with any static server (e.g. `npx serve out`).

## CI

`.github/workflows/playwright.yml` runs the Playwright suite on every push and PR against `main` / `master`. Node 20, Chromium only (matches `playwright.config.ts`), HTML report uploaded as an artifact (`playwright-report`, 30-day retention). `npm ci` requires `package-lock.json` to be committed.

## Layout

- `src/app/` — App Router pages, layouts, CSS Modules. Home page lives at `src/app/page.tsx`.
- `src/content/` — JSON content. New section = new JSON file + a component that reads it. Current files: `site.json` (name/role/tagline/nav), `projects.json` (project cards).
- `src/components/` — shared components. Each component is named `<Name>.tsx` + `<Name>.module.css`. Current: `Projects.tsx`.
- `tests/e2e/` — Playwright specs, organized by feature (`home.spec.ts`, etc.). Selectors must use `getByTestId(...)` — never text or CSS classes.

## Git workflow

**Never run git yourself.** This applies to every git subcommand — `status`, `log`, `diff`, `rev-parse`, `branch`, `show`, as well as `add`/`commit`/`push`/`reset`/`merge`/etc. Always hand Bruno a paste-ready PowerShell block and let him run it in his terminal.

- For information you'd normally get from `git status`/`log`/`diff`: use the `gitStatus` snapshot the harness provides, read files directly, or ask Bruno to paste the relevant output.
- After each commit-sized unit of work, end the response with a fenced ```powershell block — typically three lines (`git add <files>`, `git commit -m "..."`, `git push`).
- Stage explicit file paths, not `git add .` / `-A`. (The `Developer/` parent directory is itself a separate git repo with many unrelated untracked files — this `my-portfolio/` repo is the new, isolated one.)
- PS 5.1 has no `&&` chaining — one command per line.
