import { test, expect } from '@playwright/test';
import testimonials from '../../src/content/testimonials.json';

test.describe('Testimonials section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders section and heading', async ({ page }) => {
    await expect(page.getByTestId('testimonials-section')).toBeVisible();
    await expect(page.getByTestId('testimonials-heading')).toHaveText('Testimonials');
    await expect(page.getByTestId('testimonials-marquee')).toBeVisible();
  });

  test('renders both marquee rows', async ({ page }) => {
    await expect(page.getByTestId('testimonials-row-a')).toBeVisible();
    await expect(page.getByTestId('testimonials-row-b')).toBeVisible();
  });

  test('every item appears at least once with its quote and origin', async ({ page }) => {
    for (const t of testimonials.items) {
      // each item is rendered twice (for the seamless loop), so use first()
      await expect(
        page.getByTestId(`testimonial-quote-${t.id}`).first()
      ).toHaveText(t.quote);
      await expect(
        page.getByTestId(`testimonial-name-${t.id}`).first()
      ).toHaveText(t.name);
      await expect(
        page.getByTestId(`testimonial-origin-${t.id}`).first()
      ).toHaveText(t.origin);
    }
  });
});

test.describe('Testimonials section — mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('marquee remains visible on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('testimonials-marquee')).toBeVisible();
  });
});
