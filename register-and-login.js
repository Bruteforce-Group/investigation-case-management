// Script to register a user and log in to see the dashboard
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  // Create a screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  console.log('Launching browser to register and login...');
  
  // Launch a browser with head mode so we can see what's happening
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Navigate to the register page
    console.log('Step 1: Navigating to the register page...');
    await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle' });
    
    // Take a screenshot before registration
    const registerScreenshotPath = path.join(screenshotsDir, `register-before-${new Date().toISOString().replace(/:/g, '-')}.png`);
    await page.screenshot({ path: registerScreenshotPath, fullPage: true });
    console.log(`   Screenshot saved to: ${registerScreenshotPath}`);
    
    // 2. Fill out the registration form
    console.log('Step 2: Filling out the registration form...');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    
    // If there's a role selector, choose 'INVESTIGATOR'
    const roleSelector = page.locator('select[name="role"]');
    if (await roleSelector.count() > 0) {
      await roleSelector.selectOption('INVESTIGATOR');
    }
    
    // Check terms agreement if it exists
    const termsCheckbox = page.locator('input[name="agreeToTerms"]');
    if (await termsCheckbox.count() > 0) {
      await termsCheckbox.check();
    }
    
    // Take a screenshot after filling the form
    const formFilledScreenshotPath = path.join(screenshotsDir, `register-filled-${new Date().toISOString().replace(/:/g, '-')}.png`);
    await page.screenshot({ path: formFilledScreenshotPath, fullPage: true });
    console.log(`   Screenshot saved to: ${formFilledScreenshotPath}`);
    
    // 3. Submit the registration form
    console.log('Step 3: Submitting the registration form...');
    const registerButton = page.locator('button[type="submit"]');
    if (await registerButton.count() > 0) {
      await registerButton.click();
      
      // Wait for navigation or error
      try {
        await page.waitForNavigation({ timeout: 10000 });
      } catch (error) {
        console.log('   No navigation occurred after registration, might be an error or stay on same page');
      }
      
      // Take a screenshot after registration attempt
      const afterRegisterScreenshotPath = path.join(screenshotsDir, `after-register-${new Date().toISOString().replace(/:/g, '-')}.png`);
      await page.screenshot({ path: afterRegisterScreenshotPath, fullPage: true });
      console.log(`   Screenshot saved to: ${afterRegisterScreenshotPath}`);
    } else {
      console.log('   Submit button not found on registration page');
    }
    
    // 4. Navigate to the login page
    console.log('Step 4: Navigating to the login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    
    // 5. Fill out the login form
    console.log('Step 5: Filling out the login form...');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    
    // Take a screenshot of the filled login form
    const loginScreenshotPath = path.join(screenshotsDir, `login-filled-${new Date().toISOString().replace(/:/g, '-')}.png`);
    await page.screenshot({ path: loginScreenshotPath, fullPage: true });
    console.log(`   Screenshot saved to: ${loginScreenshotPath}`);
    
    // 6. Submit the login form
    console.log('Step 6: Submitting the login form...');
    const loginButton = page.locator('button[type="submit"]');
    if (await loginButton.count() > 0) {
      await loginButton.click();
      
      // Wait for navigation or error
      try {
        await page.waitForNavigation({ timeout: 10000 });
      } catch (error) {
        console.log('   No navigation occurred after login, might be an error or stay on same page');
      }
      
      // Take a screenshot after login attempt
      const afterLoginScreenshotPath = path.join(screenshotsDir, `after-login-${new Date().toISOString().replace(/:/g, '-')}.png`);
      await page.screenshot({ path: afterLoginScreenshotPath, fullPage: true });
      console.log(`   Screenshot saved to: ${afterLoginScreenshotPath}`);
    } else {
      console.log('   Submit button not found on login page');
    }
    
    // 7. Check for dashboard elements
    console.log('Step 7: Checking if login was successful...');
    const dashboardIndicators = [
      'dashboard',
      'cases',
      'evidence',
      'timeline',
      'logout'
    ];
    
    let loginSuccess = false;
    for (const indicator of dashboardIndicators) {
      const element = page.locator(`text=${indicator}`, { ignoreCase: true });
      if (await element.count() > 0) {
        console.log(`   ✅ Found dashboard element: ${indicator}`);
        loginSuccess = true;
      }
    }
    
    if (loginSuccess) {
      console.log('   ✅ Login successful! You are now on the dashboard.');
      
      // Take a screenshot of the dashboard
      const dashboardScreenshotPath = path.join(screenshotsDir, `dashboard-${new Date().toISOString().replace(/:/g, '-')}.png`);
      await page.screenshot({ path: dashboardScreenshotPath, fullPage: true });
      console.log(`   Dashboard screenshot saved to: ${dashboardScreenshotPath}`);
    } else {
      console.log('   ❌ Login might have failed. Could not find dashboard elements.');
    }
    
    // Keep the browser open for inspection (it will close after 30 seconds)
    console.log('\nKeeping browser open for 30 seconds for manual inspection...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('Error during registration or login process:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
}); 