import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders core structure', async ({ page }) => {
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page.getByTestId('site-header')).toBeVisible();
    await expect(page.getByTestId('hero')).toBeVisible();
  });

  test('shows brand and identity from site.json', async ({ page }) => {
    await expect(page.getByTestId('brand')).toHaveText('Bruno Peres');
    await expect(page.getByTestId('hero-name')).toHaveText('Bruno Peres');
    await expect(page.getByTestId('hero-role')).toHaveText('QA Engineer');
    await expect(page.getByTestId('hero-tagline')).toHaveText('Engineering confidence into every release');
  });

  test('primary nav lists all seven sections in order', async ({ page }) => {
    const nav = page.getByTestId('primary-nav');
    await expect(nav.getByTestId('nav-link-home')).toHaveText('Home');
    await expect(nav.getByTestId('nav-link-about')).toHaveText('About');
    await expect(nav.getByTestId('nav-link-projects')).toHaveText('Projects');
    await expect(nav.getByTestId('nav-link-stack')).toHaveText('Stack');
    await expect(nav.getByTestId('nav-link-tests')).toHaveText('Tests');
    await expect(nav.getByTestId('nav-link-testimonials')).toHaveText('Testimonials');
    await expect(nav.getByTestId('nav-link-contact')).toHaveText('Contact');
    await expect(nav.locator('a')).toHaveCount(7);
  });

  test('nav links point at in-page anchors', async ({ page }) => {
    await expect(page.getByTestId('nav-link-home')).toHaveAttribute('href', '#home');
    await expect(page.getByTestId('nav-link-about')).toHaveAttribute('href', '#about');
    await expect(page.getByTestId('nav-link-projects')).toHaveAttribute('href', '#projects');
    await expect(page.getByTestId('nav-link-stack')).toHaveAttribute('href', '#stack');
    await expect(page.getByTestId('nav-link-tests')).toHaveAttribute('href', '#tests');
    await expect(page.getByTestId('nav-link-testimonials')).toHaveAttribute('href', '#testimonials');
    await expect(page.getByTestId('nav-link-contact')).toHaveAttribute('href', '#contact');
  });

  test('document title reflects identity', async ({ page }) => {
    await expect(page).toHaveTitle(/Bruno Peres.*QA Engineer/);
  });
});

test.describe('Home page — mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('hero stays visible and hamburger replaces the desktop nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero-name')).toBeVisible();
    await expect(page.getByTestId('nav-burger')).toBeVisible();
    await expect(page.getByTestId('primary-nav')).toBeHidden();
  });

  test('tapping the hamburger reveals all nav links in the overlay', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-burger').click();
    const overlay = page.getByTestId('mobile-nav');
    await expect(overlay).toBeVisible();
    await expect(overlay.locator('a')).toHaveCount(7);
    await expect(overlay.getByTestId('mobile-nav-link-testimonials')).toBeVisible();
  });
});
