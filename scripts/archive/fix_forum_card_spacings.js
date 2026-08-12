const fs = require('fs');

// 1. Update renderForumsFeed in app.js
let appCode = fs.readFileSync('app.js', 'utf8');

const oldForumsFeedRegex = /function renderForumsFeed\(\) \{[\s\S]*?\}\n  \}/;

const newForumsFeedCode = `function renderForumsFeed() {
    const grid = document.getElementById('forumsFeedGrid');
    if (!grid || !window.METAWIKI_DATA.forumTopics) return;

    grid.innerHTML = window.METAWIKI_DATA.forumTopics.map(t => \`
      <div class="forum-topic-card" style="background: rgba(18, 18, 26, 0.85); backdrop-filter: blur(20px); border: 1px solid var(--mw-border); border-radius: 16px; padding: 1.4rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 250px;">
        <div>
          <div class="forum-topic-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; gap: 0.5rem;">
            <span class="forum-category-pill" style="font-size: 0.72rem; font-weight: 800; padding: 0.25rem 0.65rem; border-radius: 20px; background: rgba(168, 85, 247, 0.15); color: var(--mw-violet); border: 1px solid var(--mw-border-violet); flex-shrink: 0;">\${t.category}</span>
            <span style="font-size: 0.75rem; color: var(--mw-text-muted); flex-shrink: 0;">\${t.time}</span>
          </div>
          <h3 class="forum-topic-title" style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: #fff; margin: 0 0 0.6rem 0; line-height: 1.35;">\${t.title}</h3>
          <p class="forum-topic-body" style="font-size: 0.85rem; color: var(--mw-text-muted); line-height: 1.5; margin: 0 0 1.2rem 0;">\${t.body}</p>
        </div>
        <div class="forum-topic-footer" style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--mw-border); padding-top: 0.85rem; font-size: 0.82rem; gap: 0.75rem; flex-wrap: nowrap;">
          <div class="forum-topic-author" style="display: flex; align-items: center; gap: 0.5rem; min-width: 0; flex: 1;">
            <img src="\${t.avatar}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1px solid var(--mw-border-gold); flex-shrink: 0;" alt="Author">
            <span style="font-weight: 700; color: #e2e8f0; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">\${t.author}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.85rem; color: var(--mw-gold); font-weight: 700; flex-shrink: 0; white-space: nowrap;">
            <span style="display: inline-flex; align-items: center; gap: 0.35rem;"><i class="ph ph-chat-circle-text"></i> \${t.replies} replies</span>
            <span style="color: var(--mw-gold); cursor: pointer;">Join ➔</span>
          </div>
        </div>
      </div>
    \`).join('');

    const openCreateBtn = document.getElementById('openCreateForumTopicBtn');
    if (openCreateBtn) {
      openCreateBtn.addEventListener('click', () => {
        showForumsView();
      });
    }
  }`;

if (oldForumsFeedRegex.test(appCode)) {
  appCode = appCode.replace(oldForumsFeedRegex, newForumsFeedCode);
  fs.writeFileSync('app.js', appCode, 'utf-8');
  console.log('Successfully updated renderForumsFeed in app.js!');
} else {
  console.log('Old renderForumsFeed regex not matched in app.js');
}

// 2. Update index.html grid template columns for forumsFeedGrid
let html = fs.readFileSync('index.html', 'utf8');
if (html.includes('id="forumsFeedGrid"')) {
  html = html.replace(
    /id="forumsFeedGrid"\s*style="[^"]*"/,
    'id="forumsFeedGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;"'
  );
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully updated forumsFeedGrid style in index.html!');
}
