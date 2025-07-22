const fs = require('fs');

console.log('🚀 Starting complete import of all projects with relations to Render Strapi...');

const LOCAL_STRAPI_URL = 'http://localhost:1337';
const RENDER_URL = 'https://line21-cms.onrender.com';
const API_TOKEN = '5df9c7907dd01eca2395a5592863e21cf8607619c90fe6a1893c43ca1023396f24448b7eba2d5d1c34ac12d06c25be7bfd870469b4bff01c107b36cf55737b22c9ccbced983848ef8fc794eb1b19664ce8f595dbd11a34de461c0ce3a03cbbe092fa76aa0c7cbd46ea6e142a48a759edbcff48735885603c29b68384609802ae';

// Fetch all projects from local Strapi with all relations
async function fetchLocalProjects() {
  try {
    console.log('📥 Fetching all projects from local Strapi...');
    const response = await fetch(`${LOCAL_STRAPI_URL}/api/projects?populate=*`);
    
    if (!response.ok) {
      throw new Error(`Local Strapi error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Found ${data.data.length} projects in local Strapi`);
    return data.data;
  } catch (error) {
    console.error('❌ Error fetching local projects:', error.message);
    throw error;
  }
}

// Import a single project with all its relations
async function importProject(project) {
  try {
    console.log(`\n📤 Importing project: ${project.title}`);
    
    // Prepare project data without relations first
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
        startDate: project.startDate,
        endDate: project.endDate
      }
    };

    // Create the project first
    const createResponse = await fetch(`${RENDER_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify(projectData)
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error(`❌ Failed to create project ${project.title}:`, createResponse.status, errorText);
      return false;
    }

    const createdProject = await createResponse.json();
    console.log(`✅ Created project: ${project.title} (ID: ${createdProject.data.id})`);

    // Now handle relations
    const projectId = createdProject.data.id;

    // Import thumbnail if exists
    if (project.thumbnail) {
      console.log(`  📷 Importing thumbnail for ${project.title}`);
      await importThumbnail(projectId, project.thumbnail);
    }

    // Import featured video if exists
    if (project.featuredVideo) {
      console.log(`  🎥 Importing featured video for ${project.title}`);
      await importFeaturedVideo(projectId, project.featuredVideo);
    }

    // Import featured images if exists
    if (project.featuredImages && project.featuredImages.length > 0) {
      console.log(`  🖼️ Importing ${project.featuredImages.length} featured images for ${project.title}`);
      await importFeaturedImages(projectId, project.featuredImages);
    }

    // Import short form videos if exists
    if (project.shortFormVideos && project.shortFormVideos.length > 0) {
      console.log(`  🎬 Importing ${project.shortFormVideos.length} short form videos for ${project.title}`);
      await importShortFormVideos(projectId, project.shortFormVideos);
    }

    // Import long form videos if exists
    if (project.longFormVideos && project.longFormVideos.length > 0) {
      console.log(`  🎬 Importing ${project.longFormVideos.length} long form videos for ${project.title}`);
      await importLongFormVideos(projectId, project.longFormVideos);
    }

    // Import content strategy if exists
    if (project.contentStrategy && project.contentStrategy.length > 0) {
      console.log(`  📋 Importing ${project.contentStrategy.length} content strategy items for ${project.title}`);
      await importContentStrategy(projectId, project.contentStrategy);
    }

    // Import production techniques if exists
    if (project.productionTechniques && project.productionTechniques.length > 0) {
      console.log(`  🛠️ Importing ${project.productionTechniques.length} production techniques for ${project.title}`);
      await importProductionTechniques(projectId, project.productionTechniques);
    }

    // Import results if exists
    if (project.results && project.results.length > 0) {
      console.log(`  📊 Importing ${project.results.length} results for ${project.title}`);
      await importResults(projectId, project.results);
    }

    // Import links if exists
    if (project.links && project.links.length > 0) {
      console.log(`  🔗 Importing ${project.links.length} links for ${project.title}`);
      await importLinks(projectId, project.links);
    }

    // Import SEO if exists
    if (project.seo) {
      console.log(`  🔍 Importing SEO for ${project.title}`);
      await importSEO(projectId, project.seo);
    }

    return true;
  } catch (error) {
    console.error(`❌ Error importing project ${project.title}:`, error.message);
    return false;
  }
}

// Helper functions for importing relations
async function importThumbnail(projectId, thumbnail) {
  try {
    const response = await fetch(`${RENDER_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          thumbnail: thumbnail.id
        }
      })
    });
    
    if (!response.ok) {
      console.error(`  ❌ Failed to import thumbnail: ${response.status}`);
    } else {
      console.log(`  ✅ Thumbnail imported successfully`);
    }
  } catch (error) {
    console.error(`  ❌ Error importing thumbnail:`, error.message);
  }
}

async function importFeaturedVideo(projectId, featuredVideo) {
  try {
    const response = await fetch(`${RENDER_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          featuredVideo: featuredVideo.id
        }
      })
    });
    
    if (!response.ok) {
      console.error(`  ❌ Failed to import featured video: ${response.status}`);
    } else {
      console.log(`  ✅ Featured video imported successfully`);
    }
  } catch (error) {
    console.error(`  ❌ Error importing featured video:`, error.message);
  }
}

async function importFeaturedImages(projectId, featuredImages) {
  try {
    const imageIds = featuredImages.map(img => img.id);
    const response = await fetch(`${RENDER_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          featuredImages: imageIds
        }
      })
    });
    
    if (!response.ok) {
      console.error(`  ❌ Failed to import featured images: ${response.status}`);
    } else {
      console.log(`  ✅ Featured images imported successfully`);
    }
  } catch (error) {
    console.error(`  ❌ Error importing featured images:`, error.message);
  }
}

async function importShortFormVideos(projectId, shortFormVideos) {
  try {
    for (const video of shortFormVideos) {
      const response = await fetch(`${RENDER_URL}/api/short-form-videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          data: {
            title: video.title,
            url: video.url,
            description: video.description,
            sectionTitle: video.sectionTitle,
            project: projectId
          }
        })
      });
      
      if (!response.ok) {
        console.error(`  ❌ Failed to import short form video ${video.title}: ${response.status}`);
      } else {
        console.log(`  ✅ Short form video "${video.title}" imported successfully`);
      }
    }
  } catch (error) {
    console.error(`  ❌ Error importing short form videos:`, error.message);
  }
}

async function importLongFormVideos(projectId, longFormVideos) {
  try {
    for (const video of longFormVideos) {
      const response = await fetch(`${RENDER_URL}/api/long-form-videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          data: {
            title: video.title,
            url: video.url,
            description: video.description,
            sectionTitle: video.sectionTitle,
            project: projectId
          }
        })
      });
      
      if (!response.ok) {
        console.error(`  ❌ Failed to import long form video ${video.title}: ${response.status}`);
      } else {
        console.log(`  ✅ Long form video "${video.title}" imported successfully`);
      }
    }
  } catch (error) {
    console.error(`  ❌ Error importing long form videos:`, error.message);
  }
}

async function importContentStrategy(projectId, contentStrategy) {
  try {
    for (const item of contentStrategy) {
      const response = await fetch(`${RENDER_URL}/api/content-strategies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          data: {
            title: item.title,
            description: item.description,
            project: projectId
          }
        })
      });
      
      if (!response.ok) {
        console.error(`  ❌ Failed to import content strategy ${item.title}: ${response.status}`);
      } else {
        console.log(`  ✅ Content strategy "${item.title}" imported successfully`);
      }
    }
  } catch (error) {
    console.error(`  ❌ Error importing content strategy:`, error.message);
  }
}

async function importProductionTechniques(projectId, productionTechniques) {
  try {
    for (const technique of productionTechniques) {
      const response = await fetch(`${RENDER_URL}/api/production-techniques`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          data: {
            title: technique.title,
            description: technique.description,
            project: projectId
          }
        })
      });
      
      if (!response.ok) {
        console.error(`  ❌ Failed to import production technique ${technique.title}: ${response.status}`);
      } else {
        console.log(`  ✅ Production technique "${technique.title}" imported successfully`);
      }
    }
  } catch (error) {
    console.error(`  ❌ Error importing production techniques:`, error.message);
  }
}

async function importResults(projectId, results) {
  try {
    for (const result of results) {
      const response = await fetch(`${RENDER_URL}/api/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          data: {
            title: result.title,
            description: result.description,
            value: result.value,
            project: projectId
          }
        })
      });
      
      if (!response.ok) {
        console.error(`  ❌ Failed to import result ${result.title}: ${response.status}`);
      } else {
        console.log(`  ✅ Result "${result.title}" imported successfully`);
      }
    }
  } catch (error) {
    console.error(`  ❌ Error importing results:`, error.message);
  }
}

async function importLinks(projectId, links) {
  try {
    for (const link of links) {
      const response = await fetch(`${RENDER_URL}/api/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          data: {
            title: link.title,
            url: link.url,
            description: link.description,
            project: projectId
          }
        })
      });
      
      if (!response.ok) {
        console.error(`  ❌ Failed to import link ${link.title}: ${response.status}`);
      } else {
        console.log(`  ✅ Link "${link.title}" imported successfully`);
      }
    }
  } catch (error) {
    console.error(`  ❌ Error importing links:`, error.message);
  }
}

async function importSEO(projectId, seo) {
  try {
    const response = await fetch(`${RENDER_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          seo: seo.id
        }
      })
    });
    
    if (!response.ok) {
      console.error(`  ❌ Failed to import SEO: ${response.status}`);
    } else {
      console.log(`  ✅ SEO imported successfully`);
    }
  } catch (error) {
    console.error(`  ❌ Error importing SEO:`, error.message);
  }
}

// Main import function
async function importAllProjects() {
  try {
    console.log('🚀 Starting complete project import...');
    
    // First, delete existing projects on Render
    console.log('🗑️ Cleaning existing projects on Render...');
    const existingProjectsResponse = await fetch(`${RENDER_URL}/api/projects`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    if (existingProjectsResponse.ok) {
      const existingProjects = await existingProjectsResponse.json();
      for (const project of existingProjects.data) {
        await fetch(`${RENDER_URL}/api/projects/${project.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`
          }
        });
      }
      console.log(`🗑️ Deleted ${existingProjects.data.length} existing projects`);
    }

    // Fetch projects from local Strapi
    const localProjects = await fetchLocalProjects();
    
    // Import each project
    let successCount = 0;
    let failureCount = 0;
    
    for (const project of localProjects) {
      const success = await importProject(project);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
    }
    
    console.log(`\n🎉 Import completed!`);
    console.log(`✅ Successfully imported: ${successCount} projects`);
    console.log(`❌ Failed to import: ${failureCount} projects`);
    
    // Test the final result
    console.log('\n🧪 Testing final result...');
    const testResponse = await fetch(`${RENDER_URL}/api/projects?populate=*`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log(`✅ Render now has ${testData.data.length} projects`);
      
      // Check for featured projects
      const featuredProjects = testData.data.filter(p => p.featured);
      console.log(`✅ Featured projects: ${featuredProjects.length}`);
      
      // Check for projects with thumbnails
      const projectsWithThumbnails = testData.data.filter(p => p.thumbnail);
      console.log(`✅ Projects with thumbnails: ${projectsWithThumbnails.length}`);
      
      // Check for projects with videos
      const projectsWithVideos = testData.data.filter(p => 
        (p.shortFormVideos && p.shortFormVideos.length > 0) || 
        (p.longFormVideos && p.longFormVideos.length > 0)
      );
      console.log(`✅ Projects with videos: ${projectsWithVideos.length}`);
      
    } else {
      console.error('❌ Failed to test final result');
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  }
}

// Run the import
importAllProjects(); 