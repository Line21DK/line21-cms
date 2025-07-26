const knex = require('knex');

// Database konfiguration
const dbConfig = {
  client: 'postgres',
  connection: 'postgresql://line21_cms_user:aHsrDk72VNsYKSQDryQkgG4ME1CGFzVn@dpg-d1ujo595pdvs73fngjn0-a.frankfurt-postgres.render.com/line21_cms?sslmode=require&ssl=true',
  ssl: { rejectUnauthorized: false }
};

async function testThumbnailUrl() {
  const db = knex(dbConfig);

  try {
    console.log('🧪 Tester thumbnailUrl feltet...');

    // Først se hvad der er i SpeakerBee projektet
    const speakerBee = await db('projects')
      .select('id', 'title', 'thumbnail_url')
      .where('id', 102)
      .first();

    console.log('📋 SpeakerBee før opdatering:', speakerBee);

    // Opdater med en test thumbnail URL
    const testThumbnailUrl = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';
    
    await db('projects')
      .where('id', 102)
      .update({ 
        thumbnail_url: testThumbnailUrl,
        updated_at: new Date()
      });

    console.log('✅ Opdateret SpeakerBee med test thumbnail URL');

    // Tjek resultatet
    const updatedSpeakerBee = await db('projects')
      .select('id', 'title', 'thumbnail_url')
      .where('id', 102)
      .first();

    console.log('📋 SpeakerBee efter opdatering:', updatedSpeakerBee);

    // Test alle projekter
    const allProjects = await db('projects')
      .select('id', 'title', 'thumbnail_url')
      .limit(5);

    console.log('📋 Alle projekter (top 5):', allProjects);

  } catch (error) {
    console.error('❌ Fejl:', error.message);
  } finally {
    await db.destroy();
  }
}

testThumbnailUrl(); 