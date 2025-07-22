const fs = require('fs');

console.log('🚀 Starting import of navigation and site settings to Render Strapi...');

const LOCAL_STRAPI_URL = 'http://localhost:1337';
const RENDER_URL = 'https://line21-cms.onrender.com';
const API_TOKEN = '5df9c7907dd01eca2395a5592863e21cf8607619c90fe6a1893c43ca1023396f24448b7eba2d5d1c34ac12d06c25be7bfd870469b4bff01c107b36cf55737b22c9ccbced983848ef8fc794eb1b19664ce8f595dbd11a34de461c0ce3a03cbbe092fa76aa0c7cbd46ea6e142a48a759edbcff48735885603c29b68384609802ae';

// Fetch navigation from local Strapi
async function fetchLocalNavigation() {
  try {
    console.log('📥 Fetching navigation from local Strapi...');
    const response = await fetch(`${LOCAL_STRAPI_URL}/api/navigations?populate=*&sort=order:asc`);
    
    if (!response.ok) {
      throw new Error(`Local Strapi error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Found ${data.data?.length || 0} navigation items in local Strapi`);
    return data.data || [];
  } catch (error) {
    console.error('❌ Error fetching navigation from local Strapi:', error.message);
    return [];
  }
}

// Fetch site settings from local Strapi
async function fetchLocalSiteSettings() {
  try {
    console.log('📥 Fetching site settings from local Strapi...');
    const response = await fetch(`${LOCAL_STRAPI_URL}/api/site-settings?populate=*`);
    
    if (!response.ok) {
      throw new Error(`Local Strapi error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Found ${data.data?.length || 0} site settings in local Strapi`);
    return data.data || [];
  } catch (error) {
    console.error('❌ Error fetching site settings from local Strapi:', error.message);
    return [];
  }
}

// Import navigation item to Render
async function importNavigationToRender(navItem) {
  try {
    const navData = {
      data: {
        title: navItem.title,
        url: navItem.url,
        order: navItem.order,
        publishedAt: navItem.publishedAt || new Date().toISOString()
      }
    };

    console.log(`📝 Importing navigation: ${navItem.title}`);
    
    const response = await fetch(`${RENDER_URL}/api/navigations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(navData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Successfully imported navigation: ${navItem.title} (ID: ${result.data.id})`);
      return true;
    } else {
      const error = await response.text();
      console.error(`❌ Failed to import navigation ${navItem.title}:`, response.status, error);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error importing navigation ${navItem.title}:`, error.message);
    return false;
  }
}

// Import site setting to Render
async function importSiteSettingToRender(setting) {
  try {
    const settingData = {
      data: {
        title: setting.title,
        value: setting.value,
        publishedAt: setting.publishedAt || new Date().toISOString()
      }
    };

    console.log(`📝 Importing site setting: ${setting.title}`);
    
    const response = await fetch(`${RENDER_URL}/api/site-settings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settingData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Successfully imported site setting: ${setting.title} (ID: ${result.data.id})`);
      return true;
    } else {
      const error = await response.text();
      console.error(`❌ Failed to import site setting ${setting.title}:`, response.status, error);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error importing site setting ${setting.title}:`, error.message);
    return false;
  }
}

// Import all navigation and settings
async function importAllData() {
  try {
    // Import navigation
    const localNavigation = await fetchLocalNavigation();
    if (localNavigation.length > 0) {
      console.log(`🔄 Starting import of ${localNavigation.length} navigation items...`);
      
      let navSuccessCount = 0;
      for (const navItem of localNavigation) {
        const success = await importNavigationToRender(navItem);
        if (success) navSuccessCount++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`✅ Successfully imported: ${navSuccessCount}/${localNavigation.length} navigation items`);
    }
    
    // Import site settings
    const localSiteSettings = await fetchLocalSiteSettings();
    if (localSiteSettings.length > 0) {
      console.log(`🔄 Starting import of ${localSiteSettings.length} site settings...`);
      
      let settingsSuccessCount = 0;
      for (const setting of localSiteSettings) {
        const success = await importSiteSettingToRender(setting);
        if (success) settingsSuccessCount++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`✅ Successfully imported: ${settingsSuccessCount}/${localSiteSettings.length} site settings`);
    }
    
    // Test final result
    console.log('\n🧪 Testing final result...');
    const testResponse = await fetch(`${RENDER_URL}/api/navigations?populate=*`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log(`📊 Total navigation items now in Render: ${testData.data?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Import process failed:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🌐 Local Strapi URL:', LOCAL_STRAPI_URL);
  console.log('🌐 Render Strapi URL:', RENDER_URL);
  console.log('');
  
  await importAllData();
}

main().catch(console.error); 