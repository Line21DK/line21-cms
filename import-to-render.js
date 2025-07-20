const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting import to Render Strapi...');

// Set environment variables for Render
process.env.STRAPI_ADMIN_BACKEND_URL = 'https://line21-cms.onrender.com';

const exportFile = 'export_20250720171015.tar.gz';

if (!require('fs').existsSync(exportFile)) {
  console.error('❌ Export file not found:', exportFile);
  process.exit(1);
}

try {
  console.log('📦 Importing data to Render...');
  
  // Import the data
  execSync(`npx strapi import -f ${exportFile}`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      STRAPI_ADMIN_BACKEND_URL: 'https://line21-cms.onrender.com'
    }
  });
  
  console.log('✅ Import completed successfully!');
  console.log('🌐 Your Strapi CMS is now available at: https://line21-cms.onrender.com/admin');
  
} catch (error) {
  console.error('❌ Import failed:', error.message);
  process.exit(1);
} 