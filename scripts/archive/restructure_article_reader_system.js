const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

// Replace loadArticle in app.js with full standalone reader implementation
const newLoadArticle = `  function loadArticle(articleId) {
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
    
    // 1. Switch to Standalone Article Reader Page View
    switchView('article');

    // 2. Populate Header & Breadcrumb Content
    const titleEl = document.getElementById('articleMainTitle');
    if (titleEl) titleEl.textContent = article.title;

    const subEl = document.getElementById('articleMainSubtitle');
    if (subEl) subEl.textContent = article.shortDescription;

    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = article.title;

    // 3. Render Infobox Metadata Table
    renderInfobox(article.infobox);

    // 4. Render Main Article Paragraph Text
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

    // 6. Force instant scroll reset to absolute top of page
    forceScrollTop();
  }`;

const oldLoadArticleRegex = /function loadArticle\(articleId\) \{[\s\S]*?document\.title = article\.title \+ ' — MetaWiki';\n  \}/;

if (oldLoadArticleRegex.test(appCode)) {
  appCode = appCode.replace(oldLoadArticleRegex, newLoadArticle);
  fs.writeFileSync('app.js', appCode, 'utf-8');
  console.log('Successfully updated loadArticle in app.js!');
} else {
  console.error('Failed to match old loadArticle function in app.js');
}
