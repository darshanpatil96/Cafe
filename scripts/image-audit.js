import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MENU_DATA, CATEGORY_LIST } from '../src/data/menuData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Starting Cafe 3D Menu Image Audit...\n');

const brokenUrls = [];
const duplicateUrls = [];
const missingLocalAssets = [];

// Track all URLs and where they are used to detect duplicates
const urlUsage = new Map(); // url -> Array of descriptions

function trackUrl(url, sourceDescription) {
  if (!url) return;
  if (!urlUsage.has(url)) {
    urlUsage.set(url, []);
  }
  urlUsage.get(url).push(sourceDescription);
}

// 1. Gather all URLs from MENU_DATA
Object.entries(MENU_DATA).forEach(([category, items]) => {
  items.forEach(item => {
    trackUrl(item.image, `Menu Item: "${item.title}" (ID: ${item.id}) in Category: "${category}"`);
  });
});

// 2. Gather all URLs from CATEGORY_LIST
CATEGORY_LIST.forEach(cat => {
  trackUrl(cat.image, `Category Icon: "${cat.name}"`);
  trackUrl(cat.bannerImage, `Category Banner: "${cat.name}"`);
});

// Detect duplicates
for (const [url, usages] of urlUsage.entries()) {
  if (usages.length > 1) {
    duplicateUrls.push({ url, usages });
  }
}

// 3. Test each URL for validity
const allUrls = Array.from(urlUsage.keys());
const remoteUrls = allUrls.filter(url => url.startsWith('http://') || url.startsWith('https://'));
const localUrls = allUrls.filter(url => !url.startsWith('http://') && !url.startsWith('https://'));

// Verify local assets
localUrls.forEach(url => {
  // Resolve local paths (supporting absolute-style from project root or relative)
  const cleanPath = url.replace(/^@\//, 'src/').replace(/^\//, '');
  const fullPath = path.join(rootDir, cleanPath);
  
  if (!fs.existsSync(fullPath)) {
    const usages = urlUsage.get(url);
    missingLocalAssets.push({ url, path: fullPath, usages });
  }
});

// Verify remote URLs concurrently with limits
async function verifyRemoteUrl(url) {
  const usages = urlUsage.get(url);
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(6000)
    });
    
    // If HEAD fails, fall back to GET (some servers block HEAD)
    if (!response.ok) {
      const getResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(6000)
      });
      
      if (!getResponse.ok) {
        brokenUrls.push({ url, status: getResponse.status, usages });
      }
    }
  } catch (error) {
    brokenUrls.push({ url, status: 'Network Error/Timeout', error: error.message, usages });
  }
}

console.log(`🌐 Testing ${remoteUrls.length} remote URLs and verifying ${localUrls.length} local assets...`);

await Promise.all(remoteUrls.map(url => verifyRemoteUrl(url)));

// Print Report
console.log('\n📊 --- IMAGE AUDIT REPORT --- 📊\n');

let failed = false;

if (duplicateUrls.length > 0) {
  console.error('❌ DUPLICATE URLS FOUND:');
  duplicateUrls.forEach(({ url, usages }) => {
    console.error(`  🔗 URL: ${url}`);
    usages.forEach(usage => console.error(`     - ${usage}`));
  });
  console.error('');
  failed = true;
} else {
  console.log('✅ No duplicate URLs found.');
}

if (missingLocalAssets.length > 0) {
  console.error('❌ MISSING LOCAL ASSETS FOUND:');
  missingLocalAssets.forEach(({ url, path, usages }) => {
    console.error(`  📁 File does not exist: ${url}`);
    console.error(`     Resolved Path: ${path}`);
    usages.forEach(usage => console.error(`     - ${usage}`));
  });
  console.error('');
  failed = true;
} else {
  console.log('✅ All local assets exist.');
}

if (brokenUrls.length > 0) {
  console.error('❌ BROKEN REMOTE URLS FOUND:');
  brokenUrls.forEach(({ url, status, usages, error }) => {
    console.error(`  🔴 URL: ${url}`);
    console.error(`     Status: ${status} ${error ? `(${error})` : ''}`);
    usages.forEach(usage => console.error(`     - ${usage}`));
  });
  console.error('');
  failed = true;
} else {
  console.log('✅ All remote URLs are online and valid.');
}

if (failed) {
  console.log('\n❌ Audit failed. Please resolve the issues reported above.');
  process.exit(1);
} else {
  console.log('\n🎉 Audit passed! All images are unique, present, and valid.');
  process.exit(0);
}
