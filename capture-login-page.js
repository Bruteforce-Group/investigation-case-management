// Script to capture a screenshot of the login page
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  // Create a screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  console.log('Launching browser to capture login page screenshot...');
  
  // Launch a headless browser
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to the login page
  console.log('Navigating to http://localhost:3000/login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  
  // Take a screenshot
  const screenshotPath = path.join(screenshotsDir, `login-page-${new Date().toISOString().replace(/:/g, '-')}.png`);
  console.log(`Taking screenshot and saving to ${screenshotPath}...`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  // Close the browser
  await browser.close();
  
  console.log('✅ Login page screenshot captured successfully!');
  console.log(`You can view it at: ${screenshotPath}`);
})().catch(err => {
  console.error('Error capturing screenshot:', err);
  process.exit(1);
}); 