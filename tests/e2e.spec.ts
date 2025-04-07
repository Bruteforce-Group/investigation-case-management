import { test, expect } from '@playwright/test';

// Authentication tests
test.describe('Authentication', () => {
  test('should allow user to register', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.selectOption('select[name="role"]', 'INVESTIGATOR');
    await page.check('input[name="agreeToTerms"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Expect to be redirected to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });
  
  test('should allow user to login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Expect to be redirected to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });
  
  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form with invalid credentials
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Expect error message
    await expect(page.locator('.bg-red-50')).toBeVisible();
  });
  
  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Expect to be redirected to login
    await expect(page).toHaveURL(/login/);
  });
});

// Case Management tests
test.describe('Case Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });
  
  test('should create a new case', async ({ page }) => {
    await page.goto('/cases/new');
    
    // Fill case form
    await page.fill('input[name="title"]', 'Test Case');
    await page.fill('textarea[name="description"]', 'This is a test case description');
    await page.selectOption('select[name="status"]', 'OPEN');
    await page.selectOption('select[name="priority"]', 'MEDIUM');
    await page.fill('input[name="startDate"]', '2025-04-06');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Expect to be redirected to case details
    await expect(page).toHaveURL(/cases\/[a-zA-Z0-9-]+$/);
    
    // Expect case title to be visible
    await expect(page.locator('h1')).toContainText('Test Case');
  });
  
  test('should view case details', async ({ page }) => {
    // Navigate to cases page
    await page.goto('/cases');
    
    // Click on the first case
    await page.click('a[href^="/cases/"]');
    
    // Expect case details to be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('div.case-details')).toBeVisible();
  });
  
  test('should edit a case', async ({ page }) => {
    // Navigate to cases page
    await page.goto('/cases');
    
    // Click on the first case
    await page.click('a[href^="/cases/"]');
    
    // Click edit button
    await page.click('button:has-text("Edit")');
    
    // Update case title
    await page.fill('input[name="title"]', 'Updated Test Case');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Expect updated title to be visible
    await expect(page.locator('h1')).toContainText('Updated Test Case');
  });
});

// Evidence Management tests
test.describe('Evidence Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Navigate to a case
    await page.goto('/cases');
    await page.click('a[href^="/cases/"]');
  });
  
  test('should add document evidence', async ({ page }) => {
    // Navigate to evidence tab
    await page.click('button:has-text("Evidence")');
    
    // Click add evidence button
    await page.click('button:has-text("Add Evidence")');
    
    // Fill evidence form
    await page.fill('input[name="title"]', 'Test Document');
    await page.fill('textarea[name="description"]', 'This is a test document');
    await page.selectOption('select[name="evidenceType"]', 'DOCUMENT');
    
    // Upload file
    await page.setInputFiles('input[type="file"]', 'path/to/test/document.pdf');
    
    // Submit form
    await page.click('button:has-text("Upload Evidence")');
    
    // Expect evidence to be added to list
    await expect(page.locator('div.evidence-list')).toContainText('Test Document');
  });
  
  test('should view evidence details', async ({ page }) => {
    // Navigate to evidence tab
    await page.click('button:has-text("Evidence")');
    
    // Click on evidence item
    await page.click('div.evidence-item');
    
    // Expect evidence details to be visible
    await expect(page.locator('div.evidence-details')).toBeVisible();
  });
});

// Timeline tests
test.describe('Timeline', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Navigate to a case
    await page.goto('/cases');
    await page.click('a[href^="/cases/"]');
  });
  
  test('should add timeline event', async ({ page }) => {
    // Navigate to timeline tab
    await page.click('button:has-text("Timeline")');
    
    // Click add event button
    await page.click('button:has-text("Add Event")');
    
    // Fill event form
    await page.fill('input[name="title"]', 'Test Event');
    await page.fill('textarea[name="description"]', 'This is a test event');
    await page.fill('input[name="eventDate"]', '2025-04-06T12:00');
    await page.fill('input[name="location"]', 'Test Location');
    await page.fill('input[name="importance"]', '3');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Expect event to be added to timeline
    await expect(page.locator('div.timeline')).toContainText('Test Event');
  });
  
  test('should filter timeline', async ({ page }) => {
    // Navigate to timeline tab
    await page.click('button:has-text("Timeline")');
    
    // Set date filter
    await page.fill('input[name="startDate"]', '2025-01-01');
    await page.fill('input[name="endDate"]', '2025-12-31');
    
    // Apply filter
    await page.click('button:has-text("Apply Filters")');
    
    // Expect timeline to be filtered
    await expect(page.locator('div.timeline')).toBeVisible();
  });
});

// Analysis tests
test.describe('Analysis', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Navigate to a case
    await page.goto('/cases');
    await page.click('a[href^="/cases/"]');
  });
  
  test('should generate storyline analysis', async ({ page }) => {
    // Navigate to analysis tab
    await page.click('button:has-text("Analysis")');
    
    // Click generate analysis button
    await page.click('button:has-text("Generate Storyline Analysis")');
    
    // Wait for analysis to complete
    await page.waitForSelector('div.analysis-content', { state: 'visible', timeout: 30000 });
    
    // Expect analysis content to be visible
    await expect(page.locator('div.analysis-content')).toBeVisible();
  });
  
  test('should view different analysis sections', async ({ page }) => {
    // Navigate to analysis tab
    await page.click('button:has-text("Analysis")');
    
    // Wait for analysis to be visible
    await page.waitForSelector('div.analysis-content', { state: 'visible' });
    
    // Click on different section tabs
    await page.click('button:has-text("Findings")');
    await expect(page.locator('div.analysis-content')).toBeVisible();
    
    await page.click('button:has-text("Motives")');
    await expect(page.locator('div.analysis-content')).toBeVisible();
    
    await page.click('button:has-text("Alternatives")');
    await expect(page.locator('div.analysis-content')).toBeVisible();
  });
});

// Error handling tests
test.describe('Error Handling', () => {
  test('should validate form inputs', async ({ page }) => {
    await page.goto('/register');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Expect validation errors
    await expect(page.locator('.text-red-600')).toBeVisible();
  });
  
  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      });
    });
    
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Expect error message
    await expect(page.locator('.bg-red-50')).toBeVisible();
  });
});
