import { test, expect } from '@playwright/test';
import stack from '../../src/content/stack.json';

test.describe('Stack section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders section, heading and grid', async ({ page }) => {
    await expect(page.getByTestId('stack-section')).toBeVisible();
    await expect(page.getByTestId('stack-heading')).toHaveText('Stack');
    await expect(page.getByTestId('stack-grid')).toBeVisible();
  });

  test('renders one item per entry in stack.json', async ({ page }) => {
    const items = page.getByTestId(/^stack-item-/);
    await expect(items).toHaveCount(stack.length);
  });

  test('every stack item links to its tool with target=_blank', async ({ page }) => {
    for (const item of stack) {
      const link = page.getByTestId(`stack-link-${item.id}`);
      await expect(link, `link for ${item.id}`).toBeVisible();
      await expect(link, `href for ${item.id}`).toHaveAttribute('href', item.url);
      await expect(link, `target for ${item.id}`).toHaveAttribute('target', '_blank');
      await expect(link, `rel for ${item.id}`).toHaveAttribute('rel', /noopener/);
      await expect(
        page.getByTestId(`stack-name-${item.id}`),
        `name for ${item.id}`
      ).toHaveText(item.name);
    }
  });

  test('items without an iconSlug fall back to an initial', async ({ page }) => {
    const fallbackItems = stack.filter((s) => !s.iconSlug);
    for (const item of fallbackItems) {
      const icon = page.getByTestId(`stack-icon-${item.id}`);
      await expect(icon, `fallback icon for ${item.id}`).toContainText(item.name.charAt(0));
    }
  });
});

test.describe('Stack section — mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('grid stays visible and renders all items on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('stack-grid')).toBeVisible();
    await expect(page.getByTestId(/^stack-item-/)).toHaveCount(stack.length);
  });
});
