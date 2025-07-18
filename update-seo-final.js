const { execSync } = require('child_process');
const fs = require('fs');

// Script til at opdatere SEO-felter via Strapi console
const scriptContent = `
(async () => {
  try {
    console.log('🔍 Henter alle projekter...');
    
    const projects = await strapi.entityService.findMany('api::project.project', {
      populate: '*'
    });
    
    console.log(\`📊 Fandt \${projects.length} projekter\`);
    
    for (const project of projects) {
      console.log(\`\\n🔄 Opdaterer: \${project.title}\`);
      
      const seoData = {
        metaTitle: project.title,
        metaDescription: project.shortDescription || 'Video production project',
        keywords: \`\${project.category}, \${project.client}, video production, \${project.title.toLowerCase()}\`
      };
      
      await strapi.entityService.update('api::project.project', project.id, {
        data: { seo: seoData }
      });
      
      console.log(\`✅ Opdateret: \${project.title}\`);
    }
    
    console.log('\\n🎉 Alle projekter opdateret!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fejl:', error);
    process.exit(1);
  }
})();
`;

// Gem scriptet
fs.writeFileSync('temp-seo-script.js', scriptContent);

console.log('📝 Script gemt som temp-seo-script.js');
console.log('🚀 Kør nu: .load temp-seo-script.js i Strapi console'); 