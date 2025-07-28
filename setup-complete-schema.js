#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

// Konfiguration
const CONFIG = {
  DIRECTUS_URL: process.env.DIRECTUS_URL || 'http://localhost:8055',
  DIRECTUS_TOKEN: process.env.DIRECTUS_TOKEN || 'your-api-token-here',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Farver til logging
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
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

class DirectusSchemaSetup {
  constructor() {
    this.client = axios.create({
      baseURL: CONFIG.DIRECTUS_URL,
      headers: {
        'Authorization': `Bearer ${CONFIG.DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async testConnection() {
    try {
      const response = await this.client.get('/collections');
      log('✅ Forbindelse til Directus OK', 'green');
      return true;
    } catch (error) {
      log(`❌ Kunne ikke forbinde til Directus: ${error.message}`, 'red');
      return false;
    }
  }

  async createField(collection, fieldData) {
    try {
      const response = await this.client.post(`/fields/${collection}`, fieldData);
      log(`✅ Felt oprettet: ${fieldData.field}`, 'green');
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
        log(`⏭️ Felt eksisterer allerede: ${fieldData.field}`, 'yellow');
        return null;
      }
      log(`❌ Fejl ved oprettelse af felt ${fieldData.field}: ${error.response?.data?.errors?.[0]?.message || error.message}`, 'red');
      return null;
    }
  }

  async setupProjectsCollection() {
    log('🚀 Opretter komplet Projects collection schema...', 'cyan');

    const fields = [
      // Grundlæggende felter
      {
        collection: 'projects',
        field: 'featured',
        meta: {
          interface: 'boolean',
          display: 'boolean',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 1,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'featured',
          table: 'projects',
          data_type: 'boolean',
          default_value: false,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Vises på forsiden som featured projekt',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'title',
        meta: {
          interface: 'input',
          display: 'raw',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 2,
          width: 'full',
          group: null,
          translation: null,
          required: true
        },
        schema: {
          name: 'title',
          table: 'projects',
          data_type: 'varchar',
          default_value: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Projektets hovedtitel',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'slug',
        meta: {
          interface: 'input',
          display: 'raw',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 3,
          width: 'full',
          group: null,
          translation: null,
          required: true
        },
        schema: {
          name: 'slug',
          table: 'projects',
          data_type: 'varchar',
          default_value: null,
          is_nullable: false,
          is_unique: true,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'URL-slug for projektet',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'client',
        meta: {
          interface: 'input',
          display: 'raw',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 4,
          width: 'full',
          group: null,
          translation: null,
          required: true
        },
        schema: {
          name: 'client',
          table: 'projects',
          data_type: 'varchar',
          default_value: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Klientens navn',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'category',
        meta: {
          interface: 'select-dropdown',
          display: 'labels',
          display_options: {
            choices: [
              { text: 'Creative', value: 'Creative' },
              { text: 'Technology', value: 'Technology' },
              { text: 'Corporate', value: 'Corporate' },
              { text: 'Educational', value: 'Educational' },
              { text: 'Entertainment', value: 'Entertainment' }
            ]
          },
          readonly: false,
          hidden: false,
          sort: 5,
          width: 'full',
          group: null,
          translation: null,
          required: true
        },
        schema: {
          name: 'category',
          table: 'projects',
          data_type: 'varchar',
          default_value: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Projektets kategori',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'project_icon',
        meta: {
          interface: 'select-dropdown',
          display: 'labels',
          display_options: {
            choices: [
              { text: 'Music & Entertainment', value: 'Music & Entertainment' },
              { text: 'Gaming & Technology', value: 'Gaming & Technology' },
              { text: 'Photography & Camera', value: 'Photography & Camera' },
              { text: 'Innovation & Ideas', value: 'Innovation & Ideas' },
              { text: 'Business & Strategy', value: 'Business & Strategy' },
              { text: 'Education & Learning', value: 'Education & Learning' },
              { text: 'Art & Design', value: 'Art & Design' },
              { text: 'Film & Video', value: 'Film & Video' }
            ]
          },
          readonly: false,
          hidden: false,
          sort: 6,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'project_icon',
          table: 'projects',
          data_type: 'varchar',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Ikon der repræsenterer projektet',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'thumbnail',
        meta: {
          interface: 'file',
          display: 'file',
          display_options: {
            template: '{{ $thumbnail }} {{ title }}'
          },
          readonly: false,
          hidden: false,
          sort: 7,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'thumbnail',
          table: 'projects',
          data_type: 'uuid',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: 'directus_files',
          foreign_key_column: 'id',
          comment: 'Hovedbillede for projektet',
          schema: 'public',
          foreign_key_schema: 'public'
        }
      },
      {
        collection: 'projects',
        field: 'thumbnail_url',
        meta: {
          interface: 'input',
          display: 'raw',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 8,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'thumbnail_url',
          table: 'projects',
          data_type: 'varchar',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Ekstern URL til thumbnail-billede (fx fra Simply/CDN)',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'role',
        meta: {
          interface: 'input',
          display: 'raw',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 9,
          width: 'full',
          group: null,
          translation: null,
          required: true
        },
        schema: {
          name: 'role',
          table: 'projects',
          data_type: 'varchar',
          default_value: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Din rolle i projektet',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'year',
        meta: {
          interface: 'input',
          display: 'raw',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 10,
          width: 'full',
          group: null,
          translation: null,
          required: true
        },
        schema: {
          name: 'year',
          table: 'projects',
          data_type: 'integer',
          default_value: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'År projektet blev udført',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'start_date',
        meta: {
          interface: 'datetime',
          display: 'datetime',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 11,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'start_date',
          table: 'projects',
          data_type: 'date',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Startdato for projektet',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'end_date',
        meta: {
          interface: 'datetime',
          display: 'datetime',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 12,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'end_date',
          table: 'projects',
          data_type: 'date',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Slutdato for projektet',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'description',
        meta: {
          interface: 'input-multiline',
          display: 'formatted-value',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 13,
          width: 'full',
          group: null,
          translation: null,
          required: true
        },
        schema: {
          name: 'description',
          table: 'projects',
          data_type: 'text',
          default_value: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Detaljeret beskrivelse af projektet',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'short_description',
        meta: {
          interface: 'input-multiline',
          display: 'formatted-value',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 14,
          width: 'full',
          group: null,
          translation: null,
          required: true
        },
        schema: {
          name: 'short_description',
          table: 'projects',
          data_type: 'text',
          default_value: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Kort beskrivelse til brug i lister',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'challenge',
        meta: {
          interface: 'input-multiline',
          display: 'formatted-value',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 15,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'challenge',
          table: 'projects',
          data_type: 'text',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Hovedudfordringer i projektet',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'solution',
        meta: {
          interface: 'input-multiline',
          display: 'formatted-value',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 16,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'solution',
          table: 'projects',
          data_type: 'text',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Løsninger og tilgang til udfordringerne',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      // Featured Video (JSON field for component)
      {
        collection: 'projects',
        field: 'featured_video',
        meta: {
          interface: 'input-code',
          display: 'raw',
          display_options: {
            language: 'json'
          },
          readonly: false,
          hidden: false,
          sort: 17,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'featured_video',
          table: 'projects',
          data_type: 'json',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Fremhævet video for projektet',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'featured_images_title',
        meta: {
          interface: 'input',
          display: 'raw',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 18,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'featured_images_title',
          table: 'projects',
          data_type: 'varchar',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Titel for featured images sektion',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'featured_images_description',
        meta: {
          interface: 'input-multiline',
          display: 'formatted-value',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 19,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'featured_images_description',
          table: 'projects',
          data_type: 'text',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Beskrivelse af featured images',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'featured_images',
        meta: {
          interface: 'files',
          display: 'files',
          display_options: {
            template: '{{ $thumbnail }} {{ title }}'
          },
          readonly: false,
          hidden: false,
          sort: 20,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'featured_images',
          table: 'projects',
          data_type: 'json',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Fremhævede billeder for projektet',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'short_form_videos_title',
        meta: {
          interface: 'input',
          display: 'raw',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 21,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'short_form_videos_title',
          table: 'projects',
          data_type: 'varchar',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Titel for short form videos sektion',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'short_form_videos',
        meta: {
          interface: 'input-code',
          display: 'raw',
          display_options: {
            language: 'json'
          },
          readonly: false,
          hidden: false,
          sort: 22,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'short_form_videos',
          table: 'projects',
          data_type: 'json',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Korte videoer (9:16 format)',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'long_form_videos_title',
        meta: {
          interface: 'input',
          display: 'raw',
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 23,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'long_form_videos_title',
          table: 'projects',
          data_type: 'varchar',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Titel for long form videos sektion',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'long_form_videos',
        meta: {
          interface: 'input-code',
          display: 'raw',
          display_options: {
            language: 'json'
          },
          readonly: false,
          hidden: false,
          sort: 24,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'long_form_videos',
          table: 'projects',
          data_type: 'json',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Lange videoer (16:9 format)',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'content_strategy',
        meta: {
          interface: 'input-code',
          display: 'raw',
          display_options: {
            language: 'json'
          },
          readonly: false,
          hidden: false,
          sort: 25,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'content_strategy',
          table: 'projects',
          data_type: 'json',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Content strategy teknikker og tilgange',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'production_techniques',
        meta: {
          interface: 'input-code',
          display: 'raw',
          display_options: {
            language: 'json'
          },
          readonly: false,
          hidden: false,
          sort: 26,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'production_techniques',
          table: 'projects',
          data_type: 'json',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Produktionsteknikker og metoder',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'results',
        meta: {
          interface: 'input-code',
          display: 'raw',
          display_options: {
            language: 'json'
          },
          readonly: false,
          hidden: false,
          sort: 27,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'results',
          table: 'projects',
          data_type: 'json',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Resultater og metrics fra projektet',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'links',
        meta: {
          interface: 'input-code',
          display: 'raw',
          display_options: {
            language: 'json'
          },
          readonly: false,
          hidden: false,
          sort: 28,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'links',
          table: 'projects',
          data_type: 'json',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'Links til eksterne ressourcer',
          schema: 'public',
          foreign_key_schema: null
        }
      },
      {
        collection: 'projects',
        field: 'seo',
        meta: {
          interface: 'input-code',
          display: 'raw',
          display_options: {
            language: 'json'
          },
          readonly: false,
          hidden: false,
          sort: 29,
          width: 'full',
          group: null,
          translation: null,
          required: false
        },
        schema: {
          name: 'seo',
          table: 'projects',
          data_type: 'json',
          default_value: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_table: null,
          foreign_key_column: null,
          comment: 'SEO indstillinger for projektet',
          schema: 'public',
          foreign_key_schema: null
        }
      }
    ];

    // Opret alle felter
    for (const field of fields) {
      await this.createField('projects', field);
    }

    log('✅ Projects collection schema oprettet!', 'green');
  }

  async setupCollectionSettings() {
    log('🔧 Konfigurerer collection indstillinger...', 'cyan');

    try {
      // Opdater collection meta
      const collectionUpdate = {
        meta: {
          icon: 'folder',
          note: 'Line21 Projects - Komplet portfolio system',
          display_template: '{{ title }}',
          accountability: 'all',
          sort_field: 'year',
          archive_field: 'status',
          archive_value: 'archived',
          unarchive_value: 'published',
          sort: 1,
          color: null,
          item_duplication_fields: null,
          group: null,
          collapse: 'open',
          preview_url: null,
          versioning: false
        }
      };

      await this.client.patch('/collections/projects', collectionUpdate);
      log('✅ Collection indstillinger opdateret', 'green');
    } catch (error) {
      log(`❌ Fejl ved opdatering af collection: ${error.response?.data?.errors?.[0]?.message || error.message}`, 'red');
    }
  }

  async run() {
    log('🎯 LINE21 DIRECTUS - KOMPLET SCHEMA SETUP', 'bright');
    log('==========================================', 'bright');

    // Test forbindelse
    if (!(await this.testConnection())) {
      return;
    }

    // Opret komplet schema
    await this.setupProjectsCollection();
    await this.setupCollectionSettings();

    log('🎉 KOMPLET SCHEMA SETUP GENNEMFØRT!', 'bright');
    log('', 'reset');
    log('📋 Oprettede felter:', 'cyan');
    log('   ✅ featured (boolean)', 'green');
    log('   ✅ title (string, required)', 'green');
    log('   ✅ slug (string, unique, required)', 'green');
    log('   ✅ client (string, required)', 'green');
    log('   ✅ category (enum, required)', 'green');
    log('   ✅ project_icon (enum)', 'green');
    log('   ✅ thumbnail (file)', 'green');
    log('   ✅ thumbnail_url (string)', 'green');
    log('   ✅ role (string, required)', 'green');
    log('   ✅ year (integer, required)', 'green');
    log('   ✅ start_date (date)', 'green');
    log('   ✅ end_date (date)', 'green');
    log('   ✅ description (text, required)', 'green');
    log('   ✅ short_description (text, required)', 'green');
    log('   ✅ challenge (text)', 'green');
    log('   ✅ solution (text)', 'green');
    log('   ✅ featured_video (json)', 'green');
    log('   ✅ featured_images_title (string)', 'green');
    log('   ✅ featured_images_description (text)', 'green');
    log('   ✅ featured_images (files)', 'green');
    log('   ✅ short_form_videos_title (string)', 'green');
    log('   ✅ short_form_videos (json)', 'green');
    log('   ✅ long_form_videos_title (string)', 'green');
    log('   ✅ long_form_videos (json)', 'green');
    log('   ✅ content_strategy (json)', 'green');
    log('   ✅ production_techniques (json)', 'green');
    log('   ✅ results (json)', 'green');
    log('   ✅ links (json)', 'green');
    log('   ✅ seo (json)', 'green');
    log('', 'reset');
    log('🚀 Næste trin:', 'cyan');
    log('   1. Gå til http://localhost:8055/admin', 'yellow');
    log('   2. Se dine projekter under "Content" → "Projects"', 'yellow');
    log('   3. Alle felter er nu tilgængelige!', 'yellow');
    log('   4. Kør "npm run import" for at importere data igen', 'yellow');
  }
}

// Kør setup
const setup = new DirectusSchemaSetup();
setup.run().catch(console.error); 