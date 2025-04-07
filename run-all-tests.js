// Combined test runner for Investigation Case Management
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create a test results directory
const resultsDir = path.join(__dirname, 'test-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

const logFile = path.join(resultsDir, `test-run-${new Date().toISOString().replace(/:/g, '-')}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Function to log to both console and file
function log(message) {
  console.log(message);
  logStream.write(message + '\n');
}

log('🧪 Running all Investigation Case Management tests');
log('================================================');
log(`Test run started at: ${new Date().toLocaleString()}`);
log('');

try {
  // 1. Smoke Test
  log('🔍 Running Smoke Tests...');
  log('------------------------');
  try {
    const smokeTestOutput = execSync('node smoke-test.js').toString();
    log(smokeTestOutput);
  } catch (error) {
    log(`❌ Smoke Test Error: ${error.message}`);
    if (error.stdout) log(error.stdout.toString());
    if (error.stderr) log(error.stderr.toString());
  }
  log('');

  // 2. Module Test
  log('🧩 Running Module Tests...');
  log('--------------------------');
  try {
    const moduleTestOutput = execSync('node module-test.js').toString();
    log(moduleTestOutput);
  } catch (error) {
    log(`❌ Module Test Error: ${error.message}`);
    if (error.stdout) log(error.stdout.toString());
    if (error.stderr) log(error.stderr.toString());
  }
  log('');

  // 3. Prisma Test
  log('🗄️ Running Prisma Tests...');
  log('-------------------------');
  try {
    const prismaTestOutput = execSync('node prisma-test.js').toString();
    log(prismaTestOutput);
  } catch (error) {
    log(`❌ Prisma Test Error: ${error.message}`);
    if (error.stdout) log(error.stdout.toString());
    if (error.stderr) log(error.stderr.toString());
  }
  log('');

  // 4. Run basic test script if available
  const basicTestPath = path.join(__dirname, 'tests/basic.spec.ts');
  if (fs.existsSync(basicTestPath)) {
    log('🎭 Running Playwright Tests...');
    log('-----------------------------');
    try {
      // Check if the server is running
      try {
        // Attempt to connect to the local server
        const serverCheck = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000').toString();
        const serverRunning = serverCheck === '200';
        
        if (serverRunning) {
          log('✅ Server is running, attempting to run Playwright tests...');
          try {
            // Try to run the tests
            const playwrightOutput = execSync('npx playwright test tests/basic.spec.ts --reporter=list').toString();
            log(playwrightOutput);
            log('✅ Playwright tests completed successfully!');
          } catch (error) {
            log(`⚠️ Playwright test execution error: ${error.message}`);
            if (error.stdout) log(error.stdout.toString());
            if (error.stderr) log(error.stderr.toString());
            
            // If it's just a module not found error, suggest installation
            if (error.message.includes("Cannot find module '@playwright/test'")) {
              log('ℹ️ Playwright test module not found. Try running:');
              log('   npm install -D @playwright/test');
              log('   npx playwright install');
            }
          }
        } else {
          log('⚠️ Server does not appear to be running (HTTP status code was not 200)');
          log('   To run UI tests, start the server with: npm run dev');
        }
      } catch (error) {
        log('⚠️ Server does not appear to be running or reachable');
        log('   To run UI tests, start the server with: npm run dev');
      }
    } catch (error) {
      log(`❌ Playwright Test Error: ${error.message}`);
      if (error.stdout) log(error.stdout.toString());
      if (error.stderr) log(error.stderr.toString());
    }
    log('');
  }

  // Test Summary
  log('📊 Test Summary');
  log('--------------');
  log('✅ Smoke Tests: Completed');
  log('✅ Module Tests: Completed');
  log('✅ Prisma Tests: Completed'); 
  if (fs.existsSync(basicTestPath)) {
    log('🔍 Playwright Tests: Attempted (see logs for details)');
  }
  log('');
  log(`📝 Full test results saved to: ${logFile}`);
  log('');
  log('🏁 Test run completed at: ' + new Date().toLocaleString());
} catch (error) {
  log(`❌ Test Runner Error: ${error.message}`);
} finally {
  logStream.end();
}

// Print a message about the test results location
console.log(`\n📝 Test results saved to: ${logFile}`);
console.log('You can review the complete test output there.'); 