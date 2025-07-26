#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Line21 CMS - Push to GitHub');
console.log('==============================');

try {
  // Tjek om vi er i git repository
  const gitDir = path.join(process.cwd(), '.git');
  if (!fs.existsSync(gitDir)) {
    console.error('❌ Fejl: Ikke i et git repository');
    process.exit(1);
  }

  // Tjek git status
  console.log('📊 Tjekker git status...');
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  
  if (!status.trim()) {
    console.log('✅ Ingen ændringer at pushe');
    return;
  }

  console.log('📝 Ændringer fundet:');
  console.log(status);

  // Spørg om commit besked
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('💬 Commit besked (eller tryk Enter for standard): ', (commitMessage) => {
    rl.close();
    
    const message = commitMessage.trim() || 'Update Line21 CMS';
    
    try {
      // Add alle ændringer
      console.log('📦 Tilføjer ændringer...');
      execSync('git add .', { stdio: 'inherit' });
      
      // Commit
      console.log(`💾 Committer med besked: "${message}"`);
      execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
      
      // Push
      console.log('🚀 Pusher til GitHub...');
      execSync('git push origin master', { stdio: 'inherit' });
      
      console.log('✅ Succesfuldt pushet til GitHub!');
      console.log('🌐 Render vil automatisk deploye den nye version');
      
    } catch (error) {
      console.error('❌ Fejl under push:', error.message);
      process.exit(1);
    }
  });

} catch (error) {
  console.error('❌ Fejl:', error.message);
  process.exit(1);
} 