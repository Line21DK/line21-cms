const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = 'your-api-token-here'; // Du skal erstatte dette med din faktiske API token

// Video data organiseret efter projekt
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

async function updateProjectVideos(slug, videos) {
  try {
    console.log(`\n🔄 Updating videos for project: ${slug}`);
    
    // First, get the project to find its ID
    const projectResponse = await axios.get(`${STRAPI_URL}/api/projects?filters[slug][$eq]=${slug}&populate=*`);
    
    if (!projectResponse.data.data || projectResponse.data.data.length === 0) {
      console.log(`❌ Project with slug "${slug}" not found`);
      return;
    }
    
    const project = projectResponse.data.data[0];
    console.log(`📋 Found project: ${project.attributes.title} (ID: ${project.id})`);
    
    // Prepare the update data
    const updateData = {
      data: {}
    };
    
    if (videos.shortFormVideos) {
      updateData.data.shortFormVideos = videos.shortFormVideos;
      console.log(`📹 Adding ${videos.shortFormVideos.length} short-form videos`);
    }
    
    if (videos.longFormVideos) {
      updateData.data.longFormVideos = videos.longFormVideos;
      console.log(`📹 Adding ${videos.longFormVideos.length} long-form videos`);
    }
    
    // Update the project
    const updateResponse = await axios.put(
      `${STRAPI_URL}/api/projects/${project.id}`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`✅ Successfully updated project: ${project.attributes.title}`);
    
  } catch (error) {
    console.error(`❌ Error updating project ${slug}:`, error.response?.data || error.message);
  }
}

async function importAllVideos() {
  console.log('🚀 Starting video import process...\n');
  
  for (const [slug, videos] of Object.entries(videoData)) {
    await updateProjectVideos(slug, videos);
  }
  
  console.log('\n🎉 Video import process completed!');
}

// Run the import
importAllVideos().catch(console.error); 