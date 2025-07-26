const axios = require('axios');

const RENDER_API_KEY = 'rnd_57aeXcQVfzj6CScdjvLS0HU8bA16';

async function runRenderCommand() {
  try {
    console.log('🚀 Kører kommando på Render via API...');
    
    // Først skal vi finde service ID'et
    const servicesResponse = await axios.get('https://api.render.com/v1/services', {
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📋 Services fundet:', servicesResponse.data.length);
    
    if (servicesResponse.data && servicesResponse.data.length > 0) {
      // API returnerer et array med objekter der har en 'service' property
      const services = servicesResponse.data.map(item => item.service);
      
      console.log('📋 Services:', services.map(s => ({ 
        id: s.id, 
        name: s.name, 
        type: s.type,
        url: s.serviceDetails?.url
      })));
      
      // Find Strapi service
      const strapiService = services.find(s => 
        s.name && s.name.includes('line21-cms')
      );
      
      if (strapiService) {
        console.log('✅ Fandt service:', strapiService.name, 'ID:', strapiService.id);
        console.log('🌐 URL:', strapiService.serviceDetails?.url);
        
        // Nu kan vi køre kommandoer på denne service
        console.log('🚀 Prøver at køre database migration...');
        
        // Kør database migration direkte
        const migrationResult = await runDatabaseMigration(strapiService.id);
        console.log('📋 Migration resultat:', migrationResult);
        
      } else {
        console.log('❌ Kunne ikke finde Strapi service');
      }
    } else {
      console.log('❌ Ingen services fundet');
    }
    
  } catch (error) {
    console.error('❌ Fejl:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

async function runDatabaseMigration(serviceId) {
  try {
    // Kør vores database script direkte på Render's database
    const dbConfig = {
      client: 'postgres',
      connection: 'postgresql://line21_cms_user:aHsrDk72VNsYKSQDryQkgG4ME1CGFzVn@dpg-d1ujo595pdvs73fngjn0-a.frankfurt-postgres.render.com/line21_cms?sslmode=require&ssl=true',
      ssl: { rejectUnauthorized: false }
    };
    
    const knex = require('knex');
    const db = knex(dbConfig);
    
    console.log('🔄 Tjekker thumbnail_url kolonne på Render...');
    
    // Tjek om kolonnen eksisterer
    const hasColumn = await db.schema.hasColumn('projects', 'thumbnail_url');
    
    if (hasColumn) {
      console.log('✅ thumbnail_url kolonne eksisterer allerede på Render!');
    } else {
      // Tilføj kolonnen
      await db.schema.alterTable('projects', (table) => {
        table.string('thumbnail_url').nullable();
      });
      console.log('✅ thumbnail_url kolonne tilføjet til Render!');
    }
    
    // Test at kolonnen er tilgængelig
    const result = await db('projects').select('id', 'title', 'thumbnail_url').limit(1);
    console.log('📋 Test resultat fra Render:', result);
    
    await db.destroy();
    return 'Success';
    
  } catch (error) {
    console.error('❌ Database fejl:', error.message);
    return 'Error: ' + error.message;
  }
}

runRenderCommand(); 