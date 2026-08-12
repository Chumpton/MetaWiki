/**
 * MetaWiki - Community Forums View Controller
 * Handles 2,000 forum discussion topics, category bubble filtering, upvoting, and thread reader modals.
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

  function openForumThreadModal(topicId) {
    const topics = (window.METAWIKI_DATA && window.METAWIKI_DATA.forumTopics) || [];
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
    if (authorAvatar) authorAvatar.src = topic.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
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
    if (countHeader) countHeader.textContent = `Replies (${replies.length})`;

    if (replies.length === 0) {
      container.innerHTML = `<div style="color: var(--mw-text-muted); font-size: 0.85rem; font-style: italic; text-align: center; padding: 1rem;">No responses yet. Be the first to share your insight!</div>`;
      return;
    }

    container.innerHTML = replies.map(r => `
      <div style="background: rgba(22, 17, 46, 0.6); border: 1px solid var(--mw-border); border-radius: 12px; padding: 1rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="${r.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;" alt="Avatar">
            <span style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem;">${r.author}</span>
          </div>
          <span style="font-size: 0.72rem; color: var(--mw-text-muted);">${r.time}</span>
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

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    }

    if (upvoteBtn) {
      upvoteBtn.addEventListener('click', () => {
        if (!activeThreadTopicId || !window.METAWIKI_DATA || !window.METAWIKI_DATA.forumTopics) return;
        const topic = window.METAWIKI_DATA.forumTopics.find(t => t.id === activeThreadTopicId);
        if (topic) {
          topic.upvotes = (topic.upvotes || 24) + 1;
          const upvotesCount = document.getElementById('threadUpvoteCount');
          if (upvotesCount) upvotesCount.textContent = topic.upvotes;
        }
      });
    }

    if (submitReplyBtn && replyInput) {
      submitReplyBtn.addEventListener('click', () => {
        const text = replyInput.value.trim();
        if (!text || !activeThreadTopicId || !window.METAWIKI_DATA || !window.METAWIKI_DATA.forumTopics) return;

        const topic = window.METAWIKI_DATA.forumTopics.find(t => t.id === activeThreadTopicId);
        if (!topic) return;

        const session = window.METAWIKI_DISCORD_BACKEND ? window.METAWIKI_DISCORD_BACKEND.getSession() : null;
        const authorName = session ? session.fullHandle : 'GnosticSeeker#1008';
        const authorAvatar = session ? session.avatar : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';

        if (!topic.repliesList) topic.repliesList = [];
        topic.repliesList.push({
          author: authorName,
          avatar: authorAvatar,
          time: 'Just now',
          body: text
        });

        topic.repliesCount = (topic.repliesCount || 0) + 1;
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
      publishBtn.addEventListener('click', () => {
        const title = titleInput ? titleInput.value.trim() : '';
        const category = categorySelect ? categorySelect.value : 'Metaphysical Debate';
        const body = bodyInput ? bodyInput.value.trim() : '';

        if (!title || !body) {
          alert('Please provide a title and body for your discussion topic.');
          return;
        }

        const session = window.METAWIKI_DISCORD_BACKEND ? window.METAWIKI_DISCORD_BACKEND.getSession() : null;
        const authorName = session ? session.fullHandle : 'GnosticSeeker#1008';
        const authorAvatar = session ? session.avatar : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';

        const newTopic = {
          id: 'topic-' + Date.now(),
          title: title,
          category: category,
          author: authorName,
          avatar: authorAvatar,
          body: body,
          repliesCount: 0,
          upvotes: 1,
          timestamp: 'Just now',
          repliesList: []
        };

        if (!window.METAWIKI_DATA.forumTopics) window.METAWIKI_DATA.forumTopics = [];
        window.METAWIKI_DATA.forumTopics.unshift(newTopic);

        if (titleInput) titleInput.value = '';
        if (bodyInput) bodyInput.value = '';

        closeModal();
        renderForums();
      });
    }
  }

  function renderForums() {
    const list = document.getElementById('forumTopicsList');
    const showMoreBtn = document.getElementById('showMoreForumsBtn');
    if (!list || !window.METAWIKI_DATA || !window.METAWIKI_DATA.forumTopics) return;

    let storedVotes = {};
    try {
      storedVotes = JSON.parse(localStorage.getItem('metawiki_forum_votes')) || {};
    } catch(e) {}

    const allTopics = window.METAWIKI_DATA.forumTopics;
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
        <div class="forum-topic-card" data-id="${t.id}" style="animation: fadeIn 0.4s ease forwards; animation-delay: ${(idx % 15) * 0.03}s; cursor: pointer;">
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
              <span class="forum-category-pill">${t.category}</span>
              <span style="font-size: 0.78rem; color: var(--mw-text-muted);">${t.timestamp || t.time || 'Recently'}</span>
            </div>
            <div class="forum-topic-title">${t.title}</div>
            <div class="forum-topic-body">${t.body}</div>
            <div class="forum-topic-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.8rem;">
              <div class="forum-topic-author">
                <div class="forum-author-avatar" style="background: ${t.avatarColor || '#10b981'};">${(t.author || 'S').charAt(0)}</div>
                <span>${t.author}</span>
              </div>
              <div style="display: flex; gap: 1rem; color: var(--mw-gold); font-weight: bold; font-size: 0.85rem;">
                <span>💬 ${t.repliesCount || t.replies || 0} replies</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.vote-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = btn.getAttribute('data-id');
        const currentVote = storedVotes[topicId] || 0;
        storedVotes[topicId] = currentVote === 1 ? 0 : 1;
        localStorage.setItem('metawiki_forum_votes', JSON.stringify(storedVotes));
        renderForums();
      });
    });

    list.querySelectorAll('.vote-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = btn.getAttribute('data-id');
        const currentVote = storedVotes[topicId] || 0;
        storedVotes[topicId] = currentVote === -1 ? 0 : -1;
        localStorage.setItem('metawiki_forum_votes', JSON.stringify(storedVotes));
        renderForums();
      });
    });

    list.querySelectorAll('.forum-topic-card').forEach(card => {
      card.addEventListener('click', () => {
        const topicId = card.getAttribute('data-id');
        if (topicId) openForumThreadModal(topicId);
      });
    });

    if (showMoreBtn) {
      if (countToDisplay >= filtered.length) {
        showMoreBtn.style.display = 'none';
      } else {
        showMoreBtn.style.display = 'inline-flex';
        showMoreBtn.querySelector('span').textContent = `Show More Discussions (Batch +15)`;
      }
    }
  }

  function setupForumCategoryBubbleFeed() {
    const bubbleBar = document.getElementById('forumCategoryFeedBar');
    const showMoreBtn = document.getElementById('showMoreForumsBtn');

    if (bubbleBar) {
      bubbleBar.querySelectorAll('.category-bubble-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          bubbleBar.querySelectorAll('.category-bubble-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const cat = btn.getAttribute('data-cat');
          if (!window.state) window.state = {};
          window.state.forumCategory = cat;
          window.state.forumVisibleCount = 15;
          renderForums();
        });
      });
    }

    if (showMoreBtn) {
      showMoreBtn.addEventListener('click', () => {
        if (!window.state) window.state = {};
        window.state.forumVisibleCount = (window.state.forumVisibleCount || 15) + 15;
        renderForums();
      });
    }

    renderForums();
  }

  function initForumView() {
    setupThreadModalEvents();
    setupCreateTopicModalEvents();
    setupForumCategoryBubbleFeed();
  }

  window.ForumsView = {
    openForumThreadModal,
    renderThreadReplies,
    setupThreadModalEvents,
    setupCreateTopicModalEvents,
    renderForums,
    setupForumCategoryBubbleFeed,
    initForumView
  };

  window.openForumThreadModal = openForumThreadModal;
  window.renderThreadReplies = renderThreadReplies;
  window.setupThreadModalEvents = setupThreadModalEvents;
  window.setupCreateTopicModalEvents = setupCreateTopicModalEvents;
  window.renderForums = renderForums;
  window.setupForumCategoryBubbleFeed = setupForumCategoryBubbleFeed;
  window.initForumEngine = initForumView;

})(window);
