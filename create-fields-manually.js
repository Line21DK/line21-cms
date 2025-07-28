#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

const CONFIG = {
  DIRECTUS_URL: process.env.DIRECTUS_URL || 'http://localhost:8055',
  DIRECTUS_TOKEN: process.env.DIRECTUS_TOKEN
};

const client = axios.create({
  baseURL: CONFIG.DIRECTUS_URL,
  headers: {
    'Authorization': `Bearer ${CONFIG.DIRECTUS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

const fields = [
  { field: 'client_name', type: 'string', meta: { interface: 'input', display: 'raw', required: false }, schema: { data_type: 'varchar', is_nullable: true } },
  { field: 'project_category', type: 'string', meta: { interface: 'select-dropdown', display: 'raw', required: false }, schema: { data_type: 'varchar', is_nullable: true } },
  { field: 'project_role', type: 'string', meta: { interface: 'input', display: 'raw', required: false }, schema: { data_type: 'varchar', is_nullable: true } },
  { field: 'project_year', type: 'integer', meta: { interface: 'input', display: 'raw', required: false }, schema: { data_type: 'integer', is_nullable: true } },
  { field: 'project_description', type: 'text', meta: { interface: 'input-multiline', display: 'raw', required: false }, schema: { data_type: 'text', is_nullable: true } },
  { field: 'project_short_description', type: 'text', meta: { interface: 'input-multiline', display: 'raw', required: false }, schema: { data_type: 'text', is_nullable: true } },
  { field: 'project_challenge', type: 'text', meta: { interface: 'input-multiline', display: 'raw', required: false }, schema: { data_type: 'text', is_nullable: true } },
  { field: 'project_solution', type: 'text', meta: { interface: 'input-multiline', display: 'raw', required: false }, schema: { data_type: 'text', is_nullable: true } },
  { field: 'project_featured', type: 'boolean', meta: { interface: 'boolean', display: 'boolean', required: false }, schema: { data_type: 'boolean', is_nullable: true } },
  { field: 'project_thumbnail', type: 'uuid', meta: { interface: 'file', display: 'file', required: false }, schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' } },
  { field: 'project_thumbnail_url', type: 'string', meta: { interface: 'input', display: 'raw', required: false }, schema: { data_type: 'varchar', is_nullable: true } },
  { field: 'project_thumbnail_yt', type: 'string', meta: { interface: 'input', display: 'raw', required: false, note: 'YouTube thumbnail URL (auto-generated from video ID)' }, schema: { data_type: 'varchar', is_nullable: true } },
  { field: 'project_featured_video', type: 'json', meta: { interface: 'input-code', display_options: { language: 'json' }, required: false }, schema: { data_type: 'json', is_nullable: true } },
  { field: 'project_short_form_videos', type: 'json', meta: { interface: 'input-code', display_options: { language: 'json' }, required: false }, schema: { data_type: 'json', is_nullable: true } },
  { field: 'project_long_form_videos', type: 'json', meta: { interface: 'input-code', display_options: { language: 'json' }, required: false }, schema: { data_type: 'json', is_nullable: true } },
  { field: 'project_content_strategy', type: 'json', meta: { interface: 'input-code', display_options: { language: 'json' }, required: false }, schema: { data_type: 'json', is_nullable: true } },
  { field: 'project_production_techniques', type: 'json', meta: { interface: 'input-code', display_options: { language: 'json' }, required: false }, schema: { data_type: 'json', is_nullable: true } },
  { field: 'project_results', type: 'json', meta: { interface: 'input-code', display_options: { language: 'json' }, required: false }, schema: { data_type: 'json', is_nullable: true } },
  { field: 'project_links', type: 'json', meta: { interface: 'input-code', display_options: { language: 'json' }, required: false }, schema: { data_type: 'json', is_nullable: true } },
  { field: 'project_seo', type: 'json', meta: { interface: 'input-code', display_options: { language: 'json' }, required: false }, schema: { data_type: 'json', is_nullable: true } }
];

async function createField(fieldData) {
  try {
    const response = await client.post('/fields/projects', fieldData);
    console.log(`✅ Felt oprettet: ${fieldData.field}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
      console.log(`⏭️ Felt eksisterer allerede: ${fieldData.field}`);
      return null;
    }
    console.log(`❌ Fejl ved oprettelse af felt ${fieldData.field}: ${error.response?.data?.errors?.[0]?.message || error.message}`);
    return null;
  }
}

async function createAllFields() {
  console.log('🚀 Opretter alle felter manuelt...');
  
  for (const field of fields) {
    await createField(field);
  }
  
  console.log('✅ Alle felter oprettet!');
}

createAllFields().catch(console.error); 