import { test, expect } from '@playwright/test';
import projects from '../../src/content/projects.json';

test.describe('Projects section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders section, heading and grid', async ({ page }) => {
    await expect(page.getByTestId('projects-section')).toBeVisible();
    await expect(page.getByTestId('projects-heading')).toHaveText('Projects');
    await expect(page.getByTestId('projects-grid')).toBeVisible();
  });

  test('renders one card per entry in projects.json', async ({ page }) => {
    const cards = page.getByTestId(/^project-card-/);
    await expect(cards).toHaveCount(projects.length);
  });

  for (const project of projects) {
    test(`card "${project.id}" shows title, description and matching links`, async ({ page }) => {
      const card = page.getByTestId(`project-card-${project.id}`);
      await expect(card).toBeVisible();

      await expect(card.getByTestId(`project-title-${project.id}`)).toHaveText(project.title);
      await expect(card.getByTestId(`project-description-${project.id}`)).toHaveText(
        project.description
      );

      const github = card.getByTestId(`project-link-github-${project.id}`);
      if (project.githubUrl) {
        await expect(github).toHaveAttribute('href', project.githubUrl);
        await expect(github).toHaveAttribute('target', '_blank');
        await expect(github).toHaveAttribute('rel', /noopener/);
      } else {
        await expect(github).toHaveCount(0);
      }

      const live = card.getByTestId(`project-link-live-${project.id}`);
      if (project.liveUrl) {
        await expect(live).toHaveAttribute('href', project.liveUrl);
        await expect(live).toHaveAttribute('target', '_blank');
        await expect(live).toHaveAttribute('rel', /noopener/);
      } else {
        await expect(live).toHaveCount(0);
      }
    });
  }
});

test.describe('Projects section — mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('cards remain visible and stack on mobile', async ({ page }) => {
    await page.goto('/');
    const grid = page.getByTestId('projects-grid');
    await expect(grid).toBeVisible();
    await expect(page.getByTestId(/^project-card-/)).toHaveCount(projects.length);
  });
});
