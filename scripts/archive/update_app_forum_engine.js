const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

// 1. Call initForumEngine in DOMContentLoaded inside app.js
if (!appCode.includes('initForumEngine();')) {
  appCode = appCode.replace('initDiscordController();', 'initDiscordController();\n  initForumEngine();');
}

// 2. Add complete Forum Engine implementation to app.js
const forumEngineCode = `
  // =========================================================================
  // FEATURE-COMPLETE COMMUNITY FORUMS ENGINE & THREAD READER
  // =========================================================================
  let activeThreadTopicId = null;

  function initForumEngine() {
    setupThreadModalEvents();
    setupCreateTopicModalEvents();
  }

  function openForumThreadModal(topicId) {
    const topics = window.METAWIKI_DATA.forumTopics || [];
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    activeThreadTopicId = topicId;

    const modal = document.getElementById('forumThreadModal');
    const title = document.getElementById('threadTitle');
    const category = document.getElementById('threadCategoryPill');
    const time = document.getElementById('threadTime');
    const authorAvatar = document.getElementById('threadAuthorAvatar');
    const authorName = document.getElementById('threadAuthorName');
    const body = document.getElementById('threadBody');
    const upvotesCount = document.getElementById('threadUpvoteCount');

    if (title) title.textContent = topic.title;
    if (category) category.textContent = topic.category;
    if (time) time.textContent = topic.time;
    if (authorAvatar) authorAvatar.src = topic.avatar || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/330px-Logos.svg.png';
    if (authorName) authorName.textContent = topic.author || 'Seeker#1008';
    if (body) body.textContent = topic.body;
    if (upvotesCount) upvotesCount.textContent = topic.upvotes || 24;

    renderThreadReplies(topic);

    if (modal) modal.style.display = 'flex';
  }

  function renderThreadReplies(topic) {
    const container = document.getElementById('threadRepliesContainer');
    const countHeader = document.getElementById('threadRepliesHeaderCount');
    if (!container) return;

    const replies = topic.repliesList || [];
    if (countHeader) countHeader.textContent = \`Replies (\${replies.length})\`;

    if (replies.length === 0) {
      container.innerHTML = \`<div style="color: var(--mw-text-muted); font-size: 0.85rem; font-style: italic; text-align: center; padding: 1rem;">No responses yet. Be the first to share your insight!</div>\`;
      return;
    }

    container.innerHTML = replies.map(r => \`
      <div style="background: rgba(22, 17, 46, 0.6); border: 1px solid var(--mw-border); border-radius: 12px; padding: 1rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="\${r.avatar || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/330px-Logos.svg.png'}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;" alt="Avatar">
            <span style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem;">\${r.author}</span>
          </div>
          <span style="font-size: 0.72rem; color: var(--mw-text-muted);">\${r.time}</span>
        </div>
        <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5; margin: 0;">\${r.body}</p>
      </div>
    \`).join('');
  }

  function setupThreadModalEvents() {
    const modal = document.getElementById('forumThreadModal');
    const closeBtn = document.getElementById('closeForumThreadModalBtn');
    const upvoteBtn = document.getElementById('upvoteThreadBtn');
    const submitReplyBtn = document.getElementById('submitThreadReplyBtn');
    const replyInput = document.getElementById('threadReplyInput');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    }

    if (upvoteBtn) {
      upvoteBtn.addEventListener('click', () => {
        if (!activeThreadTopicId) return;
        const topic = window.METAWIKI_DATA.forumTopics.find(t => t.id === activeThreadTopicId);
        if (topic) {
          topic.upvotes = (topic.upvotes || 24) + 1;
          const upvotesCount = document.getElementById('threadUpvoteCount');
          if (upvotesCount) upvotesCount.textContent = topic.upvotes;

          upvoteBtn.style.transform = 'scale(1.15)';
          setTimeout(() => { upvoteBtn.style.transform = 'scale(1)'; }, 200);
        }
      });
    }

    if (submitReplyBtn && replyInput) {
      submitReplyBtn.addEventListener('click', () => {
        const text = replyInput.value.trim();
        if (!text || !activeThreadTopicId) return;

        const topic = window.METAWIKI_DATA.forumTopics.find(t => t.id === activeThreadTopicId);
        if (!topic) return;

        const session = window.METAWIKI_DISCORD_BACKEND ? window.METAWIKI_DISCORD_BACKEND.getSession() : null;
        const authorName = session ? session.fullHandle : 'GnosticSeeker#1008';
        const authorAvatar = session ? session.avatar : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-330px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg';

        if (!topic.repliesList) topic.repliesList = [];
        topic.repliesList.push({
          author: authorName,
          avatar: authorAvatar,
          time: 'Just now',
          body: text
        });

        topic.replies = (topic.replies || 0) + 1;
        replyInput.value = '';

        renderThreadReplies(topic);
        renderForumsFeed();
        if (typeof renderForums === 'function') renderForums();
      });
    }
  }

  function setupCreateTopicModalEvents() {
    const modal = document.getElementById('createForumModal');
    const openBtn = document.getElementById('openCreateForumTopicBtn');
    const closeBtn = document.getElementById('closeCreateForumModalBtn');
    const cancelBtn = document.getElementById('cancelCreateTopicBtn');
    const publishBtn = document.getElementById('publishNewTopicBtn');

    const titleInput = document.getElementById('newTopicTitle');
    const categorySelect = document.getElementById('newTopicCategory');
    const bodyInput = document.getElementById('newTopicBody');

    function openModal() { if (modal) modal.style.display = 'flex'; }
    function closeModal() { if (modal) modal.style.display = 'none'; }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (publishBtn) {
      publishBtn.addEventListener('click', () => {
        const title = titleInput ? titleInput.value.trim() : '';
        const category = categorySelect ? categorySelect.value : 'Comparative Theology';
        const body = bodyInput ? bodyInput.value.trim() : '';

        if (!title || !body) {
          alert('Please provide a title and body for your discussion topic.');
          return;
        }

        const session = window.METAWIKI_DISCORD_BACKEND ? window.METAWIKI_DISCORD_BACKEND.getSession() : null;
        const authorName = session ? session.fullHandle : 'GnosticSeeker#1008';
        const authorAvatar = session ? session.avatar : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-330px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg';

        const newTopic = {
          id: 'forum-' + Date.now(),
          title: title,
          category: category,
          author: authorName,
          avatar: authorAvatar,
          body: body,
          replies: 0,
          upvotes: 1,
          views: '1',
          time: 'Just now',
          repliesList: []
        };

        if (!window.METAWIKI_DATA.forumTopics) window.METAWIKI_DATA.forumTopics = [];
        window.METAWIKI_DATA.forumTopics.unshift(newTopic);

        if (titleInput) titleInput.value = '';
        if (bodyInput) bodyInput.value = '';

        closeModal();
        renderForumsFeed();
        if (typeof renderForums === 'function') renderForums();
      });
    }
  }
`;

// Insert forum engine code into app.js
appCode = appCode.replace('function renderForumsFeed() {', forumEngineCode + '\n  function renderForumsFeed() {');

// 3. Make every forum topic card clickable to open openForumThreadModal(t.id)
const oldForumsFeedGridEnd = `const openCreateBtn = document.getElementById('openCreateForumTopicBtn');`;
const newForumsFeedGridEnd = `grid.querySelectorAll('.forum-topic-card').forEach(card => {
      card.addEventListener('click', () => {
        const topicId = card.getAttribute('data-id');
        if (topicId) openForumThreadModal(topicId);
      });
    });

    const openCreateBtn = document.getElementById('openCreateForumTopicBtn');`;

if (appCode.includes(oldForumsFeedGridEnd)) {
  appCode = appCode.replace(oldForumsFeedGridEnd, newForumsFeedGridEnd);
}

// Add data-id attribute to forum-topic-card in renderForumsFeed
appCode = appCode.replace('<div class="forum-topic-card" style="', '<div class="forum-topic-card" data-id="${t.id}" style="cursor: pointer; ');

fs.writeFileSync('app.js', appCode, 'utf-8');
console.log('Successfully updated app.js with full Forum Thread Reader & Reply Engine!');
