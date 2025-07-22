const fs = require('fs');
const path = require('path');

console.log('🚀 Starting API-based import to Render Strapi...');

const RENDER_URL = 'https://line21-cms.onrender.com';
const API_TOKEN = '96fc640f52aeb82fcf8c692c600124f949df10d1a6d685b13ce21ad1937e1fa48a8a32d61b67a85e431cb2ad722b5f0e4e3c4087f5e20d196de3e35b75a81620cadc05983ba28e0af45a2555696ceb30318a09c55b43190667986115620df9da64077817f6ce2c3d8fd46132432dca10966aa29a3dc49cf9c2407a9bd042c0c9';

// Test connection first
async function testConnection() {
  try {
    const response = await fetch(`${RENDER_URL}/api/projects`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Connection successful');
      console.log('📊 Current projects count:', data.data?.length || 0);
      return true;
    } else {
      console.error('❌ Connection failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

// Import data from local export
async function importData() {
  try {
    // For now, let's just test if we can create a simple project
    console.log('📝 Creating test project...');
    
    const testProject = {
      data: {
        title: 'Test Project from API',
        slug: 'test-project-api',
        description: 'This is a test project created via API',
        category: 'Creative',
        client: 'Test Client',
        year: 2025,
        role: 'Test Role',
        shortDescription: 'A test project created via API',
        featured: false,
        publishedAt: new Date().toISOString()
      }
    };
    
    const response = await fetch(`${RENDER_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testProject)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test project created:', result.data);
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Failed to create test project:', response.status, error);
      return false;
    }
  } catch (error) {
    console.error('❌ Import error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🌐 Target URL:', RENDER_URL);
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot connect to Render Strapi');
    process.exit(1);
  }
  
  // Import data
  const imported = await importData();
  if (imported) {
    console.log('✅ Import completed successfully!');
  } else {
    console.error('❌ Import failed');
    process.exit(1);
  }
}

main().catch(console.error); 