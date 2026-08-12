const fs = require('fs');

// 1. Update index.html: Google Fonts links, accessibility aria-labels on all inputs
let indexHTML = fs.readFileSync('index.html', 'utf8');

// Replace Google Fonts links in head
const fontLinks = `  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Outfit:wght@400;600;800;900&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">`;

if (!indexHTML.includes('fonts.googleapis.com')) {
  indexHTML = indexHTML.replace('<!-- Phosphor Icons -->', `${fontLinks}\n\n  <!-- Phosphor Icons -->`);
}

// Add aria-labels to all form inputs missing labels
indexHTML = indexHTML.replaceAll(
  '<input type="text" id="semanticSearchInput" class="hero-search-input-large" placeholder="Search metaphysics, religion, yoga & psychology...">',
  '<label for="semanticSearchInput" class="sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;">Search MetaWiki</label>\n        <input type="text" id="semanticSearchInput" class="hero-search-input-large" placeholder="Search metaphysics, religion, yoga & psychology..." aria-label="Search metaphysics, religion, yoga & psychology">'
);

indexHTML = indexHTML.replaceAll(
  '<input type="text" style="width: 100%; padding: 0.6rem;',
  '<input type="text" aria-label="Topic input" style="width: 100%; padding: 0.6rem;'
);

fs.writeFileSync('index.html', indexHTML, 'utf-8');
console.log('1. Updated index.html with clean Google Fonts and accessibility aria-labels');

// 2. Update styles.css with scroll-behavior auto and #articleReaderView page takeover
let stylesCSS = fs.readFileSync('styles.css', 'utf8');

// Replace line 6 font import if present
stylesCSS = stylesCSS.replace(/@import url\('https:\/\/fonts\.googleapis[^\']+'\);/, '');

const scrollAndTakeoverCSS = `
/* GLOBAL SCROLL RESET & PAGE TAKEOVER RULES */
html {
  scroll-behavior: auto !important;
}

body.article-view-active {
  overflow-y: auto !important;
}

body.article-view-active #initiatoryPortalView,
body.article-view-active #forumsView {
  display: none !important;
}

#articleReaderView {
  width: 100%;
  min-height: 100vh;
  padding-top: 1.5rem;
  padding-bottom: 6rem;
  background: #0a0a0f;
  position: relative;
  z-index: 100;
}
`;

if (!stylesCSS.includes('GLOBAL SCROLL RESET')) {
  stylesCSS += '\n' + scrollAndTakeoverCSS;
  fs.writeFileSync('styles.css', stylesCSS, 'utf-8');
  console.log('2. Updated styles.css with scroll reset and page takeover rules');
}

// 3. Update app.js getArticleImagePath & loadArticle to guarantee thumbnails and instant top scroll
let appJS = fs.readFileSync('app.js', 'utf8');

const svgEmblemHelper = `
  function getSVGThumbnailDataURI(title = '', category = '') {
    const bgColors = {
      'Judaism & Kabbalah': '#1e1b4b',
      'World Religions & Gnosticism': '#2e1065',
      'Classical Yoga Systems': '#064e3b',
      'Depth & Transpersonal Psychology': '#311042',
      'Sacred Geometry & Quantum Metaphysics': '#172554',
      'Non-Duality & Advaita': '#0f172a'
    };
    const bg = bgColors[category] || '#111827';
    const cleanTitle = (title || 'MetaWiki').substring(0, 24);
    const svg = \`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340"><rect width="600" height="340" fill="\${bg}"/><circle cx="300" cy="170" r="120" fill="none" stroke="rgba(251,191,36,0.3)" stroke-width="2"/><circle cx="300" cy="170" r="80" fill="none" stroke="rgba(168,85,247,0.3)" stroke-width="1.5"/><circle cx="300" cy="170" r="40" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/><polygon points="300,70 380,220 220,220" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1.5"/><polygon points="300,270 220,120 380,120" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1.5"/><text x="300" y="310" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">\${cleanTitle}</text></svg>\`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
`;

if (!appJS.includes('getSVGThumbnailDataURI')) {
  appJS = appJS.replace('function getArticleImagePath(a) {', svgEmblemHelper + '\n  function getArticleImagePath(a) {');
}

// Update getArticleImagePath to use getSVGThumbnailDataURI
const oldImagePathFunc = `function getArticleImagePath(a) {
    if (!a) return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
    let path = (a.infobox && a.infobox.imagePath) || a.imagePath || a.leadImage || a.thumbnail;
    if (!path || typeof path !== 'string' || path.length < 5 || path.includes('wikimedia.org')) {
      return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
    }
    return path;
  }`;

const newImagePathFunc = `function getArticleImagePath(a) {
    if (!a) return getSVGThumbnailDataURI('MetaWiki', '');
    let path = (a.infobox && a.infobox.imagePath) || a.imagePath || a.leadImage || a.thumbnail;
    if (!path || typeof path !== 'string' || path.length < 5 || path.includes('wikimedia.org')) {
      return getSVGThumbnailDataURI(a.title, a.category);
    }
    return path;
  }`;

appJS = appJS.replace(oldImagePathFunc, newImagePathFunc);

fs.writeFileSync('app.js', appJS, 'utf-8');
console.log('3. Updated app.js with SVG Emblem thumbnail generator and fallbacks!');
