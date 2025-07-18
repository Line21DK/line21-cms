// Script til at opdatere SEO-felter for alle projekter
// Kør dette i Strapi console med: node update-seo-console.js

async function updateSEOFields() {
  try {
    console.log('🔍 Henter alle projekter...');
    
    // Get all projects
    const projects = await strapi.entityService.findMany('api::project.project', {
      populate: '*'
    });
    
    console.log(`📊 Fandt ${projects.length} projekter`);
    
    // Update each project with SEO data
    for (const project of projects) {
      console.log(`\n🔄 Opdaterer projekt: ${project.title} (ID: ${project.id})`);
      
      // Create SEO data based on project content
      const seoData = {
        metaTitle: project.title,
        metaDescription: project.shortDescription || 
          (typeof project.description === 'string' ? project.description : 'Video production project'),
        keywords: `${project.category}, ${project.client}, video production, ${project.title.toLowerCase()}`
      };
      
      console.log('📝 SEO data:', seoData);
      
      // Update the project with SEO data
      await strapi.entityService.update('api::project.project', project.id, {
        data: {
          seo: seoData
        }
      });
      
      console.log(`✅ Opdateret SEO for: ${project.title}`);
    }
    
    console.log('\n🎉 Alle projekter opdateret succesfuldt!');
    
  } catch (error) {
    console.error('❌ Fejl ved opdatering af SEO-felter:', error);
  }
}

// Run the function
updateSEOFields(); 