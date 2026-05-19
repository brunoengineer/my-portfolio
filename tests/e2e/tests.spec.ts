import { test, expect } from '@playwright/test';
import tests from '../../src/content/tests.json';

test.describe('Tests section', () => {
  test.beforeEach(async ({ page }) => {
    // stub GitHub Actions API so the suite isn't coupled to live runs or rate limits
    await page.route(/api\.github\.com\/repos\/.+\/actions\/workflows\/.+\/runs/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total_count: 1,
          workflow_runs: [
            {
              run_number: 999,
              status: 'completed',
              conclusion: 'success',
              html_url: 'https://github.com/brunoengineer/my-portfolio/actions/runs/999',
              updated_at: new Date(Date.now() - 5 * 60_000).toISOString(),
              head_commit: { message: 'test stub commit', id: 'deadbeefdeadbeef' },
              head_branch: 'main',
            },
          ],
        }),
      })
    );
    await page.goto('/');
  });

  test('renders section, heading and grid', async ({ page }) => {
    await expect(page.getByTestId('tests-section')).toBeVisible();
    await expect(page.getByTestId('tests-heading')).toHaveText('Tests');
    await expect(page.getByTestId('tests-grid')).toBeVisible();
  });

  test('renders one card per entry in tests.json', async ({ page }) => {
    const cards = page.getByTestId(/^test-card-/);
    await expect(cards).toHaveCount(tests.cards.length);
  });

  test('each card shows its title and description', async ({ page }) => {
    for (const c of tests.cards) {
      await expect(page.getByTestId(`test-title-${c.id}`)).toHaveText(c.title);
      await expect(page.getByTestId(`test-desc-${c.id}`)).toHaveText(c.description);
    }
  });

  test('coming-soon cards have a disabled run button', async ({ page }) => {
    const comingSoon = tests.cards.filter((c) => c.status === 'coming-soon');
    for (const c of comingSoon) {
      const btn = page.getByTestId(`test-run-${c.id}`);
      await expect(btn).toBeDisabled();
    }
  });

  test('live card loads run metadata and enables its run button', async ({ page }) => {
    const live = tests.cards.find((c) => c.status === 'live');
    if (!live) test.skip();
    const id = live!.id;
    await expect(page.getByTestId(`test-meta-${id}`)).toBeVisible();
    await expect(page.getByTestId(`test-status-${id}`)).toContainText('passing');
    await expect(page.getByTestId(`test-run-${id}`)).toBeEnabled();
  });

  test('clicking run on a live card opens the terminal and surfaces the report link', async ({ page }) => {
    const live = tests.cards.find((c) => c.status === 'live');
    if (!live) test.skip();
    const id = live!.id;
    await page.getByTestId(`test-run-${id}`).click();
    await expect(page.getByTestId(`test-terminal-${id}`)).toBeVisible();
    const link = page.getByTestId(`test-report-link-${id}`);
    await expect(link).toBeVisible({ timeout: 10_000 });
    await expect(link).toHaveAttribute('href', /github\.com.*\/actions\/runs\/999/);
    await expect(link).toHaveAttribute('target', '_blank');
  });
});
