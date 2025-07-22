const fs = require('fs');
require('dotenv').config();

console.log('🚀 Starting import of all projects to Render Strapi...');

const LOCAL_STRAPI_URL = 'http://localhost:1337';
const RENDER_URL = 'https://line21-cms.onrender.com';
const API_TOKEN = process.env.RENDER_API_TOKEN;

// Fetch all projects from local Strapi
async function fetchLocalProjects() {
  try {
    console.log('📥 Fetching projects from local Strapi...');
    const response = await fetch(`${LOCAL_STRAPI_URL}/api/projects?populate=*`);
    
    if (!response.ok) {
      throw new Error(`Local Strapi error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Found ${data.data?.length || 0} projects in local Strapi`);
    return data.data || [];
  } catch (error) {
    console.error('❌ Error fetching from local Strapi:', error.message);
    console.log('💡 Make sure your local Strapi is running: npm run develop');
    return [];
  }
}

// Import a single project to Render
async function importProjectToRender(project) {
  try {
    // Prepare project data for Render (remove Strapi-specific fields)
    const projectData = {
      data: {
        title: project.title,
        slug: project.slug,
        description: project.description,
        category: project.category,
        client: project.client,
        year: project.year,
        role: project.role,
        shortDescription: project.shortDescription,
        challenge: project.challenge,
        solution: project.solution,
        featured: project.featured,
        projectIcon: project.projectIcon,
        featuredImagesTitle: project.featuredImagesTitle,
        featuredImagesDescription: project.featuredImagesDescription,
        shortFormVideosTitle: project.shortFormVideosTitle,
        longFormVideosTitle: project.longFormVideosTitle,
        publishedAt: project.publishedAt || new Date().toISOString()
      }
    };

    console.log(`📝 Importing project: ${project.title}`);
    
    const response = await fetch(`${RENDER_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Successfully imported: ${project.title} (ID: ${result.data.id})`);
      return true;
    } else {
      const error = await response.text();
      console.error(`❌ Failed to import ${project.title}:`, response.status, error);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error importing ${project.title}:`, error.message);
    return false;
  }
}

// Import all projects
async function importAllProjects() {
  try {
    // Fetch projects from local Strapi
    const localProjects = await fetchLocalProjects();
    
    if (localProjects.length === 0) {
      console.log('❌ No projects found in local Strapi');
      return;
    }
    
    console.log(`🔄 Starting import of ${localProjects.length} projects...`);
    
    let successCount = 0;
    let failCount = 0;
    
    // Import each project
    for (const project of localProjects) {
      const success = await importProjectToRender(project);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} projects`);
    console.log(`❌ Failed to import: ${failCount} projects`);
    console.log(`🌐 Total projects in Render: ${successCount + failCount}`);
    
    // Test final result
    console.log('\n🧪 Testing final result...');
    const testResponse = await fetch(`${RENDER_URL}/api/projects?populate=*`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log(`📊 Total projects now in Render: ${testData.data?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Import process failed:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🌐 Local Strapi URL:', LOCAL_STRAPI_URL);
  console.log('🌐 Render Strapi URL:', RENDER_URL);
  console.log('');
  
  await importAllProjects();
}

main().catch(console.error); 