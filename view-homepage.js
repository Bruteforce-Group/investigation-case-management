// Script to view the homepage in a non-headless browser
const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser to view homepage...');
  
  // Launch a browser with head mode so we can see what's happening
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the homepage
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Keep the browser open for inspection (it will close after 60 seconds)
    console.log('\nKeeping browser open for 60 seconds for manual inspection...');
    console.log('You should see the application in a browser window.');
    await new Promise(resolve => setTimeout(resolve, 60000));
    
  } catch (error) {
    console.error('Error viewing homepage:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
}); 