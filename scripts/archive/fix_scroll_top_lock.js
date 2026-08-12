const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

// Replace loadArticle and showPortalView to kill smooth scroll lock and force top scroll
const newScrollHelpers = `
  function forceScrollTop() {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
        document.body.style.scrollBehavior = '';
      }, 50);
    });
  }

  function showPortalView() {
    state.view = 'portal';
    document.body.classList.remove('article-view-active');
    const portalView = document.getElementById('initiatoryPortalView');
    const articleView = document.getElementById('articleReaderView');
    const forumsView = document.getElementById('forumsView');

    if (portalView) portalView.style.display = 'block';
    if (articleView) articleView.style.display = 'none';
    if (forumsView) forumsView.style.display = 'none';

    showGlobalNav(true);
    updateNavActiveState('navHomeBtn');
    forceScrollTop();
  }

  function showForumsView() {
    state.view = 'forums';
    document.body.classList.remove('article-view-active');
    const portalView = document.getElementById('initiatoryPortalView');
    const articleView = document.getElementById('articleReaderView');
    const forumsView = document.getElementById('forumsView');

    if (portalView) portalView.style.display = 'none';
    if (articleView) articleView.style.display = 'none';
    if (forumsView) forumsView.style.display = 'block';

    showGlobalNav(true);
    updateNavActiveState('navForumsBtn');
    renderForums();
    forceScrollTop();
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

    state.view = 'article';
    state.currentArticleId = article.id;

    document.body.classList.add('article-view-active');

    const portalView = document.getElementById('initiatoryPortalView');
    const articleView = document.getElementById('articleReaderView');
    const forumsView = document.getElementById('forumsView');

    if (portalView) portalView.style.display = 'none';
    if (forumsView) forumsView.style.display = 'none';
    if (articleView) articleView.style.display = 'block';

    const globalNav = document.getElementById('mwGlobalNav');
    if (globalNav) {
      globalNav.style.display = 'flex';
      globalNav.classList.remove('nav-hidden');
    }

    forceScrollTop();

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
  }
`;

const oldViewSectionRegex = /function showPortalView\(\) \{[\s\S]*?function loadArticle\(articleId\) \{[\s\S]*?\}\n  \}/;

if (oldViewSectionRegex.test(appCode)) {
  appCode = appCode.replace(oldViewSectionRegex, newScrollHelpers);
  fs.writeFileSync('app.js', appCode, 'utf-8');
  console.log('Successfully updated app.js with forceScrollTop and view switching!');
} else {
  console.log('oldViewSectionRegex not matched in app.js');
}
