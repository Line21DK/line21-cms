#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting simple build process...');

try {
  // Set memory limit
  process.env.NODE_OPTIONS = '--max-old-space-size=256';
  
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
  }
  
  // Build with reduced memory usage
  console.log('🔨 Building Strapi with reduced memory...');
  execSync('strapi build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=256' }
  });
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 