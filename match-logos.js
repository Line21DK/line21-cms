const axios = require('axios');
const BASE_URL = 'http://localhost:1337';

// Mapping af client-navne til logo-ID'er
const logoMapping = {
  'SpeakerBee': 17,
  'Crunchy Frog': 6,
  'KPI': 13,
  'Pink Cotton Candy': 15,
  'Rokoko': 16,
  'SteelSeries': 18,
  'Danske Bank': 7,
  'djøf': 8,
  'GN': 9,
  'Google Digitalakademin': 10,
  'KAUFMANN & YOUNG': 11,
  'Kompasbank': 12,
  'Omnidocs': 14,
  'Sydbank': 19
};

async function matchLogosToProjects() {
  try {
    console.log('Henter projekter...');
    const projectsResponse = await axios.get(`${BASE_URL}/api/projects?populate=*`);
    const projects = projectsResponse.data.data;
    console.log(`Fandt ${projects.length} projekter`);

    for (const project of projects) {
      const { id, title, client, clientLogo } = project;
      if (clientLogo && clientLogo.id) {
        console.log(`✔️ Projekt "${title}" har allerede et logo.`);
        continue;
      }
      let matchedLogoId = null;
      for (const [clientName, logoId] of Object.entries(logoMapping)) {
        if ((client && client.toLowerCase().includes(clientName.toLowerCase())) || (title && title.toLowerCase().includes(clientName.toLowerCase()))) {
          matchedLogoId = logoId;
          console.log(`Matcher "${clientName}" til projekt "${title}" (Logo ID: ${logoId})`);
          break;
        }
      }
      if (matchedLogoId) {
        try {
          console.log(`Opdaterer projekt ${id} med logo ${matchedLogoId}...`);
          await axios.put(`${BASE_URL}/api/projects/${id}`, { clientLogo: matchedLogoId });
          console.log(`✅ Projekt "${title}" opdateret med logo`);
        } catch (error) {
          console.error(`❌ Fejl ved opdatering af projekt "${title}":`, error.response?.data || error.message);
        }
      } else {
        console.log(`⚠️  Ingen logo match fundet for projekt "${title}"`);
      }
    }
    console.log('🎉 Logo matching færdig!');
  } catch (error) {
    console.error('Fejl:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

matchLogosToProjects();
