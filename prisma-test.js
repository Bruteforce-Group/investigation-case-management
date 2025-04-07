// Prisma configuration test
console.log('🗄️ Testing Prisma Database Configuration');

// Check if required files exist
const fs = require('fs');
const path = require('path');

// Files to check
const prismaFiles = [
  'prisma/schema.prisma',
  'prisma.ts',
  'src/lib/db/prisma.ts'
];

console.log('\n📄 Checking Prisma files...');
prismaFiles.forEach(file => {
  let exists = fs.existsSync(path.join(__dirname, file));
  // For files that might be in different locations
  if (!exists && !file.startsWith('prisma/')) {
    const altPaths = [
      file,
      `src/${file}`,
      `src/lib/${file}`
    ];
    for (const altPath of altPaths) {
      if (fs.existsSync(path.join(__dirname, altPath))) {
        exists = true;
        file = altPath; // Update the file path for reporting
        break;
      }
    }
  }
  console.log(`  ${exists ? '✅' : '⚠️'} ${file}`);
});

// Check schema.prisma content
console.log('\n🔍 Analyzing schema.prisma...');
const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Check database provider
  const providerMatch = schemaContent.match(/provider\s*=\s*"([^"]+)"/);
  if (providerMatch) {
    console.log(`  ✅ Database provider: ${providerMatch[1]}`);
  } else {
    console.log('  ⚠️ Could not determine database provider');
  }
  
  // Count models
  const modelMatches = schemaContent.match(/model\s+(\w+)\s+{/g);
  if (modelMatches) {
    console.log(`  ✅ Found ${modelMatches.length} models in schema`);
    
    // Extract model names for display
    const modelNames = modelMatches.map(match => match.match(/model\s+(\w+)\s+{/)[1]);
    console.log(`  📊 Models: ${modelNames.join(', ')}`);
  } else {
    console.log('  ⚠️ No models found in schema');
  }
  
  // Check for vector support
  const hasVector = schemaContent.includes('vector');
  console.log(`  ${hasVector ? '✅' : '⚠️'} Vector database support: ${hasVector ? 'Yes' : 'No'}`);
} else {
  console.log('  ⚠️ schema.prisma file not found');
}

console.log('\n✅ Prisma test completed!');
console.log('Note: This test only checks configuration files, not actual database connectivity.'); 