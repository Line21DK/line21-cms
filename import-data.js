const fs = require('fs');
const path = require('path');

// Konfiguration
const sourceDbPath = path.join(__dirname, '..', 'cms-kopi', '.tmp', 'data.db');
const targetDbPath = path.join(__dirname, '.tmp', 'data.db');

console.log('🚀 Starter import af data fra cms-kopi...');

// Tjek om kilde-databasen eksisterer
if (!fs.existsSync(sourceDbPath)) {
  console.error('❌ Kilde-database ikke fundet:', sourceDbPath);
  process.exit(1);
}

// Kopier databasen
try {
  console.log('📋 Kopierer database...');
  fs.copyFileSync(sourceDbPath, targetDbPath);
  console.log('✅ Database kopieret succesfuldt!');
} catch (error) {
  console.error('❌ Fejl ved kopiering af database:', error.message);
  process.exit(1);
}

console.log('🎉 Import fuldført! Strapi skal nu genstartes for at indlæse dataene.');
console.log('💡 Kør: npm run develop'); 