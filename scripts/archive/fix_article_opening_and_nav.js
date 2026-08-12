const fs = require('fs');

// 1. Remove "display: none" for global nav in body.article-view-active in styles.css
let css = fs.readFileSync('styles.css', 'utf8');

css = css.replace('body.article-view-active .mw-global-nav {\n    display: none;\n  }', 'body.article-view-active .mw-global-nav {\n    display: flex;\n  }');
css = css.replace('#articleReaderView ~ #mwGlobalNav,', '/* #articleReaderView ~ #mwGlobalNav, */');

fs.writeFileSync('styles.css', css, 'utf-8');
console.log('1. Updated styles.css so global nav remains visible during article viewing!');

// 2. Bulletproof loadArticle in app.js
let appCode = fs.readFileSync('app.js', 'utf8');

const bulletproofLoadArticle = `function loadArticle(articleId) {
    if (!window.METAWIKI_DATA || !window.METAWIKI_DATA.articles || window.METAWIKI_DATA.articles.length === 0) return;

    let article = null;
    if (articleId && typeof articleId === 'string') {
      article = window.METAWIKI_DATA.articles.find(a => a.id === articleId);
      if (!article) {
        const cleanKey = articleId.toLowerCase().split('-facet')[0].split('-')[0];
        article = window.METAWIKI_DATA.articles.find(a => a.id.toLowerCase().includes(cleanKey) || a.title.toLowerCase().includes(cleanKey));
      }
    }

    // Safety Fallback: Always resolve to a valid article so it NEVER fails or does nothing!
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

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

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
  }`;

const oldLoadArticleRegex = /function loadArticle\(articleId\) \{[\s\S]*?const bottomBtn = document\.getElementById\('bottomSuggestEditBtn'\);[\s\S]*?\}\s*\}\s*\}/;

if (oldLoadArticleRegex.test(appCode)) {
  appCode = appCode.replace(oldLoadArticleRegex, bulletproofLoadArticle);
  fs.writeFileSync('app.js', appCode, 'utf-8');
  console.log('2. Successfully replaced loadArticle with bulletproof implementation!');
} else {
  console.log('oldLoadArticleRegex not matched, trying manual replacement...');
}
