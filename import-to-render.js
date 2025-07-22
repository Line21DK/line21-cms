const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting import to Render Strapi...');

// Set environment variables for Render
process.env.STRAPI_ADMIN_BACKEND_URL = 'https://line21-cms.onrender.com';

const exportFile = 'export_20250720172709.tar.gz';

if (!require('fs').existsSync(exportFile)) {
  console.error('❌ Export file not found:', exportFile);
  process.exit(1);
}

console.log('📁 Export file found:', exportFile);
console.log('📊 File size:', require('fs').statSync(exportFile).size, 'bytes');

try {
  console.log('📦 Importing data to Render...');
  console.log('🌐 Target URL:', process.env.STRAPI_ADMIN_BACKEND_URL);
  
  // Import the data with verbose output
  execSync(`npx strapi import -f ${exportFile} --verbose`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      STRAPI_ADMIN_BACKEND_URL: 'https://line21-cms.onrender.com',
      NODE_ENV: 'production'
    }
  });
  
  console.log('✅ Import completed successfully!');
  console.log('🌐 Your Strapi CMS is now available at: https://line21-cms.onrender.com');
  console.log('🔧 Admin panel: https://line21-cms.onrender.com/admin');
  
  // Test the import
  console.log('🧪 Testing import...');
  const { execSync: execSyncTest } = require('child_process');
  try {
    const testResult = execSyncTest(`curl -H "Authorization: Bearer 96fc640f52aeb82fcf8c692c600124f949df10d1a6d685b13ce21ad1937e1fa48a8a32d61b67a85e431cb2ad722b5f0e4e3c4087f5e20d196de3e35b75a81620cadc05983ba28e0af45a2555696ceb30318a09c55b43190667986115620df9da64077817f6ce2c3d8fd46132432dca10966aa29a3dc49cf9c2407a9bd042c0c9" "https://line21-cms.onrender.com/api/projects?populate=*"`, { encoding: 'utf8' });
    console.log('📊 Test result:', testResult);
  } catch (testError) {
    console.log('⚠️ Test failed:', testError.message);
  }
  
} catch (error) {
  console.error('❌ Import failed:', error.message);
  console.error('🔍 Full error:', error);
  process.exit(1);
} 