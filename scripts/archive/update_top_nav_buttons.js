const fs = require('fs');

// 1. Update index.html: "Portal" -> "Home"
let html = fs.readFileSync('index.html', 'utf8');

if (html.includes('<span>Portal</span>')) {
  html = html.replace('<span>Portal</span>', '<span>Home</span>');
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully updated navHomeBtn text to "Home" in index.html!');
}

// 2. Update app.js navigation click handlers
let appCode = fs.readFileSync('app.js', 'utf8');

const oldNavHandlersRegex = /\/\/ Global Nav Bar Handlers[\s\S]*?\/\/ Forum Category Filter Pills/;

const newNavHandlersCode = `// Global Nav Bar Handlers
    const navHomeBtn = document.getElementById('navHomeBtn');
    if (navHomeBtn) navHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalView();
      updateNavActiveState('navHomeBtn');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const sidebarHome = document.getElementById('sidebarHomeBtn');
    if (sidebarHome) sidebarHome.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalView();
      updateNavActiveState('navHomeBtn');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const articleHome = document.getElementById('articleHomeLink');
    if (articleHome) articleHome.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalView();
      updateNavActiveState('navHomeBtn');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Guides Navigation Handlers
    const navGuidesBtn = document.getElementById('navGuidesBtn');
    if (navGuidesBtn) navGuidesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalView();
      updateNavActiveState('navGuidesBtn');
      setTimeout(() => {
        const guidesEl = document.getElementById('guidesFeedSection');
        if (guidesEl) guidesEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    const articleGuidesLink = document.getElementById('articleGuidesLink');
    if (articleGuidesLink) articleGuidesLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalView();
      updateNavActiveState('navGuidesBtn');
      setTimeout(() => {
        const guidesEl = document.getElementById('guidesFeedSection');
        if (guidesEl) guidesEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    // Forums Navigation Handlers
    const navForumsBtn = document.getElementById('navForumsBtn');
    if (navForumsBtn) navForumsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalView();
      updateNavActiveState('navForumsBtn');
      setTimeout(() => {
        const forumsEl = document.getElementById('forumsFeedSection');
        if (forumsEl) forumsEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    const articleForumsLink = document.getElementById('articleForumsLink');
    if (articleForumsLink) articleForumsLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalView();
      updateNavActiveState('navForumsBtn');
      setTimeout(() => {
        const forumsEl = document.getElementById('forumsFeedSection');
        if (forumsEl) forumsEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    // Forum Category Filter Pills`;

if (oldNavHandlersRegex.test(appCode)) {
  appCode = appCode.replace(oldNavHandlersRegex, newNavHandlersCode);
  fs.writeFileSync('app.js', appCode, 'utf-8');
  console.log('Successfully updated nav bar event handlers in app.js!');
} else {
  console.log('Old nav handlers regex not matched in app.js');
}
