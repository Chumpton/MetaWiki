const fs = require('fs');

let appJS = fs.readFileSync('app.js', 'utf8');

// 1. Update setupScrollHideHeader in app.js so top nav header is NEVER hidden in article view
const newScrollHideHeader = `  function setupScrollHideHeader() {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const globalNav = document.getElementById('mwGlobalNav');

      // In article view, NEVER hide the global top navigation bar!
      if (state.view === 'article') {
        if (globalNav) {
          globalNav.classList.remove('nav-hidden');
          globalNav.style.display = 'flex';
        }
        return;
      }

      if (currentScrollY > lastScrollY + 8 && currentScrollY > 120) {
        // Scrolling DOWN in portal — hide header
        if (globalNav) globalNav.classList.add('nav-hidden');
      } else if (currentScrollY < lastScrollY - 4) {
        // Scrolling UP — reveal header
        if (globalNav) globalNav.classList.remove('nav-hidden');
      }
      lastScrollY = currentScrollY;
    });
  }`;

const oldScrollHideRegex = /function setupScrollHideHeader\(\) \{[\s\S]*?\n  \}/;
if (oldScrollHideRegex.test(appJS)) {
  appJS = appJS.replace(oldScrollHideRegex, newScrollHideHeader);
}

// 2. Guarantee top nav header is explicitly revealed & un-hidden inside switchView
const oldSwitchView = `function switchView(targetView) {`;
const newSwitchView = `function switchView(targetView) {
    state.view = targetView;

    const portalView = document.getElementById('initiatoryPortalView');
    const articleView = document.getElementById('articleReaderView');
    const forumsView = document.getElementById('forumsView');

    if (portalView) portalView.style.display = targetView === 'portal' ? 'block' : 'none';
    if (forumsView) forumsView.style.display = targetView === 'forums' ? 'block' : 'none';
    if (articleView) articleView.style.display = targetView === 'article' ? 'block' : 'none';

    document.body.classList.toggle('article-view-active', targetView === 'article');

    const globalNav = document.getElementById('mwGlobalNav');
    if (globalNav) {
      globalNav.style.display = 'flex';
      globalNav.classList.remove('nav-hidden');
    }

    if (targetView === 'portal') {
      updateNavActiveState('navHomeBtn');
      document.title = 'MetaWiki — The Free Metaphysical Encyclopedia';
    } else if (targetView === 'forums') {
      updateNavActiveState('navForumsBtn');
      renderForums();
      document.title = 'Community Forums — MetaWiki';
    } else if (targetView === 'article') {
      // In article view, ensure navigation links are ready
      const currentNav = document.querySelector('.mw-nav-item.active');
      if (currentNav) currentNav.classList.remove('active');
    }

    // Force instant top scroll
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function _old_switchView_ignore(targetView) {`;

appJS = appJS.replace('function switchView(targetView) {', newSwitchView);

fs.writeFileSync('app.js', appJS, 'utf-8');
console.log('Successfully updated setupScrollHideHeader and switchView in app.js!');
