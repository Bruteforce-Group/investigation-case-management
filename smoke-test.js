// Simple smoke test for the Investigation Case Management application
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running Investigation Case Management smoke tests');

// Check essential files exist
const essentialFiles = [
  'package.json',
  'next.config.ts',
  'prisma/schema.prisma',
  'src/app/page.tsx',
  'src/app/layout.tsx'
];

console.log('\n📄 Checking essential files...');
essentialFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  assert(exists, `Essential file ${file} is missing`);
});

// Check package.json contents
console.log('\n📦 Checking package.json...');
const packageJson = require('./package.json');
assert(packageJson.name === 'investigation_web_app_nextjs', 'Package name is incorrect');
assert(packageJson.dependencies.next, 'Next.js dependency is missing');
assert(packageJson.dependencies['@prisma/client'], 'Prisma client dependency is missing');
console.log('  ✅ package.json looks good');

// Check schema.prisma
console.log('\n🗄️ Checking database schema...');
const schemaContent = fs.readFileSync(path.join(__dirname, 'prisma/schema.prisma'), 'utf8');
const requiredModels = ['User', 'Case', 'Evidence', 'TimelineEvent', 'Person', 'Location'];
const missingModels = requiredModels.filter(model => !schemaContent.includes(`model ${model}`));
assert(missingModels.length === 0, `Missing required models: ${missingModels.join(', ')}`);
console.log('  ✅ All required database models are present');

// All tests passed
console.log('\n🎉 All smoke tests passed successfully!');
console.log('The application structure appears to be in good shape.');
console.log('Note: These are basic structure tests and do not verify functionality.'); 