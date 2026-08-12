const fs = require('fs');

// 1. Update index.html to add persistent brand logo inside navbar
let indexHTML = fs.readFileSync('index.html', 'utf8');

const oldNavStart = `<nav class="mw-global-nav" id="mwGlobalNav">
    <a class="mw-nav-item active" id="navHomeBtn">`;

const newNavStart = `<nav class="mw-global-nav" id="mwGlobalNav">
    <div class="mw-nav-brand" id="brandLogoHomeBtn" style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; margin-right: 1.5rem; flex-shrink: 0;">
      <video src="assets/logo-video.mp4" autoplay loop muted playsinline style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid var(--mw-gold);"></video>
      <span style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">MetaWiki</span>
    </div>

    <a class="mw-nav-item active" id="navHomeBtn">`;

if (indexHTML.includes(oldNavStart)) {
  indexHTML = indexHTML.replace(oldNavStart, newNavStart);
  fs.writeFileSync('index.html', indexHTML, 'utf-8');
  console.log('1. Updated index.html with persistent brand logo in header navbar');
}

// 2. Update styles.css with pristine article takeover styles
let stylesCSS = fs.readFileSync('styles.css', 'utf8');

const overhaulCSS = `
/* PERSISTENT BRAND LOGO IN HEADER */
.mw-nav-brand:hover span {
  color: var(--mw-gold) !important;
}

/* WIKIPEDIA STANDALONE ARTICLE PAGE TAKEOVER */
#articleReaderView {
  width: 100%;
  min-height: 100vh;
  padding-top: 1.5rem;
  padding-bottom: 6rem;
  background: #0a0a0f;
  position: relative;
  z-index: 100;
}

body.article-view-active #mwGlobalNav {
  transform: none !important;
  opacity: 1 !important;
}
`;

if (!stylesCSS.includes('.mw-nav-brand:hover')) {
  stylesCSS += '\n' + overhaulCSS;
  fs.writeFileSync('styles.css', stylesCSS, 'utf-8');
  console.log('2. Updated styles.css with brand logo and standalone article page takeover styles');
}

// 3. Update app.js to bind brandLogoHomeBtn and clean loadArticle
let appJS = fs.readFileSync('app.js', 'utf8');

// Bind brandLogoHomeBtn in bindHeroEvents
if (!appJS.includes('brandLogoHomeBtn')) {
  appJS = appJS.replace(
    'const navHomeBtn = document.getElementById(\'navHomeBtn\');',
    `const brandLogo = document.getElementById('brandLogoHomeBtn');
    if (brandLogo) brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalView();
      updateNavActiveState('navHomeBtn');
      window.scrollTo(0, 0);
    });

    const navHomeBtn = document.getElementById('navHomeBtn');`
  );
}

fs.writeFileSync('app.js', appJS, 'utf-8');
console.log('3. Updated app.js to bind brand logo navigation');
