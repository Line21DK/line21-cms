const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = 'cf505be66c79b65b9ae929495f17b5f1393a8b4a7f1f86ccc24b414cee59d859805d1331ac76d241b22394bead56d6204774f8c1b3f194e5df3eb9987df0cc269fa0c7692329ef9f8a07b90d0a782a8ffce4c58a47054cd312c6cf402949dbeedeae640dbfdb23bf9fe1f68a5d87330109e546ba9087d38732e8039b4a79f6cd'; // <-- INDSÆT DIN TOKEN MELLEM ANFØRSELSTEGNENE

// Video data organiseret efter projekt slug
const videoData = {
  'rokoko-content-strategy': {
    shortFormVideos: [
      {
        title: 'Rokoko Motion Capture Short 1',
        url: 'https://www.youtube.com/shorts/c9ie4AD9Jyw?feature=share',
        description: 'Motion capture content for social media'
      },
      {
        title: 'Rokoko Motion Capture Short 2',
        url: 'https://www.youtube.com/shorts/0l19BSGHRAg',
        description: 'Motion capture content for social media'
      },
      {
        title: 'Rokoko Motion Capture Short 3',
        url: 'https://www.youtube.com/shorts/WGxGbZNuuM4',
        description: 'Motion capture content for social media'
      },
      {
        title: 'Rokoko Motion Capture Short 4',
        url: 'https://www.youtube.com/shorts/ytq7gy2NsZg',
        description: 'Motion capture content for social media'
      },
      {
        title: 'Rokoko Motion Capture Short 5',
        url: 'https://www.youtube.com/shorts/WmFu0RXDPB0',
        description: 'Motion capture content for social media'
      }
    ],
    longFormVideos: [
      {
        title: 'Rokoko Motion Capture Tutorial 1',
        url: 'https://www.youtube.com/watch?v=-TZTAGTJzdE',
        description: 'In-depth motion capture tutorial'
      },
      {
        title: 'Rokoko Motion Capture Tutorial 2',
        url: 'https://www.youtube.com/watch?v=gRuLJYMLHmk',
        description: 'In-depth motion capture tutorial'
      },
      {
        title: 'Rokoko Motion Capture Tutorial 3',
        url: 'https://www.youtube.com/watch?v=0I6C09Njj7M',
        description: 'In-depth motion capture tutorial'
      },
      {
        title: 'Rokoko Motion Capture Tutorial 4',
        url: 'https://www.youtube.com/watch?v=Q1IYuisYt8A',
        description: 'In-depth motion capture tutorial'
      },
      {
        title: 'Rokoko Motion Capture Tutorial 5',
        url: 'https://www.youtube.com/watch?v=e_FmlVx33fk',
        description: 'In-depth motion capture tutorial'
      },
      {
        title: 'Rokoko Motion Capture Tutorial 6',
        url: 'https://www.youtube.com/watch?v=Y5aVH4kdlJg',
        description: 'In-depth motion capture tutorial'
      },
      {
        title: 'Rokoko Motion Capture Tutorial 7',
        url: 'https://www.youtube.com/watch?v=HeDILBaX3nk&t=34s',
        description: 'In-depth motion capture tutorial'
      },
      {
        title: 'Rokoko Motion Capture Tutorial 8',
        url: 'https://www.youtube.com/watch?v=kKadYMur3lU',
        description: 'In-depth motion capture tutorial'
      }
    ]
  },
  'pink-cotton-candy-campaigns': {
    shortFormVideos: [
      {
        title: 'Entropycal Promo 1',
        url: 'https://www.youtube.com/watch?v=k0NrUefVi5s&pp=ygUKRW50cm9weWNhbA%3D%3D',
        description: 'Promo content for Entropycal'
      },
      {
        title: 'Entropycal Promo 2',
        url: 'https://www.youtube.com/watch?v=KJSzmCYWW08&pp=ygUKRW50cm9weWNhbA%3D%3D',
        description: 'Promo content for Entropycal'
      },
      {
        title: 'Entropycal Promo 3',
        url: 'https://www.youtube.com/watch?v=TJGlosaLbF8&pp=ygUKRW50cm9weWNhbA%3D%3D',
        description: 'Promo content for Entropycal'
      },
      {
        title: 'Entropycal Promo 4',
        url: 'https://www.youtube.com/watch?v=kNzRmMsbQWg&pp=ygUKRW50cm9weWNhbA%3D%3D',
        description: 'Promo content for Entropycal'
      },
      {
        title: 'Entropycal Promo 5',
        url: 'https://www.youtube.com/watch?v=lQq6NNsYoyY&pp=ygUKRW50cm9weWNhbA%3D%3D',
        description: 'Promo content for Entropycal'
      }
    ],
    longFormVideos: [
      {
        title: 'Music Video 1',
        url: 'https://www.youtube.com/watch?v=Ot2Am060rdg&pp=0gcJCcMJAYcqIYzv',
        description: 'Music video production'
      },
      {
        title: 'Music Video 2',
        url: 'https://www.youtube.com/watch?v=giV5GKbiFG4',
        description: 'Music video production'
      },
      {
        title: 'Music Video 3',
        url: 'https://www.youtube.com/watch?v=cT01I-sPOK0&list=PL04-4rcmVI0UhO4sfmcjKTiZ0-pQJXqhk&index=6',
        description: 'Music video production'
      }
    ]
  },
  'kpi-educational-livestreams': {
    longFormVideos: [
      {
        title: 'Google Digitalakademin Livestream 1',
        url: 'https://www.youtube.com/watch?v=r-8-WBqd1BU',
        description: 'Educational livestream for Google Digitalakademin'
      },
      {
        title: 'Google Digitalakademin Livestream 2',
        url: 'https://www.youtube.com/watch?v=uXR9j1SA52E',
        description: 'Educational livestream for Google Digitalakademin'
      },
      {
        title: 'Google Digitalakademin Livestream 3',
        url: 'https://www.youtube.com/watch?v=_g-h64nO4FA&pp=0gcJCcMJAYcqIYzv',
        description: 'Educational livestream for Google Digitalakademin'
      }
    ]
  },
  'crunchy-frog-music-videos': {
    longFormVideos: [
      {
        title: 'Late Runner - Video 1',
        url: 'https://www.youtube.com/watch?v=RPDuShYBjcA',
        description: 'Music video for Late Runner'
      },
      {
        title: 'Late Runner - Video 2',
        url: 'https://www.youtube.com/watch?v=QVKm_cqj-Pc',
        description: 'Music video for Late Runner'
      },
      {
        title: 'Late Runner - Video 3',
        url: 'https://www.youtube.com/watch?v=8Nl6EI8LVZg',
        description: 'Music video for Late Runner'
      },
      {
        title: 'ONBC - Video 1',
        url: 'https://www.youtube.com/watch?v=mlTGIC1A5bc',
        description: 'Music video for ONBC'
      },
      {
        title: 'ONBC - Video 2',
        url: 'https://www.youtube.com/watch?v=6Iy5tJbXN9Y',
        description: 'Music video for ONBC'
      },
      {
        title: 'ONBC - Video 3',
        url: 'https://www.youtube.com/watch?v=RNjBhJ19EK8',
        description: 'Music video for ONBC'
      },
      {
        title: 'Powersolo - Video',
        url: 'https://www.youtube.com/watch?v=xZTNQ1FPDFI',
        description: 'Music video for Powersolo'
      },
      {
        title: 'Jason Cutthroat - Video',
        url: 'https://www.youtube.com/watch?v=5vHfx3I0DHE',
        description: 'Music video for Jason Cutthroat'
      }
    ]
  },
  'steelseries-campaigns': {
    longFormVideos: [
      {
        title: 'Apex Pro Gen 3 Explainer - Collected',
        url: 'https://www.youtube.com/watch?v=wMd626KXd0o&feature=youtu.be',
        description: 'Apex Pro Gen 3 explainer video collection'
      },
      {
        title: 'Apex Pro Gen 3 Explainer - Individual 01',
        url: 'https://www.youtube.com/watch?v=n_4BzZ5RtwE',
        description: 'Apex Pro Gen 3 individual explainer video'
      },
      {
        title: 'Apex Pro Gen 3 Explainer - Individual 02',
        url: 'https://www.youtube.com/watch?v=YfK_XKVXfbM',
        description: 'Apex Pro Gen 3 individual explainer video'
      },
      {
        title: 'Apex Pro Gen 3 Explainer - Individual 03',
        url: 'https://www.youtube.com/watch?v=bXuVPc6jAmM',
        description: 'Apex Pro Gen 3 individual explainer video'
      },
      {
        title: 'Apex Pro Gen 3 Explainer - Individual 04',
        url: 'https://www.youtube.com/watch?v=rwzCbZio6Wg',
        description: 'Apex Pro Gen 3 individual explainer video'
      },
      {
        title: 'SteelSeries Commercial 1',
        url: 'https://www.youtube.com/watch?v=d-Mq1myRYYU',
        description: 'Commercial with art direction - shot on Alexa Mini LF with Signature primes'
      },
      {
        title: 'SteelSeries Commercial 2',
        url: 'https://www.youtube.com/watch?v=9DWdZ88MFJE',
        description: 'Commercial with art direction - shot on Alexa Mini LF with Signature primes'
      }
    ]
  },
  'documentary-art-projects': {
    longFormVideos: [
      {
        title: 'Documentary 1',
        url: 'https://youtu.be/ZB8bT94kE0s',
        description: 'Documentary project'
      },
      {
        title: 'Documentary 2',
        url: 'https://youtu.be/Fx_Mtr8fXfU',
        description: 'Documentary project'
      },
      {
        title: 'Documentary 3',
        url: 'https://youtu.be/9Z5JT0UIbKY',
        description: 'Documentary project'
      },
      {
        title: 'The Ugly Duckling - Performance 1',
        url: 'https://youtu.be/M5rf64GZHhc',
        description: 'Art performance - The Ugly Duckling'
      },
      {
        title: 'The Ugly Duckling - Performance 2',
        url: 'https://youtu.be/p3bU1ipSb0k',
        description: 'Art performance - The Ugly Duckling'
      },
      {
        title: 'The Ugly Duckling - Performance 3',
        url: 'https://youtu.be/wOVjeXuwO70',
        description: 'Art performance - The Ugly Duckling'
      }
    ]
  }
};

async function getProjects() {
  try {
    const response = await axios.get(`${STRAPI_URL}/api/projects?populate=*`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Fejl ved at hente projekter:', error.message);
    return [];
  }
}

async function updateProject(projectDocumentId, updateData) {
  try {
    const response = await axios.put(`${STRAPI_URL}/api/projects/${projectDocumentId}`, {
      data: updateData
    }, {
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Fejl ved at opdatere projekt ${projectDocumentId}:`, error.message);
    return null;
  }
}

async function addVideosToProjects() {
  console.log('🎬 Starter automatisk video import...\n');
  
  const projects = await getProjects();
  
  for (const project of projects) {
    const slug = project.slug;
    const projectDocumentId = project.documentId;
    
    if (videoData[slug]) {
      console.log(`📁 Behandler projekt: ${project.title}`);
      
      const updateData = {};
      
      // Tilføj shortFormVideos hvis de findes og mangler
      if (videoData[slug].shortFormVideos) {
        if (!project.shortFormVideos || project.shortFormVideos.length === 0) {
          updateData.shortFormVideos = videoData[slug].shortFormVideos;
          console.log(`  ✅ Tilføjer ${videoData[slug].shortFormVideos.length} short-form videos`);
        } else {
          console.log('  ⏩ Short-form videos findes allerede, springer over.');
        }
      }
      
      // Tilføj longFormVideos hvis de findes og mangler
      if (videoData[slug].longFormVideos) {
        if (!project.longFormVideos || project.longFormVideos.length === 0) {
          updateData.longFormVideos = videoData[slug].longFormVideos;
          console.log(`  ✅ Tilføjer ${videoData[slug].longFormVideos.length} long-form videos`);
        } else {
          console.log('  ⏩ Long-form videos findes allerede, springer over.');
        }
      }
      
      if (Object.keys(updateData).length > 0) {
        // Opdater projektet
        const result = await updateProject(projectDocumentId, updateData);
        
        if (result) {
          console.log(`  🎉 Projekt opdateret succesfuldt!\n`);
        } else {
          console.log(`  ❌ Fejl ved opdatering af projekt\n`);
        }
      } else {
        console.log('  ⏩ Ingen nye videoer at tilføje.\n');
      }
    }
  }
  
  console.log('🎬 Video import færdig!');
  console.log('📝 Husk at publicere projekterne i Strapi admin for at vise dem på frontend.');
}

// Kør scriptet
addVideosToProjects().catch(console.error);

// ---
// SÅDAN BRUGER DU SCRIPTET:
// 1. Opret en API token i Strapi admin (Settings > API Tokens > Create new)
// 2. Kopiér tokenen og indsæt den i linjen ovenfor hvor der står INDSÆT_DIN_API_TOKEN_HER
// 3. Kør scriptet: node add-videos-automatically.js
// 4. Tjek i Strapi admin at videoerne er tilføjet og publicér projekterne 