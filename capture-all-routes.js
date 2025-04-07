// Script to capture screenshots of all main routes
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  // Create a screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  console.log('Launching browser to capture all routes...');
  
  // Launch a headless browser
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Define routes to capture
  const routes = [
    { path: '/', name: 'homepage' },
    { path: '/login', name: 'login' },
    { path: '/register', name: 'register' },
    { path: '/reset-password', name: 'reset-password' },
    // Try some potential routes based on the application's purpose
    { path: '/dashboard', name: 'dashboard' },
    { path: '/cases', name: 'cases' },
    { path: '/evidence', name: 'evidence' },
    { path: '/timeline', name: 'timeline' }
  ];
  
  // Capture screenshots for each route
  for (const route of routes) {
    try {
      console.log(`Navigating to ${route.path}...`);
      const response = await page.goto(`http://localhost:3000${route.path}`, { 
        waitUntil: 'networkidle',
        timeout: 10000
      }).catch(() => null);
      
      if (!response) {
        console.log(`  ❌ Failed to load ${route.path}`);
        continue;
      }
      
      const status = response.status();
      console.log(`  Status code: ${status}`);
      
      // Even if it's an error page, take a screenshot
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const screenshotPath = path.join(screenshotsDir, `${route.name}-${timestamp}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  📸 Screenshot saved to: ${screenshotPath}`);
      
      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error capturing ${route.path}:`, error);
    }
  }
  
  await browser.close();
  console.log('✅ All routes captured!');
})().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
}); 