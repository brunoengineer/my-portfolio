import { test, expect } from '@playwright/test';
import contact from '../../src/content/contact.json';

test.describe('Contact section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders section, heading and grid', async ({ page }) => {
    await expect(page.getByTestId('contact-section')).toBeVisible();
    await expect(page.getByTestId('contact-heading')).toHaveText('Contact');
    await expect(page.getByTestId('contact-grid')).toBeVisible();
  });

  test('renders one card per entry in contact.json', async ({ page }) => {
    const cards = page.getByTestId(/^contact-card-/);
    await expect(cards).toHaveCount(contact.channels.length);
  });

  test('each channel link uses the correct href and target', async ({ page }) => {
    for (const c of contact.channels) {
      const link = page.getByTestId(`contact-link-${c.id}`);
      await expect(link, `link for ${c.id}`).toHaveAttribute('href', c.href);
      if (c.href.startsWith('http')) {
        await expect(link, `target for ${c.id}`).toHaveAttribute('target', '_blank');
        await expect(link, `rel for ${c.id}`).toHaveAttribute('rel', /noopener/);
      }
      await expect(page.getByTestId(`contact-label-${c.id}`)).toHaveText(c.label);
      await expect(page.getByTestId(`contact-value-${c.id}`)).toHaveText(c.value);
    }
  });
});

test.describe('Contact section — mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('contact grid stays visible on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('contact-grid')).toBeVisible();
    await expect(page.getByTestId(/^contact-card-/)).toHaveCount(contact.channels.length);
  });
});
