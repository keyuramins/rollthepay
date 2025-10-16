// Development Script to toggle between development and production configurations
// FILES
// app/page.tsx
// app/[country]/page.tsx
// app/about/page.tsx
// app/[country]/[...url]/page.tsx
// CHANGES:
// 1. Change the revalidate value from 31536000 to 0 in development
// 2. Change the revalidate value from 0 to 31536000 in production
// 3. Change the dynamicParams value from false to true in development
// 4. Change the dynamicParams value from true to false in production
// 5. Set development country filter for faster data loading

const fs = require('fs');
const path = require('path');

// Configuration
const files = [
  'app/page.tsx',
  'app/[country]/page.tsx',
  'app/about/page.tsx',
  'app/[country]/[...url]/page.tsx'
];

const configs = {
  development: {
    revalidate: 0,
    dynamicParams: true
  },
  production: {
    revalidate: 31536000,
    dynamicParams: false
  }
};

// Helper function to update file content
function updateFile(filePath, config) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // First, remove ALL existing revalidate and dynamicParams declarations (both active and commented)
    // This prevents duplicates and ensures clean state
    
    // Remove all revalidate declarations (commented and uncommented)
    content = content.replace(/\/\/ export const revalidate = \d+;\s*\n?/g, '');
    content = content.replace(/export const revalidate = \d+;\s*\n?/g, '');
    
    // Remove all dynamicParams declarations (commented and uncommented)
    content = content.replace(/\/\/ export const dynamicParams = (true|false);\s*\n?/g, '');
    content = content.replace(/export const dynamicParams = (true|false);\s*\n?/g, '');

    // Now add the correct configuration
    // Find the position after the last import statement to insert our exports
    const importRegex = /(import\s+.*?from\s+['"][^'"]+['"];?\s*\n?)+/g;
    const importMatch = content.match(importRegex);
    
    if (importMatch) {
      // Insert after the last import
      const lastImport = importMatch[importMatch.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertPosition = lastImportIndex + lastImport.length;
      
      // Insert our configuration
      const newExports = `\nexport const revalidate = ${config.revalidate};\nexport const dynamicParams = ${config.dynamicParams};\n\n`;
      content = content.slice(0, insertPosition) + newExports + content.slice(insertPosition);
    } else {
      // If no imports found, add at the beginning after any comments
      const commentRegex = /^(\/\*[\s\S]*?\*\/|\/\/.*?\n)*/;
      const commentMatch = content.match(commentRegex);
      const insertPosition = commentMatch ? commentMatch[0].length : 0;
      
      const newExports = `export const revalidate = ${config.revalidate};\nexport const dynamicParams = ${config.dynamicParams};\n\n`;
      content = content.slice(0, insertPosition) + newExports + content.slice(insertPosition);
    }

    modified = true;
    console.log(`  ✓ Set revalidate to ${config.revalidate}`);
    console.log(`  ✓ Set dynamicParams to ${config.dynamicParams}`);

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed for ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function toggleConfig(mode) {
  if (!configs[mode]) {
    console.error(`❌ Invalid mode: ${mode}. Use 'development' or 'production'`);
    process.exit(1);
  }

  console.log(`🔄 Switching to ${mode} configuration...`);
  console.log(`   revalidate: ${configs[mode].revalidate}`);
  console.log(`   dynamicParams: ${configs[mode].dynamicParams}`);
  console.log('');

  let successCount = 0;
  let totalFiles = files.length;

  files.forEach(filePath => {
    console.log(`📝 Processing ${filePath}...`);
    if (updateFile(filePath, configs[mode])) {
      successCount++;
    }
    console.log('');
  });

  console.log(`🎉 Configuration update complete!`);
  console.log(`   Successfully updated: ${successCount}/${totalFiles} files`);
  
  if (successCount === totalFiles) {
    console.log(`✅ All files updated to ${mode} configuration`);
  } else {
    console.log(`⚠️  Some files could not be updated. Please check the errors above.`);
  }
}

// Helper function to update environment file
function updateEnvFile(country = null) {
  const envPath = '.env.local';
  const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  
  let newContent = envContent;
  
  // Remove existing DEV_COUNTRY_FILTER if present
  newContent = newContent.replace(/^DEV_COUNTRY_FILTER=.*$/m, '');
  
  if (country) {
    // Add or update DEV_COUNTRY_FILTER
    const filterLine = `DEV_COUNTRY_FILTER=${country.toLowerCase()}`;
    if (newContent.trim()) {
      newContent += `\n${filterLine}`;
    } else {
      newContent = filterLine;
    }
    console.log(`✅ Set development country filter to: ${country}`);
  } else {
    console.log('✅ Cleared development country filter (will load all countries)');
  }
  
  fs.writeFileSync(envPath, newContent);
}

// Command line interface
const args = process.argv.slice(2);
const mode = args[0];
const country = args[1];

if (!mode) {
  console.log('Usage: node dev.js <mode> [country]');
  console.log('');
  console.log('Modes:');
  console.log('  development  - Set revalidate=0, dynamicParams=true');
  console.log('  production   - Set revalidate=31536000, dynamicParams=false');
  console.log('');
  console.log('Optional country parameter (development only):');
  console.log('  Specify a country to load only that country\'s data for faster development');
  console.log('  Examples: australia, india, singapore, etc.');
  console.log('');
  console.log('Examples:');
  console.log('  node dev.js development');
  console.log('  node dev.js development australia');
  console.log('  node dev.js production');
  process.exit(1);
}

toggleConfig(mode);

// Handle country filter for development mode
if (mode === 'development') {
  updateEnvFile(country);
} else if (mode === 'production') {
  // Clear country filter for production
  updateEnvFile(null);
}

