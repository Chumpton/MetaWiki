const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

// 1. Fix renderTriadicPortals syntax bugs (replace undefined 'a' with loop variable)
appCode = appCode.replace(
  '${createHawkinsRainbowBar(a.hawkinsCalibration || a.hawkinsNumeric)}\n          <div style="display: flex; align-items: center; gap: 0.75rem;">\n              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(g.wikiId)}</span>',
  '${createHawkinsRainbowBar(g.hawkinsLevel || 600)}\n          <div style="display: flex; align-items: center; gap: 0.75rem;">\n              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(g.wikiId)}</span>'
);

appCode = appCode.replace(
  '${createHawkinsRainbowBar(a.hawkinsCalibration || a.hawkinsNumeric)}\n          <div style="display: flex; align-items: center; gap: 0.75rem;">\n              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(f.wikiId)}</span>',
  '${createHawkinsRainbowBar(f.hawkinsLevel || 600)}\n          <div style="display: flex; align-items: center; gap: 0.75rem;">\n              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(f.wikiId)}</span>'
);

appCode = appCode.replace(
  '${createHawkinsRainbowBar(a.hawkinsCalibration || a.hawkinsNumeric)}\n          <div style="display: flex; align-items: center; gap: 0.75rem;">\n              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(c.wikiId)}</span>',
  '${createHawkinsRainbowBar(c.hawkinsLevel || 600)}\n          <div style="display: flex; align-items: center; gap: 0.75rem;">\n              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(c.wikiId)}</span>'
);

appCode = appCode.replace(
  '${createHawkinsRainbowBar(a.hawkinsCalibration || a.hawkinsNumeric)}\n          <div style="display: flex; align-items: center; gap: 0.75rem;">\n              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(a.wikiId)}</span>',
  '${createHawkinsRainbowBar(a.hawkinsLevel || 600)}\n          <div style="display: flex; align-items: center; gap: 0.75rem;">\n              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(a.wikiId)}</span>'
);

// 2. Add data-wiki to forum-topic-card in renderForumsFeed and renderForums
appCode = appCode.replaceAll(
  '<div class="forum-topic-card" data-id="${t.id}"',
  '<div class="forum-topic-card" data-wiki="${t.wikiId || \'logos\'}" data-id="${t.id}"'
);

// Add data-action="reply" to reply counter buttons so reply clicks open thread modal
appCode = appCode.replaceAll(
  '<span>Join ➔</span>',
  '<span data-action="reply">Join ➔</span>'
);
appCode = appCode.replaceAll(
  '<span style="display: inline-flex; align-items: center; gap: 0.35rem;"><i class="ph ph-chat-circle-text"></i> ${t.replies} replies</span>',
  '<span data-action="reply" style="display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;"><i class="ph ph-chat-circle-text"></i> ${t.replies} replies</span>'
);

// 3. Robust Universal Click Delegation for ALL cards, thumbnails, titles, and search items
const newClickDelegation = `  // =========================================================================
  // UNIVERSAL CLICK DELEGATION FOR ALL ARTICLE THUMBNAILS, CARDS & SEARCH
  // =========================================================================
  document.addEventListener('click', (e) => {
    // 1. Reply button click inside forum topic card
    const replyBtn = e.target.closest('[data-action="reply"]');
    if (replyBtn) {
      e.preventDefault();
      const forumCard = replyBtn.closest('.forum-topic-card');
      if (forumCard) {
        const topicId = forumCard.getAttribute('data-id');
        if (topicId) openForumThreadModal(topicId);
      }
      return;
    }

    // 2. Article Card or Thumbnail Click
    const card = e.target.closest('[data-wiki]');
    if (card) {
      const wikiId = card.getAttribute('data-wiki');
      if (wikiId) {
        e.preventDefault();
        loadArticle(wikiId);
      }
    }
  });`;

const oldClickDelegationRegex = /\/\/\s*=========================================================================\s*\/\/\s*UNIVERSAL CLICK DELEGATION[\s\S]*?\}\);\n  \}/;

if (oldClickDelegationRegex.test(appCode)) {
  appCode = appCode.replace(oldClickDelegationRegex, newClickDelegation);
} else {
  // Replace direct event listener block
  const oldSimpleDelegation = `  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-wiki]');
    if (card) {
      const wikiId = card.getAttribute('data-wiki');
      if (wikiId) {
        e.preventDefault();
        e.stopPropagation();
        loadArticle(wikiId);
      }
    }
  });`;
  if (appCode.includes(oldSimpleDelegation)) {
    appCode = appCode.replace(oldSimpleDelegation, newClickDelegation);
  }
}

fs.writeFileSync('app.js', appCode, 'utf-8');
console.log('Successfully updated app.js templates and universal click delegation!');
