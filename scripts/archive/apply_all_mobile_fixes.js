const fs = require('fs');

// =========================================================================
// 1. UPDATE DATA/ARTICLES.JS (Fix Guide wikiIds so all guides resolve)
// =========================================================================
let articlesJsCode = fs.readFileSync('data/articles.js', 'utf8');
articlesJsCode = articlesJsCode.replace('"wikiId": "sunyata"', '"wikiId": "zen"');
articlesJsCode = articlesJsCode.replace('"wikiId": "patanjali"', '"wikiId": "ashtanga-yoga"');
fs.writeFileSync('data/articles.js', articlesJsCode, 'utf-8');
console.log('1. Fixed guide wikiIds in data/articles.js!');

// =========================================================================
// 2. UPDATE STYLES.CSS (Mobile nav hidden transition, multi-row bubble spread, mobile discord button)
// =========================================================================
let css = fs.readFileSync('styles.css', 'utf8');

const mobileFixesCss = `
/* =========================================================================
   MOBILE & SCROLLING OPTIMIZATIONS
   ========================================================================= */

.mw-global-nav {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.mw-global-nav.nav-hidden {
  transform: translateY(-115%) !important;
}

@media (max-width: 768px) {
  /* Category Bubble Spread Multi-Row Cloud Stack */
  .category-bubble-spread {
    display: flex !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    gap: 0.5rem !important;
    overflow-x: visible !important;
    padding: 0.6rem 0.25rem !important;
  }

  .cat-bubble-btn {
    font-size: 0.78rem !important;
    padding: 0.45rem 0.85rem !important;
    white-space: nowrap !important;
    flex-grow: 0 !important;
  }

  /* Compact Discord Sign In Button on Mobile */
  .discord-bubble-btn {
    padding: 0.45rem 0.85rem !important;
    font-size: 0.8rem !important;
  }
}
`;

fs.writeFileSync('styles.css', css.trim() + '\n\n' + mobileFixesCss, 'utf8');
console.log('2. Appended mobile CSS optimizations to styles.css!');

// =========================================================================
// 3. UPDATE APP.JS (Smart Scroll Header, Fallback Article Resolver, Fullscreen Dimension Fix, Mobile Discord Text)
// =========================================================================
let appCode = fs.readFileSync('app.js', 'utf8');

// A. Improve loadArticle with fallback resolution & instant scrollTo top
const oldLoadArticleStart = `function loadArticle(articleId) {
    const article = window.METAWIKI_DATA.articles.find(a => a.id === articleId);
    if (!article) return;`;

const newLoadArticleStart = `function loadArticle(articleId) {
    let article = window.METAWIKI_DATA.articles.find(a => a.id === articleId);
    if (!article) {
      const searchKey = articleId.toLowerCase().split('-')[0];
      article = window.METAWIKI_DATA.articles.find(a => a.id.toLowerCase().includes(searchKey) || a.title.toLowerCase().includes(searchKey));
    }
    if (!article) return;
    
    window.scrollTo(0, 0);`;

if (appCode.includes(oldLoadArticleStart)) {
  appCode = appCode.replace(oldLoadArticleStart, newLoadArticleStart);
}

// B. Smart Scroll Header: Hide when scrolling down, reveal when scrolling up
const scrollHeaderCode = `
  // =========================================================================
  // SMART SCROLL HEADER CONTROLLER (Reveal on Scroll Up)
  // =========================================================================
  function initSmartScrollHeader() {
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const nav = document.getElementById('mwGlobalNav');
      if (nav) {
        if (currentScrollY > lastScrollY && currentScrollY > 90) {
          nav.classList.add('nav-hidden');
        } else {
          nav.classList.remove('nav-hidden');
        }
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  }
`;

if (!appCode.includes('function initSmartScrollHeader()')) {
  appCode = appCode.replace('initForumEngine();', 'initForumEngine();\n  initSmartScrollHeader();');
  appCode = appCode.replace('function initDimensionViewer() {', scrollHeaderCode + '\n  function initDimensionViewer() {');
}

// C. Fix Fullscreen Dimension Experience (Move #cnscns-widget element cleanly into modal & back)
const oldDimensionViewerCode = `    if (btnFullscreen && fullscreenModal) {
      btnFullscreen.addEventListener('click', () => {
        fullscreenModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
          const fsDriver = document.querySelector('#cnscns-widget-fullscreen .scroll-driver');
          if (fsDriver) {
            const fsSnaps = fsDriver.querySelectorAll('.snap-section');
            if (fsSnaps.length > 1) fsDriver.scrollTop = fsSnaps[1].offsetTop;
          }
        }, 60);
      });
    }

    if (btnCloseFullscreen && fullscreenModal) {
      btnCloseFullscreen.addEventListener('click', () => {
        fullscreenModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
    }`;

const newDimensionViewerCode = `    const widget = document.getElementById('cnscns-widget');
    const fsContainer = document.getElementById('cnscns-widget-fullscreen');

    if (btnFullscreen && fullscreenModal) {
      btnFullscreen.addEventListener('click', () => {
        if (widget && fsContainer) {
          fsContainer.appendChild(widget);
        }
        fullscreenModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 60);
      });
    }

    if (btnCloseFullscreen && fullscreenModal) {
      btnCloseFullscreen.addEventListener('click', () => {
        if (widget && wrapper) {
          wrapper.appendChild(widget);
        }
        fullscreenModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 60);
      });
    }`;

if (appCode.includes(oldDimensionViewerCode)) {
  appCode = appCode.replace(oldDimensionViewerCode, newDimensionViewerCode);
}

// D. Mobile Discord Button Text: "<i class='ph ph-discord-logo'></i> Sign In" on small screens
const oldDiscordTextLogic = `if (bubbleText) bubbleText.innerHTML = '🎮 Sign Up / Login with Discord';`;
const newDiscordTextLogic = `if (bubbleText) {
          if (window.innerWidth <= 640) {
            bubbleText.innerHTML = '<i class="ph ph-discord-logo"></i> Sign In';
          } else {
            bubbleText.innerHTML = '🎮 Sign Up / Login with Discord';
          }
        }`;

if (appCode.includes(oldDiscordTextLogic)) {
  appCode = appCode.replace(oldDiscordTextLogic, newDiscordTextLogic);
}

fs.writeFileSync('app.js', appCode, 'utf-8');
console.log('3. Updated app.js with all mobile optimizations and dimension viewer fullscreen fix!');
