#!/usr/bin/env node

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

console.log('\n' + '='.repeat(60));
log('🎯 LINE21 DIRECTUS - MODERN CMS SYSTEM', 'bright');
log('==========================================', 'bright');
console.log('='.repeat(60));

log('\n🚀 HURTIG START (4 trin):', 'bright');

log('\n1️⃣  Start Docker Desktop:', 'cyan');
log('   Åbn Docker Desktop applikationen', 'yellow');

log('\n2️⃣  Kør setup:', 'cyan');
log('   npm run setup', 'yellow');

log('\n3️⃣  Start Directus:', 'cyan');
log('   npm start', 'yellow');

log('\n4️⃣  Importer projekter:', 'cyan');
log('   npm run import:dry    (test først)', 'yellow');
log('   npm run import        (rigtig import)', 'yellow');

console.log('\n' + '='.repeat(60));

log('\n📋 ALLE KOMMANDOER:', 'bright');

log('\n🔧 Setup & Konfiguration:', 'cyan');
log('   npm run setup         - Setup guide og tjek', 'yellow');
log('   npm run status        - Tjek Directus status', 'yellow');

log('\n🚀 Docker Kommandoer:', 'cyan');
log('   npm start             - Start Directus', 'yellow');
log('   npm run stop          - Stop Directus', 'yellow');
log('   npm run restart       - Genstart Directus', 'yellow');
log('   npm run logs          - Se logs', 'yellow');

log('\n📊 Import Projekter:', 'cyan');
log('   npm run import        - Sikker import (kun nye)', 'yellow');
log('   npm run import:dry    - Test import (DRY RUN)', 'yellow');
log('   npm run import:force  - Force update alle', 'yellow');
log('   npm run import:test   - Test force update', 'yellow');

console.log('\n' + '='.repeat(60));

log('\n💡 VIGTIGT:', 'bright');
log('• Start Docker Desktop først', 'green');
log('• Scriptet sletter ALDRIG eksisterende data', 'green');
log('• Brug altid DRY RUN først til at teste', 'yellow');
log('• Se README.md for detaljer', 'blue');

log('\n🔗 NYTTIGE LINKS:', 'bright');
log('• Directus Admin: http://localhost:8055/admin', 'cyan');
log('• Directus API: http://localhost:8055', 'cyan');
log('• Docker Desktop: https://www.docker.com/products/docker-desktop', 'cyan');

console.log('\n' + '='.repeat(60));
log('🎉 Klar til at starte!', 'green');
console.log('='.repeat(60) + '\n'); 