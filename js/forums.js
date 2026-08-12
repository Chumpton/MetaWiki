/**
 * MetaWiki - Metaphysical Community Forums Engine (Reddit-Style Screen Mode & Feature Set)
 * Full-screen thread reader, left voting sidebar, u/Username author badges,
 * share & save buttons, threaded comments, and Supabase integration.
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

  function ensureRedditThreadModalExists() {
    let modal = document.getElementById('forumThreadModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'forumThreadModal';
      modal.className = 'discord-modal-overlay';
      modal.style.cssText = 'display: none; z-index: 10000; padding: 2rem 0; overflow-y: auto; background: rgba(0, 0, 0, 0.88); backdrop-filter: blur(14px);';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="reddit-thread-container" style="max-width: 940px; width: 94%; margin: 1rem auto; background: #0f111a; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 14px; box-shadow: 0 25px 70px rgba(0,0,0,0.95); font-family: var(--font-sans-wiki); overflow: hidden; display: flex; flex-direction: column;">
        
        <!-- REDDIT SUBREDDIT / TOPIC HEADER -->
        <div style="padding: 0.8rem 1.4rem; background: #161924; border-bottom: 1px solid rgba(255, 255, 255, 0.12); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <span id="threadCategoryPill" style="font-size: 0.78rem; font-weight: 800; color: #a855f7; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.35); padding: 0.25rem 0.75rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">r/Metaphysics</span>
            <span style="color: #64748b; font-size: 0.82rem;">• Posted by</span>
            <div style="display: flex; align-items: center; gap: 0.45rem;">
              <img id="threadAuthorAvatar" src="https://cdn.discordapp.com/embed/avatars/0.png" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid #fbbf24;" alt="Author">
              <span id="threadAuthorName" style="color: #ffffff; font-weight: 700; font-size: 0.88rem;">u/Campton</span>
            </div>
            <span id="threadTime" style="color: #64748b; font-size: 0.8rem;">Today</span>
          </div>
          <button id="closeForumThreadModalBtn" style="background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; padding: 0.2rem; line-height: 1;" title="Close (Esc)">✕</button>
        </div>

        <!-- REDDIT MAIN THREAD BODY & VOTING COLUMN -->
        <div style="display: flex; padding: 1.6rem; gap: 1.4rem; background: #0f111a;">
          
          <!-- LEFT VOTING COLUMN -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.35rem; min-width: 44px; padding-top: 0.2rem;">
            <button id="upvoteThreadBtn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #94a3b8; border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; cursor: pointer; transition: all 0.2s ease;" title="Upvote">
              <i class="ph ph-caret-up-bold"></i>
            </button>
            <span id="threadUpvoteCount" style="font-weight: 800; font-size: 0.98rem; color: #fbbf24; margin: 0.1rem 0;">12</span>
            <button id="downvoteThreadBtn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #94a3b8; border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; cursor: pointer; transition: all 0.2s ease;" title="Downvote">
              <i class="ph ph-caret-down-bold"></i>
            </button>
          </div>

          <!-- MAIN THREAD CONTENT COLUMN -->
          <div style="flex: 1; min-width: 0;">
            <h1 id="threadTitle" style="color: #ffffff; font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; margin: 0 0 1rem 0; line-height: 1.35; letter-spacing: -0.01em;">Discussion Title</h1>
            <div id="threadBody" style="color: #cbd5e1; font-size: 0.98rem; line-height: 1.7; white-space: pre-wrap; margin-bottom: 1.6rem; font-family: var(--font-sans-wiki);">Post body content...</div>

            <!-- REDDIT INTERACTIVE ACTION BAR -->
            <div style="display: flex; align-items: center; gap: 0.85rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.12); margin-bottom: 1.8rem; flex-wrap: wrap;">
              <button style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; padding: 0.45rem 1rem; border-radius: 20px; font-weight: 700; font-size: 0.82rem; display: flex; align-items: center; gap: 0.45rem; cursor: pointer;">
                <i class="ph ph-chat-teardrop-dots" style="color: #a855f7; font-size: 1rem;"></i> <span id="threadRepliesHeaderCount">Replies (0)</span>
              </button>
              <button id="shareThreadBtn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; padding: 0.45rem 1rem; border-radius: 20px; font-weight: 700; font-size: 0.82rem; display: flex; align-items: center; gap: 0.45rem; cursor: pointer;">
                <i class="ph ph-share-network" style="font-size: 1rem;"></i> Share Link
              </button>
              <button id="saveThreadBtn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; padding: 0.45rem 1rem; border-radius: 20px; font-weight: 700; font-size: 0.82rem; display: flex; align-items: center; gap: 0.45rem; cursor: pointer;">
                <i class="ph ph-bookmark-simple" style="font-size: 1rem;"></i> Save
              </button>
            </div>

            <!-- REDDIT COMMENT INPUT AREA -->
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; padding: 1.1rem; margin-bottom: 2rem;">
              <div style="font-size: 0.82rem; color: #94a3b8; font-weight: 700; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>Comment as</span>
                <span id="commentAsUserLabel" style="color: #ffffff; font-weight: 800;">u/Campton</span>
              </div>
              <textarea id="threadReplyInput" style="width: 100%; height: 90px; padding: 0.75rem 0.85rem; background: #000000; border: 1px solid rgba(255,255,255,0.22); border-radius: 8px; color: #ffffff; font-size: 0.92rem; outline: none; font-family: var(--font-sans-wiki); resize: vertical; line-height: 1.5;" placeholder="What are your metaphysical contemplations on this topic?"></textarea>
              <div style="display: flex; justify-content: flex-end; margin-top: 0.75rem;">
                <button id="submitThreadReplyBtn" style="padding: 0.6rem 1.5rem; background: #a855f7; color: #ffffff; border: none; border-radius: 20px; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; transition: background 0.2s ease; box-shadow: 0 4px 14px rgba(168, 85, 247, 0.35);">
                  <i class="ph ph-paper-plane-right"></i> Comment
                </button>
              </div>
            </div>

            <!-- REDDIT COMMENT TREE CONTAINER -->
            <div id="threadRepliesContainer" style="display: flex; flex-direction: column; gap: 0.9rem;">
              <!-- Dynamically rendered replies -->
            </div>

          </div>
        </div>

      </div>
    `;

    setupThreadModalEvents();
  }

  async function openForumThreadModal(topicId) {
    ensureRedditThreadModalExists();

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
    const commentUserLabel = document.getElementById('commentAsUserLabel');

    const session = window.METAWIKI_AUTH ? window.METAWIKI_AUTH.getSession() : null;
    if (commentUserLabel) commentUserLabel.textContent = `u/${session ? session.username : 'Campton'}`;

    const catName = topic.category || 'Metaphysical Debate';
    if (category) category.textContent = catName.startsWith('r/') ? catName : `r/${catName.replace(/\s+/g, '')}`;
    if (title) title.textContent = topic.title;
    if (time) time.textContent = topic.time || topic.timestamp || 'Recently';
    if (authorAvatar) authorAvatar.src = topic.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
    if (authorName) authorName.textContent = `u/${topic.author || 'Campton'}`;
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
      container.innerHTML = `<div style="color: var(--mw-text-muted); font-size: 0.88rem; font-style: italic; text-align: center; padding: 1.5rem; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">No responses yet. Be the first to share your contemplation!</div>`;
      return;
    }

    container.innerHTML = replies.map(r => `
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 1rem; transition: border-color 0.2s ease;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.55rem;">
          <div style="display: flex; align-items: center; gap: 0.55rem;">
            <img src="${r.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.25);" alt="Avatar">
            <span style="font-weight: 700; color: #f2f3f5; font-size: 0.88rem;">u/${r.author}</span>
          </div>
          <span style="font-size: 0.72rem; color: #64748b;">${r.time || 'Just now'}</span>
        </div>
        <p style="font-size: 0.9rem; color: #cbd5e1; line-height: 1.55; margin: 0; white-space: pre-wrap;">${r.body}</p>
      </div>
    `).join('');
  }

  function setupThreadModalEvents() {
    const modal = document.getElementById('forumThreadModal');
    const closeBtn = document.getElementById('closeForumThreadModalBtn');
    const upvoteBtn = document.getElementById('upvoteThreadBtn');
    const downvoteBtn = document.getElementById('downvoteThreadBtn');
    const shareBtn = document.getElementById('shareThreadBtn');
    const saveBtn = document.getElementById('saveThreadBtn');
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

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const url = window.location.origin + window.location.pathname + '#forum-' + activeThreadTopicId;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url);
          shareBtn.innerHTML = `<i class="ph ph-check" style="color: #4ade80;"></i> Link Copied!`;
          setTimeout(() => {
            shareBtn.innerHTML = `<i class="ph ph-share-network"></i> Share Link`;
          }, 1500);
        }
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        saveBtn.innerHTML = `<i class="ph ph-bookmark-simple-fill" style="color: #fbbf24;"></i> Saved!`;
        setTimeout(() => {
          saveBtn.innerHTML = `<i class="ph ph-bookmark-simple"></i> Save`;
        }, 1500);
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

    if (downvoteBtn) {
      downvoteBtn.addEventListener('click', () => {
        if (!activeThreadTopicId) return;
        const topics = getTopicsList();
        const topic = topics.find(t => t.id === activeThreadTopicId);
        if (topic && topic.upvotes > 0) {
          topic.upvotes = topic.upvotes - 1;
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
              <span class="forum-category-pill">r/${(t.category || 'General').replace(/\s+/g, '')}</span>
              <span style="font-size: 0.78rem; color: var(--mw-text-muted);">${t.timestamp || t.time || 'Recently'}</span>
            </div>
            <div class="forum-topic-title">${t.title}</div>
            <div class="forum-topic-body">${t.body}</div>
            <div class="forum-topic-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.8rem;">
              <div class="forum-topic-author" style="display: flex; align-items: center; gap: 0.45rem;">
                <img src="${t.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.25);" alt="Avatar">
                <span style="font-weight: 700; color: #f2f3f5; font-size: 0.84rem;">u/${t.author || 'Campton'}</span>
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

    ensureRedditThreadModalExists();
    setupCreateTopicModalEvents();
    renderForums();
  }

  window.ForumsEngine = {
    initForums,
    renderForums,
    openForumThreadModal
  };

  window.initForums = initForums;

})(window);
