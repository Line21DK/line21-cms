const knex = require('knex');

// Database konfiguration
const dbConfig = {
  client: 'postgres',
  connection: process.env.DATABASE_URL || 'postgresql://line21_cms_user:aHsrDk72VNsYKSQDryQkgG4ME1CGFzVn@dpg-d1ujo595pdvs73fngjn0-a.frankfurt-postgres.render.com/line21_cms?sslmode=require&ssl=true',
  ssl: { rejectUnauthorized: false }
};

async function bootstrapDatabase() {
  const db = knex(dbConfig);
  
  try {
    console.log('🔄 Bootstrap: Tjekker thumbnail_url kolonne...');
    
    // Tjek om kolonnen eksisterer
    const hasColumn = await db.schema.hasColumn('projects', 'thumbnail_url');
    
    if (!hasColumn) {
      console.log('📝 Bootstrap: Tilføjer thumbnail_url kolonne...');
      await db.schema.alterTable('projects', (table) => {
        table.string('thumbnail_url').nullable();
      });
      console.log('✅ Bootstrap: thumbnail_url kolonne tilføjet!');
    } else {
      console.log('✅ Bootstrap: thumbnail_url kolonne eksisterer allerede!');
    }
    
  } catch (error) {
    console.error('❌ Bootstrap fejl:', error.message);
  } finally {
    await db.destroy();
  }
}

// Kør bootstrap når scriptet importeres
bootstrapDatabase();

module.exports = bootstrapDatabase; 