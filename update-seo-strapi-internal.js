const strapi = require('@strapi/strapi');

async function updateSEOFields() {
  try {
    // Start Strapi
    await strapi().load();
    
    console.log('Strapi loaded successfully');
    
    // Get all projects
    const projects = await strapi.entityService.findMany('api::project.project', {
      populate: '*'
    });
    
    console.log(`Found ${projects.length} projects`);
    
    // Update each project with SEO data
    for (const project of projects) {
      console.log(`Updating project: ${project.title} (ID: ${project.id})`);
      
      const seoData = {
        metaTitle: project.title,
        metaDescription: project.shortDescription || project.description,
        keywords: `${project.category}, ${project.client}, video production, ${project.title.toLowerCase()}`
      };
      
      // Update the project with SEO data
      await strapi.entityService.update('api::project.project', project.id, {
        data: {
          seo: seoData
        }
      });
      
      console.log(`✅ Updated SEO for: ${project.title}`);
    }
    
    console.log('🎉 All projects updated successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error updating SEO fields:', error);
    process.exit(1);
  }
}

updateSEOFields(); 