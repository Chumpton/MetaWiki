const fs = require('fs');

const categoryImageMap = {
  'Judaism & Kabbalah': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'World Religions & Gnosticism': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  'Classical Yoga Systems': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  'Depth & Transpersonal Psychology': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'Sacred Geometry & Quantum Metaphysics': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  'Non-Duality & Advaita': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
};

const defaultImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

// 1. Update data/articles.js
let articlesJS = fs.readFileSync('data/articles.js', 'utf8');

// Replace all upload.wikimedia.org instances inside imagePath properties
articlesJS = articlesJS.replace(/"imagePath":\s*"https:\/\/upload\.wikimedia\.org\/[^"]+"/g, (match, offset, string) => {
  // Find category context if possible
  const categoryMatch = string.substring(Math.max(0, offset - 500), offset).match(/"category":\s*"([^"]+)"/);
  const cat = categoryMatch ? categoryMatch[1] : '';
  const imgUrl = categoryImageMap[cat] || defaultImage;
  return `"imagePath": "${imgUrl}"`;
});

// Also clean up standalone wikimedia thumbnail URLs
articlesJS = articlesJS.replace(/https:\/\/upload\.wikimedia\.org\/[^\s"',]+/g, defaultImage);

fs.writeFileSync('data/articles.js', articlesJS, 'utf-8');
console.log('1. Replaced all wikimedia CORB image URLs in data/articles.js with high-res curated Unsplash assets!');

// 2. Update app.js image helper getArticleImagePath
let appJS = fs.readFileSync('app.js', 'utf8');

appJS = appJS.replace(
  `function getArticleImagePath(a) {
    if (!a) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png';
    let path = (a.infobox && a.infobox.imagePath) || a.imagePath || a.leadImage || a.thumbnail;
    if (!path || typeof path !== 'string' || path.length < 5) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png';
    }
    return path.split('?')[0];
  }`,
  `function getArticleImagePath(a) {
    if (!a) return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
    let path = (a.infobox && a.infobox.imagePath) || a.imagePath || a.leadImage || a.thumbnail;
    if (!path || typeof path !== 'string' || path.length < 5 || path.includes('wikimedia.org')) {
      return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
    }
    return path;
  }`
);

// Replace default fallback images in app.js
appJS = appJS.replaceAll(
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
);

fs.writeFileSync('app.js', appJS, 'utf-8');
console.log('2. Updated app.js image helpers and fallbacks!');
