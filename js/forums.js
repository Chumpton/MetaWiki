/**
 * MetaWiki - Metaphysical Community Forums Engine (Supabase Integrated)
 * Linked Discord user profiles, live post creation, reply comments, upvoting,
 * category filtering, and thread reader modal.
 */

(function(window) {
  'use strict';

  let activeThreadTopicId = null;

  if (!window.state) {
    window.state = {
      forumCategory: 'all',
      forumVisibleCount: 15
    };
  }

  // Initial authentic default topics from server founder Campton
  const DEFAULT_AUTHENTIC_TOPICS = [
    {
      id: 'topic-init-1',
      title: 'Contemplating Non-Dual Perception and Consciousness Calibration',
      category: 'Metaphysical Debate',
      author: 'Campton',
      avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
      handle: '@campton',
      body: 'Welcome to the MetaWiki community discussions. Share your insights on Hawkins consciousness calibrations, Hermetic principles, or Advaita Vedanta traditions.',
      repliesCount: 2,
      upvotes: 12,
      timestamp: 'Today',
      repliesList: [
        {
          author: 'Campton',
          avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
          body: 'All posts and comments are linked directly to your authenticated Discord user profile.',
          time: 'Today'
        }
      ]
    }
  ];

  function getTopicsList() {
    if (!window.METAWIKI_DATA) window.METAWIKI_DATA = {};
    if (!window.METAWIKI_DATA.forumTopics || window.METAWIKI_DATA.forumTopics.length === 0) {
      window.METAWIKI_DATA.forumTopics = DEFAULT_AUTHENTIC_TOPICS;
    }
    return window.METAWIKI_DATA.forumTopics;
  }

  async function openForumThreadModal(topicId) {
    const topics = getTopicsList();
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
    if (time) time.textContent = topic.time || topic.timestamp || 'Recently';
    if (authorAvatar) authorAvatar.src = topic.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
    if (authorName) authorName.textContent = topic.author || 'Campton';
    if (body) body.textContent = topic.body;
    if (upvotesCount) upvotesCount.textContent = topic.upvotes || 1;

    // Fetch comments from Supabase if available
    if (window.METAWIKI_FORUM_SERVICE && String(topicId).includes('-')) {
      try {
        const supaComments = await window.METAWIKI_FORUM_SERVICE.fetchComments(topicId);
        if (supaComments && supaComments.length > 0) {
          topic.repliesList = supaComments;
        }
      } catch (e) {}
    }

    renderThreadReplies(topic);
    if (modal) modal.style.display = 'flex';
  }

  function renderThreadReplies(topic) {
    const container = document.getElementById('threadRepliesContainer');
    const countHeader = document.getElementById('threadRepliesHeaderCount');
    if (!container) return;

    const replies = topic.repliesList || [];
    if (countHeader) countHeader.textContent = `Replies (${replies.length})`;

    if (replies.length === 0) {
      container.innerHTML = `<div style="color: var(--mw-text-muted); font-size: 0.85rem; font-style: italic; text-align: center; padding: 1rem;">No responses yet. Be the first to share your insight!</div>`;
      return;
    }

    container.innerHTML = replies.map(r => `
      <div style="background: rgba(22, 17, 46, 0.6); border: 1px solid var(--mw-border); border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.55rem;">
            <img src="${r.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);" alt="Avatar">
            <span style="font-weight: 700; color: #f2f3f5; font-size: 0.88rem;">${r.author}</span>
          </div>
          <span style="font-size: 0.72rem; color: var(--mw-text-muted);">${r.time || 'Just now'}</span>
        </div>
        <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5; margin: 0;">${r.body}</p>
      </div>
    `).join('');
  }

  function setupThreadModalEvents() {
    const modal = document.getElementById('forumThreadModal');
    const closeBtn = document.getElementById('closeForumThreadModalBtn');
    const upvoteBtn = document.getElementById('upvoteThreadBtn');
    const submitReplyBtn = document.getElementById('submitThreadReplyBtn');
    const replyInput = document.getElementById('threadReplyInput');

    function closeModal() {
      if (modal) modal.style.display = 'none';
      activeThreadTopicId = null;
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (upvoteBtn) {
      upvoteBtn.addEventListener('click', () => {
        if (!activeThreadTopicId) return;
        const topics = getTopicsList();
        const topic = topics.find(t => t.id === activeThreadTopicId);
        if (topic) {
          topic.upvotes = (topic.upvotes || 0) + 1;
          const upvotesCount = document.getElementById('threadUpvoteCount');
          if (upvotesCount) upvotesCount.textContent = topic.upvotes;
          renderForums();
        }
      });
    }

    if (submitReplyBtn && replyInput) {
      submitReplyBtn.addEventListener('click', async () => {
        const text = replyInput.value.trim();
        if (!text || !activeThreadTopicId) return;

        const topics = getTopicsList();
        const topic = topics.find(t => t.id === activeThreadTopicId);
        if (!topic) return;

        let commentObj = {
          author: 'Campton',
          avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
          body: text,
          time: 'Just now'
        };

        if (window.METAWIKI_FORUM_SERVICE) {
          commentObj = await window.METAWIKI_FORUM_SERVICE.createComment(activeThreadTopicId, text);
        }

        topic.repliesList = topic.repliesList || [];
        topic.repliesList.push(commentObj);
        topic.repliesCount = topic.repliesList.length;

        replyInput.value = '';
        renderThreadReplies(topic);
        renderForums();
      });
    }
  }

  function setupCreateTopicModalEvents() {
    const modal = document.getElementById('createForumModal');
    const openBtn = document.getElementById('forumCreateTopicBtn');
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
      publishBtn.addEventListener('click', async () => {
        const title = titleInput ? titleInput.value.trim() : '';
        const category = categorySelect ? categorySelect.value : 'Metaphysical Debate';
        const body = bodyInput ? bodyInput.value.trim() : '';

        if (!title || !body) {
          alert('Please provide a title and body for your discussion topic.');
          return;
        }

        publishBtn.disabled = true;
        publishBtn.innerHTML = `<i class="ph ph-spinner spinner" style="animation: spin 1s linear infinite;"></i> Publishing...`;

        let newTopic = null;
        if (window.METAWIKI_FORUM_SERVICE) {
          newTopic = await window.METAWIKI_FORUM_SERVICE.createPost(title, category, body);
        } else {
          const session = window.METAWIKI_AUTH ? window.METAWIKI_AUTH.getSession() : null;
          newTopic = {
            id: 'topic-' + Date.now(),
            title: title,
            category: category,
            author: session ? session.username : 'Campton',
            avatar: session ? session.avatar : 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
            body: body,
            repliesCount: 0,
            upvotes: 1,
            timestamp: 'Just now',
            repliesList: []
          };
        }

        const topics = getTopicsList();
        topics.unshift(newTopic);

        if (titleInput) titleInput.value = '';
        if (bodyInput) bodyInput.value = '';

        publishBtn.disabled = false;
        publishBtn.innerHTML = `Publish Discussion Topic`;

        closeModal();
        renderForums();
      });
    }
  }

  function renderForums() {
    const list = document.getElementById('forumTopicsList');
    if (!list) return;

    let storedVotes = {};
    try {
      storedVotes = JSON.parse(localStorage.getItem('metawiki_forum_votes')) || {};
    } catch(e) {}

    const allTopics = getTopicsList();
    const category = (window.state && window.state.forumCategory) || 'all';
    const countToDisplay = (window.state && window.state.forumVisibleCount) || 15;

    let filtered = allTopics;
    if (category !== 'all') {
      filtered = allTopics.filter(t => t.category && t.category.toLowerCase().includes(category.toLowerCase()));
    }

    const visibleItems = filtered.slice(0, countToDisplay);

    list.innerHTML = visibleItems.map((t, idx) => {
      const userVote = storedVotes[t.id] || 0;
      const netScore = (t.upvotes || 0) + userVote;
      const upvotedClass = userVote === 1 ? 'upvoted' : '';
      const downvotedClass = userVote === -1 ? 'downvoted' : '';

      return `
        <div class="forum-topic-card" data-id="${t.id}" style="animation: fadeIn 0.4s ease forwards; animation-delay: ${(idx % 15) * 0.03}s;">
          <div class="forum-vote-column">
            <button class="vote-btn vote-up ${upvotedClass}" data-id="${t.id}" title="Upvote Topic">
              <i class="ph ph-caret-up-bold"></i>
            </button>
            <span class="forum-net-score ${upvotedClass} ${downvotedClass}">${netScore}</span>
            <button class="vote-btn vote-down ${downvotedClass}" data-id="${t.id}" title="Downvote Topic">
              <i class="ph ph-caret-down-bold"></i>
            </button>
          </div>

          <div style="flex: 1;">
            <div class="forum-topic-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span class="forum-category-pill">${t.category || 'General'}</span>
              <span style="font-size: 0.78rem; color: var(--mw-text-muted);">${t.timestamp || t.time || 'Recently'}</span>
            </div>
            <div class="forum-topic-title">${t.title}</div>
            <div class="forum-topic-body">${t.body}</div>
            <div class="forum-topic-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.8rem;">
              <div class="forum-topic-author" style="display: flex; align-items: center; gap: 0.45rem;">
                <img src="${t.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.25);" alt="Avatar">
                <span style="font-weight: 700; color: #f2f3f5; font-size: 0.84rem;">${t.author || 'Campton'}</span>
              </div>
              <div style="display: flex; gap: 1rem; color: var(--mw-gold); font-weight: bold; font-size: 0.85rem;">
                <span>💬 ${t.repliesCount || (t.repliesList ? t.repliesList.length : 0)} replies</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Card click event -> open thread modal
    list.querySelectorAll('.forum-topic-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.vote-btn')) return;
        const topicId = card.getAttribute('data-id');
        openForumThreadModal(topicId);
      });
    });
  }

  async function initForums() {
    if (window.METAWIKI_FORUM_SERVICE) {
      try {
        const supaPosts = await window.METAWIKI_FORUM_SERVICE.fetchPosts();
        if (supaPosts && supaPosts.length > 0) {
          window.METAWIKI_DATA = window.METAWIKI_DATA || {};
          window.METAWIKI_DATA.forumTopics = supaPosts;
        }
      } catch (e) {}
    }

    setupCreateTopicModalEvents();
    setupThreadModalEvents();
    renderForums();
  }

  window.ForumsEngine = {
    initForums,
    renderForums,
    openForumThreadModal
  };

  window.initForums = initForums;

})(window);
