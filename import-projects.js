#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Konfiguration
const CONFIG = {
  // Directus API konfiguration
  DIRECTUS_URL: process.env.DIRECTUS_URL || 'http://localhost:8055',
  DIRECTUS_TOKEN: process.env.DIRECTUS_TOKEN || 'your-api-token-here',
  
  // Data filer
  STATIC_DATA_DIR: path.join(__dirname, '../public/static-data'),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info', // 'debug', 'info', 'warn', 'error'
  
  // Sikkerhed
  DRY_RUN: process.env.DRY_RUN === 'true',
  FORCE_UPDATE: process.env.FORCE_UPDATE === 'true'
};

// Logger funktion
function log(level, message, data = null) {
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };
  if (levels[level] >= levels[CONFIG.LOG_LEVEL]) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (data) {
      console.log(`${prefix} ${message}`, JSON.stringify(data, null, 2));
    } else {
      console.log(`${prefix} ${message}`);
    }
  }
}

// Directus API klient
class DirectusClient {
  constructor() {
    this.baseURL = CONFIG.DIRECTUS_URL;
    this.token = CONFIG.DIRECTUS_TOKEN;
    this.axios = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  async testConnection() {
    try {
      log('info', '🔍 Tester forbindelse til Directus...');
      // Test med collections endpoint i stedet for items
      const response = await this.axios.get('/collections');
      log('info', '✅ Forbindelse til Directus OK');
      return true;
    } catch (error) {
      log('error', '❌ Kunne ikke forbinde til Directus', {
        status: error.response?.status,
        message: error.message,
        url: CONFIG.DIRECTUS_URL
      });
      return false;
    }
  }

  async getExistingProjects() {
    try {
      log('info', '📋 Henter eksisterende projekter...');
      // Prøv at hente kun de grundlæggende felter
      const response = await this.axios.get('/items/projects?fields=id,project_title,project_slug&limit=-1');
      const projects = response.data.data || [];
      
      // Opret et map med slug som nøgle
      const projectMap = {};
      projects.forEach(project => {
        projectMap[project.project_slug] = {
          id: project.id,
          ...project
        };
      });
      
      log('info', `📊 Fandt ${projects.length} eksisterende projekter`);
      return projectMap;
    } catch (error) {
      log('error', '❌ Fejl ved hentning af eksisterende projekter', error.message);
      // Hvis der er permissions problemer, returner tom map
      log('warn', '⚠️ Returnerer tom projekt liste pga permissions');
      return {};
    }
  }

  async createProject(projectData) {
    try {
      log('info', `➕ Opretter nyt projekt: ${projectData.project_title}`);
      
      if (CONFIG.DRY_RUN) {
        log('info', '🔍 DRY RUN: Ville have oprettet projekt', projectData);
        return { id: 'dry-run-id', ...projectData };
      }

      const response = await this.axios.post('/items/projects', projectData);
      
      // Håndter forskellige response strukturer
      const createdProject = response.data.data || response.data;
      const projectId = createdProject.id || createdProject.ID;
      
      log('info', `✅ Projekt oprettet: ${projectData.project_title} (ID: ${projectId})`);
      return createdProject;
    } catch (error) {
      log('error', `❌ Fejl ved oprettelse af projekt: ${projectData.project_title}`, {
        message: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }

  async updateProject(id, projectData) {
    try {
      log('info', `🔄 Opdaterer projekt: ${projectData.project_title} (ID: ${id})`);
      
      if (CONFIG.DRY_RUN) {
        log('info', '🔍 DRY RUN: Ville have opdateret projekt', { id, ...projectData });
        return { id, ...projectData };
      }

      const response = await this.axios.patch(`/items/projects/${id}`, projectData);
      
      log('info', `✅ Projekt opdateret: ${projectData.project_title} (ID: ${id})`);
      return response.data.data;
    } catch (error) {
      log('error', `❌ Fejl ved opdatering af projekt: ${projectData.project_title}`, {
        message: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }
}

// Data processor
class DataProcessor {
  constructor() {
    this.directus = new DirectusClient();
  }

  // Læs alle JSON filer fra static-data mappen
  async loadStaticData() {
    try {
      log('info', `📁 Læser data fra: ${CONFIG.STATIC_DATA_DIR}`);
      
      if (!fs.existsSync(CONFIG.STATIC_DATA_DIR)) {
        throw new Error(`Mappe findes ikke: ${CONFIG.STATIC_DATA_DIR}`);
      }

      const files = fs.readdirSync(CONFIG.STATIC_DATA_DIR)
        .filter(file => file.endsWith('.json'))
        .filter(file => file.startsWith('project-'));

      log('info', `📄 Fandt ${files.length} projekt filer`);

      const projects = [];
      for (const file of files) {
        try {
          const filePath = path.join(CONFIG.STATIC_DATA_DIR, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);
          
          if (data.project) {
            projects.push(data.project);
            log('debug', `📖 Læst projekt: ${data.project.title}`);
          }
        } catch (error) {
          log('warn', `⚠️ Kunne ikke læse fil: ${file}`, error.message);
        }
      }

      log('info', `📊 Indlæst ${projects.length} projekter fra JSON filer`);
      return projects;
    } catch (error) {
      log('error', '❌ Fejl ved indlæsning af statiske data', error.message);
      throw error;
    }
  }

  // Konverter projekt data til Directus format
  convertToDirectusFormat(project) {
    // Funktion til at fjerne id felter fra arrays
    const removeIds = (array) => {
      if (!Array.isArray(array)) return array;
      return array.map(item => {
        const { id, ...rest } = item;
        return rest;
      });
    };

    return {
      project_title: project.title,
      project_slug: project.slug,
      client_name: project.client,
      project_category: project.category,
      project_role: project.role,
      project_year: project.year,
      project_description: project.description,
      project_short_description: project.shortDescription,
      project_challenge: project.challenge,
      project_solution: project.solution,
      project_featured: project.featured || false,
      project_thumbnail_url: project.thumbnailUrl,
      project_featured_video: project.featuredVideo || null,
      project_short_form_videos: removeIds(project.shortFormVideos || []),
      project_long_form_videos: removeIds(project.longFormVideos || []),
      project_content_strategy: removeIds(project.contentStrategy || []),
      project_production_techniques: removeIds(project.productionTechniques || []),
      project_results: removeIds(project.results || []),
      project_links: removeIds(project.links || []),
      project_seo: project.seo || null
    };
  }

  // Hovedfunktion til at importere projekter
  async importProjects() {
    try {
      log('info', '🚀 Starter sikker import af projekter til Directus...');
      log('info', `🔧 Konfiguration: DRY_RUN=${CONFIG.DRY_RUN}, FORCE_UPDATE=${CONFIG.FORCE_UPDATE}`);

      // Test forbindelse
      const connectionOk = await this.directus.testConnection();
      if (!connectionOk) {
        throw new Error('Kunne ikke forbinde til Directus');
      }

      // Hent eksisterende projekter
      const existingProjects = await this.directus.getExistingProjects();
      
      // Indlæs statiske data
      const staticProjects = await this.loadStaticData();
      
      let created = 0;
      let updated = 0;
      let skipped = 0;
      let errors = 0;

      // Behandl hvert projekt
      for (const staticProject of staticProjects) {
        try {
          const directusData = this.convertToDirectusFormat(staticProject);
          const existingProject = existingProjects[staticProject.slug];

          if (!existingProject) {
            // Nyt projekt - opret det
            await this.directus.createProject(directusData);
            created++;
          } else if (CONFIG.FORCE_UPDATE) {
            // Eksisterende projekt - opdater det hvis FORCE_UPDATE er aktiveret
            await this.directus.updateProject(existingProject.id, directusData);
            updated++;
          } else {
            // Eksisterende projekt - spring over
            log('info', `⏭️ Spring over eksisterende projekt: ${staticProject.title}`);
            skipped++;
          }
        } catch (error) {
          log('error', `❌ Fejl ved behandling af projekt: ${staticProject.title}`, error.message);
          errors++;
        }
      }

      // Rapport
      log('info', '📊 Import rapport:');
      log('info', `   ✅ Oprettet: ${created}`);
      log('info', `   🔄 Opdateret: ${updated}`);
      log('info', `   ⏭️ Sprunget over: ${skipped}`);
      log('info', `   ❌ Fejl: ${errors}`);
      log('info', `   📊 Total behandlet: ${staticProjects.length}`);

      if (errors > 0) {
        log('warn', `⚠️ ${errors} fejl opstod under import`);
        process.exit(1);
      } else {
        log('info', '🎉 Import gennemført succesfuldt!');
      }

    } catch (error) {
      log('error', '❌ Kritisk fejl under import', error.message);
      process.exit(1);
    }
  }
}

// Hovedfunktion
async function main() {
  try {
    log('info', '🎯 Line21 Directus Projekt Import');
    log('info', '==================================');
    
    const processor = new DataProcessor();
    await processor.importProjects();
    
  } catch (error) {
    log('error', '❌ Uventet fejl', error.message);
    process.exit(1);
  }
}

// Kør scriptet hvis det kaldes direkte
if (require.main === module) {
  main();
}

module.exports = { DataProcessor, DirectusClient, CONFIG }; 