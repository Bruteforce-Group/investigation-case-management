import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page has loaded correctly
  await expect(page).toHaveTitle(/Investigation Case Management|Next.js/);
});

test('can navigate to login page', async ({ page }) => {
  await page.goto('/');
  
  // Find and click a link to the login page if it exists
  const loginLink = page.getByRole('link', { name: /login|sign in/i });
  if (await loginLink.count() > 0) {
    await loginLink.click();
    await expect(page).toHaveURL(/.*login/);
  } else {
    console.log('Login link not found, may not be accessible from homepage');
  }
});

test('has expected UI elements', async ({ page }) => {
  await page.goto('/');
  
  // Check for basic page elements
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
}); 