const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

// 1. Refactor Router & View switching in app.js
const oldRouterRegex = /function showPortalView\(\) \{[\s\S]*?document\.title = article\.title \+ ' — MetaWiki';\n  \}/;

const newRouterCode = `function switchView(targetView) {
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
    }

    forceScrollTop();
  }

  function showPortalView() {
    switchView('portal');
  }

  function showForumsView() {
    switchView('forums');
  }

  function loadArticle(articleId) {
    if (!window.METAWIKI_DATA || !window.METAWIKI_DATA.articles || window.METAWIKI_DATA.articles.length === 0) return;

    let article = null;
    if (articleId && typeof articleId === 'string') {
      article = window.METAWIKI_DATA.articles.find(a => a.id === articleId);
      if (!article) {
        const cleanKey = articleId.toLowerCase().split('-facet')[0].split('-')[0];
        article = window.METAWIKI_DATA.articles.find(a => a.id.toLowerCase().includes(cleanKey) || a.title.toLowerCase().includes(cleanKey));
      }
    }

    if (!article) {
      article = window.METAWIKI_DATA.articles[0];
    }
    if (!article) return;

    state.currentArticleId = article.id;
    switchView('article');

    // Populate article content
    const titleEl = document.getElementById('articleMainTitle');
    if (titleEl) titleEl.textContent = article.title;

    const subEl = document.getElementById('articleMainSubtitle');
    if (subEl) subEl.textContent = article.shortDescription;

    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = article.title;

    renderInfobox(article.infobox);

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

    document.title = article.title + ' — MetaWiki';
  }`;

if (oldRouterRegex.test(appCode)) {
  appCode = appCode.replace(oldRouterRegex, newRouterCode);
} else {
  console.error('oldRouterRegex failed to match');
}

// 2. Remove redundant per-card event listener loops from render functions
const oldFeaturedLoop = `    container.querySelectorAll('.featured-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-wiki');
        if (target) loadArticle(target);
      });
    });`;
appCode = appCode.replace(oldFeaturedLoop, '');

const oldGuidesLoop = `    grid.querySelectorAll('.triadic-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-wiki');
        if (target) loadArticle(target);
      });
    });`;
appCode = appCode.replaceAll(oldGuidesLoop, '');

const oldTriadicPortalsLoop = `    document.querySelectorAll('.triadic-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-wiki');
        if (target) loadArticle(target);
      });
    });`;
appCode = appCode.replace(oldTriadicPortalsLoop, '');

// 3. Remove dead comment line
appCode = appCode.replace('  // 6. Hovercard Engine (removed)\n', '');

fs.writeFileSync('app.js', appCode, 'utf-8');
console.log('Successfully refactored app.js with clean switchView router and removed redundant card loops!');
