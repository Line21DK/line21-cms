#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Farver til console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`\n${colors.cyan}${step}${colors.reset} ${message}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️ ${message}${colors.reset}`);
}

// Hovedfunktion
async function setupDirectus() {
  try {
    log('🎯 Line21 Directus Setup Guide', 'bright');
    log('==============================', 'bright');
    
    // 1. Tjek Docker
    logStep('1', 'Tjekker Docker installation...');
    
    try {
      execSync('docker --version', { stdio: 'pipe' });
      logSuccess('Docker er installeret');
    } catch (error) {
      logError('Docker er ikke installeret eller kører ikke');
      logInfo('Download Docker fra: https://www.docker.com/products/docker-desktop');
      process.exit(1);
    }
    
    // 2. Tjek Docker Compose
    logStep('2', 'Tjekker Docker Compose...');
    
    try {
      execSync('docker-compose --version', { stdio: 'pipe' });
      logSuccess('Docker Compose er tilgængelig');
    } catch (error) {
      logError('Docker Compose er ikke tilgængelig');
      process.exit(1);
    }
    
    // 3. Tjek om Directus allerede kører
    logStep('3', 'Tjekker om Directus allerede kører...');
    
    try {
      const response = execSync('curl -s http://localhost:8055', { stdio: 'pipe' });
      if (response.toString().includes('Directus')) {
        logWarning('Directus kører allerede på port 8055');
        logInfo('Du kan stoppe det med: docker-compose down');
      }
    } catch (error) {
      logInfo('Directus kører ikke endnu');
    }
    
    // 4. Start Directus
    logStep('4', 'Starter Directus...');
    
    try {
      logInfo('Starter Directus med Docker Compose...');
      execSync('docker-compose up -d', { stdio: 'inherit' });
      logSuccess('Directus er startet');
    } catch (error) {
      logError('Kunne ikke starte Directus');
      process.exit(1);
    }
    
    // 5. Vent på at Directus er klar
    logStep('5', 'Venter på at Directus er klar...');
    
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      try {
        const response = execSync('curl -s http://localhost:8055', { stdio: 'pipe' });
        if (response.toString().includes('Directus')) {
          logSuccess('Directus er klar!');
          break;
        }
      } catch (error) {
        // Ignorer fejl og prøv igen
      }
      
      attempts++;
      logInfo(`Venter... (${attempts}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    if (attempts >= maxAttempts) {
      logError('Directus blev ikke klar i tide');
      process.exit(1);
    }
    
    // 6. Vis kommandoer
    logStep('6', 'Setup komplet! Her er kommandoerne du skal bruge:');
    
    console.log('\n' + '='.repeat(50));
    log('🚀 START DIRECTUS:', 'bright');
    log('docker-compose up -d', 'cyan');
    
    log('\n🛑 STOP DIRECTUS:', 'bright');
    log('docker-compose down', 'cyan');
    
    log('\n📊 IMPORTER PROJEKTER (Sikker):', 'bright');
    log('node import-projects.js', 'cyan');
    
    log('\n🔍 TEST IMPORT (DRY RUN):', 'bright');
    log('DRY_RUN=true node import-projects.js', 'cyan');
    
    log('\n🔄 FORCE UPDATE EKSISTERENDE:', 'bright');
    log('FORCE_UPDATE=true node import-projects.js', 'cyan');
    
    log('\n⚙️ KONFIGURATION:', 'bright');
    log('Sæt disse miljøvariabler:', 'yellow');
    log('DIRECTUS_URL=http://localhost:8055', 'cyan');
    log('DIRECTUS_TOKEN=din-api-token-her', 'cyan');
    
    console.log('\n' + '='.repeat(50));
    
    log('\n💡 Tips:', 'bright');
    log('• Gå til http://localhost:8055/admin for at oprette en admin bruger', 'info');
    log('• Generer en API token i Directus admin panel', 'info');
    log('• Sæt DIRECTUS_TOKEN i din .env fil', 'info');
    log('• Kør derefter import scriptet', 'info');
    
    log('\n🔗 NYTTIGE LINKS:', 'bright');
    log('• Directus Admin: http://localhost:8055/admin', 'cyan');
    log('• Directus API: http://localhost:8055', 'cyan');
    log('• Directus Docs: https://docs.directus.io', 'cyan');
    
  } catch (error) {
    logError(`Setup fejlede: ${error.message}`);
    process.exit(1);
  }
}

// Kør setup hvis scriptet kaldes direkte
if (require.main === module) {
  setupDirectus();
}

module.exports = { setupDirectus }; 