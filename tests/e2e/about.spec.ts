import { test, expect } from '@playwright/test';
import about from '../../src/content/about.json';

test.describe('About section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders section, heading, bio and stats', async ({ page }) => {
    await expect(page.getByTestId('about-section')).toBeVisible();
    await expect(page.getByTestId('about-heading')).toHaveText('About');
    await expect(page.getByTestId('about-bio')).toHaveText(about.bio);
    await expect(page.getByTestId('about-stats')).toBeVisible();
  });

  test('renders one stat per entry in about.json', async ({ page }) => {
    const stats = page.getByTestId(/^about-stat-(?!value-|label-)/);
    await expect(stats).toHaveCount(about.stats.length);
  });

  test('each stat shows its value and label', async ({ page }) => {
    for (const s of about.stats) {
      await expect(page.getByTestId(`about-stat-value-${s.id}`)).toHaveText(s.value);
      await expect(page.getByTestId(`about-stat-label-${s.id}`)).toHaveText(s.label);
    }
  });

  test('cv button links to the resume URL and opens in a new tab', async ({ page }) => {
    const cv = page.getByTestId('about-cv-link');
    await expect(cv).toBeVisible();
    await expect(cv).toHaveAttribute('href', about.cv.href);
    await expect(cv).toHaveAttribute('target', '_blank');
    await expect(cv).toHaveAttribute('rel', /noopener/);
  });
});

test.describe('About section — mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('stats grid stays visible on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('about-stats')).toBeVisible();
    await expect(page.getByTestId(/^about-stat-(?!value-|label-)/)).toHaveCount(about.stats.length);
  });
});
