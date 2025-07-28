#!/usr/bin/env node

require('dotenv').config();
const { Client } = require('pg');

const config = {
  host: process.env.DB_HOST || 'dpg-cp8j8v6n7f5s73f8v8q0-a.oregon-postgres.render.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || 'directus',
  user: process.env.DB_USER || 'directus',
  password: process.env.DB_PASSWORD || 'tZNc7UGQ8jz6Gkm3uAlVu8LPhcRnbdaY',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

console.log('🔍 Testing database connection...');
console.log('Host:', config.host);
console.log('Database:', config.database);
console.log('User:', config.user);
console.log('SSL:', config.ssl);

const client = new Client(config);

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Database connection successful!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database query successful:', result.rows[0]);
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

testConnection(); 