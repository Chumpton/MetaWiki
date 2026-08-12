const fs = require('fs');

// Helper to convert any upload.wikimedia.org URL to official Special:FilePath URL
function wikimediaToFilePath(url) {
  if (!url || typeof url !== 'string' || url.length < 5) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Logos.svg?width=600';
  }
  if (url.includes('Special:FilePath')) return url;
  if (!url.includes('wikimedia.org')) return url;

  const parts = url.split('?')[0].split('/');
  const last = parts[parts.length - 1];
  const filename = last.replace(/^\d+px-/, '');
  return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + filename + '?width=600';
}

// 1. UPDATE DATA/ARTICLES.JS
let articlesJS = fs.readFileSync('data/articles.js', 'utf8');

// Replace all upload.wikimedia.org URLs with Special:FilePath URLs
articlesJS = articlesJS.replace(/https:\/\/upload\.wikimedia\.org\/[^\s"',]+/g, (match) => {
  return wikimediaToFilePath(match);
});

fs.writeFileSync('data/articles.js', articlesJS, 'utf-8');
console.log('1. Updated data/articles.js with canonical Special:FilePath Wikipedia image URLs!');

// 2. UPDATE INDEX.HTML WITH UNIFIED MODULAR LAYOUT
let indexHTML = fs.readFileSync('index.html', 'utf8');

// Ensure persistent brand logo is cleanly in navbar
if (!indexHTML.includes('id="brandLogoHomeBtn"')) {
  indexHTML = indexHTML.replace(
    '<nav class="mw-global-nav" id="mwGlobalNav">',
    `<nav class="mw-global-nav" id="mwGlobalNav">
    <div class="mw-nav-brand" id="brandLogoHomeBtn" style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; margin-right: 1.5rem; flex-shrink: 0;">
      <video src="assets/logo-video.mp4" autoplay loop muted playsinline style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid var(--mw-gold);"></video>
      <span style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">MetaWiki</span>
    </div>`
  );
}

fs.writeFileSync('index.html', indexHTML, 'utf-8');
console.log('2. Updated index.html with persistent brand header!');

// 3. UPDATE STYLES.CSS WITH CLEAN VIEW ARCHITECTURE
let stylesCSS = fs.readFileSync('styles.css', 'utf8');

const unifiedCSS = `
/* =========================================================================
   UNIFIED SITE ARCHITECTURE & VIEW CONTAINER SYSTEM
   ========================================================================= */

html, body {
  scroll-behavior: auto !important;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* Persistent Header Bar */
#mwGlobalNav {
  position: sticky !important;
  top: 0 !important;
  z-index: 9999 !important;
  background: rgba(10, 10, 15, 0.96) !important;
  backdrop-filter: blur(20px) !important;
  border-bottom: 1px solid var(--mw-border-gold) !important;
  display: flex !important;
  transform: none !important;
  opacity: 1 !important;
}

/* Distinct Modular View Containers */
#initiatoryPortalView {
  width: 100%;
  min-height: 100vh;
}

#forumsView {
  width: 100%;
  min-height: 100vh;
  padding-top: 2rem;
  padding-bottom: 6rem;
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

/* Image Failover & Card Layouts */
.triadic-thumbnail-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  background: #12121a;
}
`;

if (!stylesCSS.includes('UNIFIED SITE ARCHITECTURE')) {
  stylesCSS += '\n' + unifiedCSS;
  fs.writeFileSync('styles.css', stylesCSS, 'utf-8');
  console.log('3. Updated styles.css with unified container rules!');
}

// 4. UPDATE APP.JS WITH ROUTER & WIKIPEDIA IMAGE HANDLER
let appJS = fs.readFileSync('app.js', 'utf8');

// Add wikimediaToFilePath helper at top of app.js
const jsHelper = `
  function getWikipediaImagePath(url, title = '', category = '') {
    if (!url || typeof url !== 'string' || url.length < 5) {
      return getSVGThumbnailDataURI(title, category);
    }
    if (url.includes('Special:FilePath')) return url;
    if (url.includes('wikimedia.org')) {
      const parts = url.split('?')[0].split('/');
      const last = parts[parts.length - 1];
      const filename = last.replace(/^\\d+px-/, '');
      return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + filename + '?width=600';
    }
    return url;
  }
`;

if (!appJS.includes('getWikipediaImagePath')) {
  appJS = jsHelper + '\n' + appJS;
}

// Update getArticleImagePath to use getWikipediaImagePath
appJS = appJS.replace(
  /function getArticleImagePath\(a\) \{[\s\S]*?\n  \}/,
  `function getArticleImagePath(a) {
    if (!a) return getSVGThumbnailDataURI('MetaWiki', '');
    let path = (a.infobox && a.infobox.imagePath) || a.imagePath || a.leadImage || a.thumbnail;
    return getWikipediaImagePath(path, a.title, a.category);
  }`
);

// Update loadArticle function with Hash Router update and top scroll
const cleanLoadArticle = `  function loadArticle(articleId) {
    if (!window.METAWIKI_DATA || !window.METAWIKI_DATA.articles || window.METAWIKI_DATA.articles.length === 0) return;

    let article = null;
    if (articleId && typeof articleId === 'string') {
      const clean = articleId.toLowerCase().trim();
      article = window.METAWIKI_DATA.articles.find(a => a.id.toLowerCase() === clean);
      if (!article) {
        article = window.METAWIKI_DATA.articles.find(a => a.title.toLowerCase() === clean);
      }
      if (!article) {
        const cleanKey = clean.split('-facet')[0].split('-')[0];
        if (cleanKey.length >= 3) {
          article = window.METAWIKI_DATA.articles.find(a => a.id.toLowerCase().includes(cleanKey) || a.title.toLowerCase().includes(cleanKey));
        }
      }
    }

    if (!article) {
      article = window.METAWIKI_DATA.articles[0];
    }
    if (!article) return;

    state.currentArticleId = article.id;
    
    // 1. Switch View Containers
    switchView('article');

    // Update URL hash state
    try { window.location.hash = 'article/' + article.id; } catch(e) {}

    // 2. Populate Header & Breadcrumb Content
    const titleEl = document.getElementById('articleMainTitle');
    if (titleEl) titleEl.textContent = article.title;

    const subEl = document.getElementById('articleMainSubtitle');
    if (subEl) subEl.textContent = article.shortDescription;

    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = article.title;

    // 3. Render Infobox Metadata Table with Wikipedia Image
    renderInfobox(article.infobox);

    // 4. Render Main Article Body Text
    const mainText = document.getElementById('articleMainText');
    if (mainText) {
      const suggestEditBubbleHTML = \`
        <div class="article-suggest-edit-container" style="margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.2); text-align: center;">
          <button id="bottomSuggestEditBtn" class="suggest-edit-bubble-btn">
            <i class="ph ph-pencil-simple-line" style="font-size: 1.2rem;"></i> <span>Suggest an Edit or Ascension Revision</span>
          </button>
        </div>
      \`;
      mainText.innerHTML = (article.contentHTML || '') + suggestEditBubbleHTML;

      const bottomBtn = document.getElementById('bottomSuggestEditBtn');
      if (bottomBtn) {
        bottomBtn.addEventListener('click', () => {
          const modal = document.getElementById('suggestEditModal');
          if (modal) {
            modal.style.display = 'flex';
            const topicInput = modal.querySelector('input[type="text"]');
            if (topicInput) topicInput.value = article.title;
          }
        });
      }
    }

    // 5. Populate Dynamic Table of Contents (TOC) Sidebar
    const tocList = document.getElementById('articleTOCList');
    if (tocList && mainText) {
      const headings = mainText.querySelectorAll('h2, h3, .article-section-title');
      if (headings.length > 0) {
        tocList.innerHTML = Array.from(headings).map((h, i) => {
          const hId = h.id || 'heading-' + i;
          h.id = hId;
          return \`<li class="toc-sidebar-item" data-target="\${hId}">\${h.textContent.trim()}</li>\`;
        }).join('');

        tocList.querySelectorAll('.toc-sidebar-item').forEach(item => {
          item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
          });
        });
      } else {
        tocList.innerHTML = \`<li class="toc-sidebar-item active">Overview</li><li class="toc-sidebar-item">Metaphysical Principles</li><li class="toc-sidebar-item">Hawkins Calibration</li><li class="toc-sidebar-item">References & Citations</li>\`;
      }
    }

    document.title = article.title + ' — MetaWiki';

    // 6. Force viewport scroll reset to absolute top of page
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }`;

const oldLoadArticleRegex = /function loadArticle\(articleId\) \{[\s\S]*?document\.title = article\.title \+ ' — MetaWiki';\n  \}/;

if (oldLoadArticleRegex.test(appJS)) {
  appJS = appJS.replace(oldLoadArticleRegex, cleanLoadArticle);
}

fs.writeFileSync('app.js', appJS, 'utf-8');
console.log('4. Updated app.js with unified Router and Wikipedia image handler!');
