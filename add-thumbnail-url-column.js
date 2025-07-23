const knex = require('knex');

// Database konfiguration for lokal database
const dbConfig = {
  client: 'postgres',
  connection: process.env.DATABASE_URL || 'postgresql://line21_cms_user:aHsrDk72VNsYKSQDryQkgG4ME1CGFzVn@dpg-d1ujo595pdvs73fngjn0-a.frankfurt-postgres.render.com/line21_cms?sslmode=require&ssl=true',
  ssl: { rejectUnauthorized: false }
};

async function addThumbnailUrlColumn() {
  const db = knex(dbConfig);
  
  try {
    console.log('🔄 Tilføjer thumbnail_url kolonne til lokal database...');
    
    // Tjek om kolonnen allerede eksisterer
    const hasColumn = await db.schema.hasColumn('projects', 'thumbnail_url');
    
    if (hasColumn) {
      console.log('✅ thumbnail_url kolonne eksisterer allerede lokalt!');
    } else {
      // Tilføj kolonnen med snake_case navn
      await db.schema.alterTable('projects', (table) => {
        table.string('thumbnail_url').nullable();
      });
      console.log('✅ thumbnail_url kolonne tilføjet succesfuldt lokalt!');
    }
    
    // Test at kolonnen er tilgængelig
    const result = await db('projects').select('id', 'title', 'thumbnail_url').limit(1);
    console.log('📋 Test resultat fra lokal database:', result);
    
  } catch (error) {
    console.error('❌ Fejl ved tilføjelse af kolonne lokalt:', error.message);
  } finally {
    await db.destroy();
  }
}

addThumbnailUrlColumn(); 