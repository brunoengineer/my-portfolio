# Portfolio Website
I have for now this portfolio website, and I would like to improve it:
- website: https://brunoengineer.github.io/
- Local repo: bruno@Bruno MINGW64 ~/Desktop/ESTUDOS/Developer/portfolio_website 
- Github repo: https://github.com/brunoengineer/portfolio_website

## Architecture
A website published on github pages, using React and Next.js, with a technological UX design, great style, that showcase Bruno's professional information and projects. Each FE element needed with a `data-testid`, and a strutured Playwright test case folder covering the entire website functionalities and integrated in GitHub Actions.

### Architecture Details
- Responsive design for web desktop and mobile
- JSON files where I can edit (Change, remove and include) easily the information from the website components
- footer with my linkedin and github link with icons
- Readme file, explaining how to clone, install, update the website information
- Documentation: Test, Architecture


### Content
- A component to showcase my projects, with title, picture/gif, description and 1 or 2 links to navigate to the GitHub page, and published online page.
- A component to showcase my Stack, with clickable logos that navigate to the page of the Stack:
	- HTML, CSS, JS, TS, React, Figma, Postman, Node.js, Docker, Git, Cypress, Playwright, BrowserStack, Xray, TestRail, K6, Claude Code, GitHub Copilot, Grafana, Atlassian (Confluence and Jira), Android Studio
- A component with a carousel with the messages I received from Co-workers
- A component with a button or link with my CV link
- A component with my carrer story in a interactive timeline. I will provide the information
	- Date period, role and a brief role description
	- Year and courses I finished
- A component with some pictures of friends at work, during my life. I will provide:
	- images, place, date and a brief text informing who are in the picture
- A contact page, with link to LinkedIn, email 
- Any other good component that would showcase my CV/experience as a QA engineer. Give me ideas


## Home page Content
- My picture on it somewhere, my Name: Bruno Peres, my Role: QA Engineer. Maybe a sentence of effect, create one for me, like: "Confidence for each release"
- A navbar with: Home, About, Contact


## QA-Specific Component Ideas

Curated suggestions that turn the portfolio itself into a QA showcase. Pick the ones you like — each follows the same rules as the rest of the site (JSON-driven content, `data-testid` on every element, responsive, covered by Playwright).

### Tier 1 — strong QA signal, reasonable effort

1. **Live Playwright report** — Publish the latest GitHub Actions Playwright HTML report (e.g., to a `/tests-report` path on GitHub Pages) and link to it from an "Engineering Quality" section. Eats its own dog food: recruiters see real test runs, not just claims.
2. **Test-ID overlay toggle** — A small toggle (e.g., `Shift+T` or a footer switch) that outlines every element with a `data-testid` and shows the ID on hover. The portfolio literally demonstrates testability as a feature.
3. **Quality dashboard** — A compact card on the home or About page with the portfolio's own metrics: Lighthouse scores (perf / a11y / SEO), Playwright pass rate from the last CI run, broken-link checker status. Auto-updated from a JSON file written by CI.
4. **Test strategy diagram** — An interactive test pyramid (or testing trophy). Click each layer (unit / component / E2E / exploratory) and a panel shows how you apply it, ideally with a real example from one of your projects.

### Tier 2 — distinctive, more effort

5. **Bug-hunt mini-challenge** — A tiny sandbox UI with planted bugs (a11y issue, broken validation, off-by-one, race condition). Visitors find them and submit a "bug report" via a styled form. Showcases exploratory-testing mindset and gives recruiters something memorable.
6. **API playground** — An embedded Postman collection runner *or* a simple "try this request" widget against a mock API (e.g., JSONPlaceholder or a tiny in-memory mock). Demonstrates API-testing fluency without needing a backend.
7. **Cross-browser matrix** — A small grid showing the browsers/OSes the portfolio is verified on (BrowserStack screenshot, or a static matrix populated from CI). Signals cross-browser discipline.

### Tier 3 — nice-to-have, mostly content

8. **Test artifact gallery** — Anonymized samples of process work: a test plan excerpt, a bug report template, an exploratory charter, a risk-based test prioritization. Differentiates you from devs who only show code.
9. **Certifications & community** — ISTQB or similar, courses, talks/meetups, articles. Lower priority if you have none yet; high-leverage if you do.
10. **Quality manifesto** — A short "How I think about quality" page that expands the tagline (`"Confidence for each release"`) into 4–6 principles. Strong differentiator if written with personality; skip if it would feel like filler.

### Notes on tagline

If you want alternatives to *"Confidence for each release"*, here are three in the same spirit — pick one or remix:
- *"Ship with confidence, not crossed fingers."*
- *"Quality is the feature shipped with every release."*
- *"Test the path users actually take."*