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

class DirectusPermissionsUpdater {
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

  async getTokenInfo() {
    try {
      const response = await this.client.get('/users/me');
      log(`✅ Token tilhører bruger: ${response.data.data.first_name} ${response.data.data.last_name}`, 'green');
      return response.data.data;
    } catch (error) {
      log(`❌ Kunne ikke hente token info: ${error.message}`, 'red');
      return null;
    }
  }

  async getPolicies() {
    try {
      const response = await this.client.get('/policies');
      log(`✅ Fandt ${response.data.data.length} policies`, 'green');
      return response.data.data;
    } catch (error) {
      log(`❌ Kunne ikke hente policies: ${error.message}`, 'red');
      return [];
    }
  }

  async createFullAccessPolicy() {
    try {
      const policyData = {
        name: 'Full Projects Access',
        icon: 'admin_panel_settings',
        description: 'Full access to all projects fields and operations',
        admin_access: false,
        app_access: true,
        collection: 'projects',
        action: 'all',
        permissions: {
          _and: [
            {
              collection: {
                _eq: 'projects'
              }
            }
          ]
        }
      };

      const response = await this.client.post('/policies', policyData);
      log('✅ Full access policy oprettet', 'green');
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
        log('⏭️ Policy eksisterer allerede', 'yellow');
        return null;
      }
      log(`❌ Fejl ved oprettelse af policy: ${error.response?.data?.errors?.[0]?.message || error.message}`, 'red');
      return null;
    }
  }

  async assignPolicyToUser(policyId, userId) {
    try {
      const accessData = {
        policy: policyId,
        user: userId
      };

      const response = await this.client.post('/access', accessData);
      log('✅ Policy tildelt til bruger', 'green');
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
        log('⏭️ Policy er allerede tildelt til bruger', 'yellow');
        return null;
      }
      log(`❌ Fejl ved tildeling af policy: ${error.response?.data?.errors?.[0]?.message || error.message}`, 'red');
      return null;
    }
  }

  async updateCollectionPermissions() {
    try {
      // Opdater collection permissions
      const collectionUpdate = {
        meta: {
          accountability: 'all'
        }
      };

      await this.client.patch('/collections/projects', collectionUpdate);
      log('✅ Collection permissions opdateret', 'green');
    } catch (error) {
      log(`❌ Fejl ved opdatering af collection permissions: ${error.response?.data?.errors?.[0]?.message || error.message}`, 'red');
    }
  }

  async run() {
    log('🎯 LINE21 DIRECTUS - PERMISSIONS UPDATE', 'bright');
    log('======================================', 'bright');

    // Test forbindelse
    if (!(await this.testConnection())) {
      return;
    }

    // Hent token info
    const userInfo = await this.getTokenInfo();
    if (!userInfo) {
      return;
    }

    // Hent policies
    const policies = await this.getPolicies();
    
    // Opret full access policy
    const policy = await this.createFullAccessPolicy();
    
    if (policy) {
      // Tildel policy til bruger
      await this.assignPolicyToUser(policy.id, userInfo.id);
    }

    // Opdater collection permissions
    await this.updateCollectionPermissions();

    log('🎉 PERMISSIONS UPDATE GENNEMFØRT!', 'bright');
    log('', 'reset');
    log('📋 Opdateringer:', 'cyan');
    log('   ✅ Full access policy oprettet', 'green');
    log('   ✅ Policy tildelt til API token', 'green');
    log('   ✅ Collection permissions opdateret', 'green');
    log('', 'reset');
    log('🚀 Test nu import igen:', 'cyan');
    log('   npm run import', 'yellow');
  }
}

// Kør updater
const updater = new DirectusPermissionsUpdater();
updater.run().catch(console.error); 