// Simple script to visit and screenshot the homepage
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    console.log('Opening http://localhost:3000');
    await page.goto('http://localhost:3000');
    
    // Save screenshot
    const screenshotPath = path.join(__dirname, 'homepage.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to: ${screenshotPath}`);
    
    await browser.close();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
})(); 