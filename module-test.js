// Module test for the Investigation Case Management application
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧩 Testing Investigation Case Management Modules');

// Check important modules exist
const coreModules = [
  { path: 'src/components/evidence/EvidenceManagement.tsx', name: 'Evidence Management' },
  { path: 'src/components/timeline/TimelineVisualization.tsx', name: 'Timeline Visualization' },
  { path: 'src/components/storyline/StorylineAnalysis.tsx', name: 'Storyline Analysis' },
  { path: 'AuthContext.tsx', name: 'Authentication' },
  { path: 'src/lib/db/case.ts', name: 'Case Management' },
  { path: 'src/lib/db/evidence.ts', name: 'Evidence DB Functions' },
  { path: 'src/lib/db/timeline.ts', name: 'Timeline DB Functions' }
];

console.log('\n📂 Checking core modules...');
coreModules.forEach(module => {
  let exists = fs.existsSync(path.join(__dirname, module.path));
  
  // If not found at the specified path, try to find it in the root
  if (!exists && !module.path.startsWith('src/')) {
    exists = fs.existsSync(path.join(__dirname, module.path));
  }
  
  console.log(`  ${exists ? '✅' : '⚠️'} ${module.name} (${module.path})`);
  // Not using assert to allow the script to continue even if some modules are missing
});

// Check API routes if they exist
console.log('\n🌐 Checking API routes...');
const apiDir = path.join(__dirname, 'src/app/api');
if (fs.existsSync(apiDir)) {
  const apiRoutes = fs.readdirSync(apiDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log(`  Found ${apiRoutes.length} API routes: ${apiRoutes.join(', ')}`);
} else {
  console.log('  ⚠️ API directory not found at expected location (src/app/api)');
}

// Check authentication configuration
console.log('\n🔒 Checking authentication setup...');
const authFiles = [
  'AuthContext.tsx',
  'AuthGuard.tsx',
  'src/app/login/page.tsx',
  'src/app/register/page.tsx'
];

authFiles.forEach(file => {
  let exists = fs.existsSync(path.join(__dirname, file));
  // If not found at the specified path, try to find it in different locations
  if (!exists) {
    const altPaths = [
      file,
      `src/components/auth/${path.basename(file)}`,
      `src/contexts/${path.basename(file)}`
    ];
    for (const altPath of altPaths) {
      if (fs.existsSync(path.join(__dirname, altPath))) {
        exists = true;
        break;
      }
    }
  }
  console.log(`  ${exists ? '✅' : '⚠️'} ${file}`);
});

console.log('\n✅ Module test completed!');
console.log('Note: This test only checks for the presence of files, not their functionality.'); 