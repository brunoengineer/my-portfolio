import { test, expect } from '@playwright/test';
import footer from '../../src/content/footer.json';

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders footer with socials list and copy', async ({ page }) => {
    await expect(page.getByTestId('site-footer')).toBeVisible();
    await expect(page.getByTestId('footer-socials')).toBeVisible();
    await expect(page.getByTestId('footer-copy')).toBeVisible();
  });

  test('renders one social per entry in footer.json', async ({ page }) => {
    const items = page.getByTestId(/^footer-social-(?!link-|icon-)/);
    await expect(items).toHaveCount(footer.socials.length);
  });

  test('every social links to its url with target=_blank and accessible name', async ({ page }) => {
    for (const s of footer.socials) {
      const link = page.getByTestId(`footer-social-link-${s.id}`);
      await expect(link, `link for ${s.id}`).toBeVisible();
      await expect(link, `href for ${s.id}`).toHaveAttribute('href', s.url);
      await expect(link, `target for ${s.id}`).toHaveAttribute('target', '_blank');
      await expect(link, `rel for ${s.id}`).toHaveAttribute('rel', /noopener/);
      await expect(link, `aria-label for ${s.id}`).toHaveAttribute('aria-label', s.name);
    }
  });
});

test.describe('Footer — mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('footer stays visible on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('site-footer')).toBeVisible();
    await expect(page.getByTestId(/^footer-social-(?!link-|icon-)/)).toHaveCount(footer.socials.length);
  });
});
