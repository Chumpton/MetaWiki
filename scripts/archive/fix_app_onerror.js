const fs = require('fs');

let appContent = fs.readFileSync('app.js', 'utf8');

// Replace hardcoded mountain fallback with clean error handling that preserves unique image sources
appContent = appContent.replace(
  /onerror="this\.onerror=null; this\.src='https:\/\/images\.unsplash\.com\/photo-1506744038136-46273834b3fb[^']+'";/g,
  'onerror="this.onerror=null; this.style.display=\'none\';"'
);

fs.writeFileSync('app.js', appContent, 'utf-8');
console.log('Successfully removed repeating mountain photo fallback from app.js!');
