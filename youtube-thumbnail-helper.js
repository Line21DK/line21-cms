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

/**
 * Genererer YouTube thumbnail URL fra video ID
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail kvalitet (default, hq, mq, sd, maxres)
 * @returns {string} Thumbnail URL
 */
function generateYouTubeThumbnail(videoId, quality = 'hq') {
  if (!videoId) return null;
  
  const qualities = {
    default: 'default.jpg',
    hq: 'hqdefault.jpg',
    mq: 'mqdefault.jpg',
    sd: 'sddefault.jpg',
    maxres: 'maxresdefault.jpg'
  };
  
  const qualitySuffix = qualities[quality] || qualities.hq;
  return `https://img.youtube.com/vi/${videoId}/${qualitySuffix}`;
}

/**
 * Ekstraherer video ID fra YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} Video ID
 */
function extractVideoId(url) {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*&v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Opdaterer alle projekter med YouTube thumbnails
 */
async function updateYouTubeThumbnails() {
  try {
    console.log('🔍 Henter alle projekter...');
    
    // Hent alle projekter
    const response = await client.get('/items/projects?fields=id,project_featured_video,project_short_form_videos,project_long_form_videos');
    const projects = response.data.data || [];
    
    console.log(`📊 Fandt ${projects.length} projekter`);
    
    let updatedCount = 0;
    
    for (const project of projects) {
      let thumbnailUrl = null;
      
      // Tjek featured video først
      if (project.project_featured_video && project.project_featured_video.url) {
        const videoId = extractVideoId(project.project_featured_video.url);
        if (videoId) {
          thumbnailUrl = generateYouTubeThumbnail(videoId);
        }
      }
      
      // Hvis ingen featured video, tjek short form videos
      if (!thumbnailUrl && project.project_short_form_videos && Array.isArray(project.project_short_form_videos)) {
        for (const video of project.project_short_form_videos) {
          if (video.url) {
            const videoId = extractVideoId(video.url);
            if (videoId) {
              thumbnailUrl = generateYouTubeThumbnail(videoId);
              break;
            }
          }
        }
      }
      
      // Hvis stadig ingen, tjek long form videos
      if (!thumbnailUrl && project.project_long_form_videos && Array.isArray(project.project_long_form_videos)) {
        for (const video of project.project_long_form_videos) {
          if (video.url) {
            const videoId = extractVideoId(video.url);
            if (videoId) {
              thumbnailUrl = generateYouTubeThumbnail(videoId);
              break;
            }
          }
        }
      }
      
      // Opdater projekt hvis vi fandt en thumbnail
      if (thumbnailUrl) {
        try {
          await client.patch(`/items/projects/${project.id}`, {
            project_thumbnail_yt: thumbnailUrl
          });
          console.log(`✅ Opdateret projekt ${project.id} med YouTube thumbnail`);
          updatedCount++;
        } catch (error) {
          console.log(`❌ Fejl ved opdatering af projekt ${project.id}: ${error.message}`);
        }
      } else {
        console.log(`⏭️ Ingen YouTube video fundet for projekt ${project.id}`);
      }
    }
    
    console.log(`🎉 Færdig! Opdateret ${updatedCount} projekter med YouTube thumbnails`);
    
  } catch (error) {
    console.error('❌ Fejl:', error.message);
  }
}

/**
 * Test funktion til at generere thumbnail URL
 */
function testThumbnailGeneration() {
  const testUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://www.youtube.com/watch?feature=player_embedded&v=dQw4w9WgXcQ'
  ];
  
  console.log('🧪 Test af thumbnail generation:');
  
  for (const url of testUrls) {
    const videoId = extractVideoId(url);
    const thumbnail = generateYouTubeThumbnail(videoId);
    console.log(`URL: ${url}`);
    console.log(`Video ID: ${videoId}`);
    console.log(`Thumbnail: ${thumbnail}`);
    console.log('---');
  }
}

// Kør scriptet
const command = process.argv[2];

if (command === 'test') {
  testThumbnailGeneration();
} else {
  updateYouTubeThumbnails();
} 