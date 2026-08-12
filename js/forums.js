/**
 * MetaWiki - Metaphysical Community Forums Engine
 * Single Reddit-style upvote arrow, 1 official Campton test post, clean categories & handles,
 * sleek comment box, optimistic front-end posting, and persistent backend API routes.
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

  // 1 Single Official Test Post from Campton in the backend
  const OFFICIAL_CAMPTON_TEST_POST = {
    id: 'topic-campton-official',
    title: 'Welcome to MetaWiki Community — Consciousness & Hermetic Contemplations',
    category: 'Metaphysical Debate',
    author: 'Campton',
    avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
    handle: '@campton',
    body: 'Welcome to the official MetaWiki community forums! Here we explore non-dual perception, Dr. David R. Hawkins\' consciousness calibrations, Hermetic mechanics, and perennial philosophy. Feel free to start a discussion or leave a reply.',
    repliesCount: 1,
    upvotes: 42,
    timestamp: 'Just now',
    repliesList: [
      {
        id: 'reply-init-1',
        author: 'Campton',
        avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
        body: 'All posts, replies, and upvotes are linked directly to your authenticated user profile.',
        time: 'Just now'
      }
    ]
  };

  const DEFAULT_AUTHENTIC_TOPICS = [
    OFFICIAL_CAMPTON_TEST_POST
  ];

  function getTopicsList() {
    if (!window.METAWIKI_DATA) window.METAWIKI_DATA = {};

    if (!window.METAWIKI_DATA.forumTopics || window.METAWIKI_DATA.forumTopics.length === 0) {
      let storedTopics = [];
      try {
        storedTopics = JSON.parse(localStorage.getItem('metawiki_local_forum_topics')) || [];
      } catch(e) {}

      window.METAWIKI_DATA.forumTopics = storedTopics.length > 0 ? storedTopics : [...DEFAULT_AUTHENTIC_TOPICS];
    }

    return window.METAWIKI_DATA.forumTopics;
  }

  function cleanCategoryName(cat) {
    if (!cat) return 'Metaphysical Debate';
    return String(cat).replace(/^r\//i, '').trim();
  }

  function cleanUsername(name) {
    if (!name) return 'Campton';
    return String(name).replace(/^u\//i, '').replace(/^@/, '').trim();
  }

  function ensureForumModalsExist() {
    // 1. Thread Reader Modal Overlay
    let threadModal = document.getElementById('forumThreadModal');
    if (!threadModal) {
      threadModal = document.createElement('div');
      threadModal.id = 'forumThreadModal';
      threadModal.className = 'discord-modal-overlay';
      if (threadModal.style) {
        threadModal.style.cssText = 'display: none; z-index: 10000; padding: 2rem 0; overflow-y: auto; background: rgba(0, 0, 0, 0.88); backdrop-filter: blur(14px);';
      }
      if (document.body) document.body.appendChild(threadModal);
    }

    threadModal.innerHTML = `
      <div class="reddit-thread-container" style="max-width: 940px; width: 94%; margin: 1rem auto; background: #0f111a; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 14px; box-shadow: 0 25px 70px rgba(0,0,0,0.95); font-family: var(--font-sans-wiki); overflow: hidden; display: flex; flex-direction: column;">
        
        <!-- TOPIC HEADER BAR -->
        <div style="padding: 0.85rem 1.4rem; background: #161924; border-bottom: 1px solid rgba(255, 255, 255, 0.12); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <span id="threadCategoryPill" style="font-size: 0.78rem; font-weight: 800; color: #a855f7; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.35); padding: 0.25rem 0.75rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">Metaphysical Debate</span>
            <span style="color: #64748b; font-size: 0.82rem;">• Posted by</span>
            <div style="display: flex; align-items: center; gap: 0.45rem;">
              <img id="threadAuthorAvatar" src="https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid #fbbf24;" alt="Author">
              <span id="threadAuthorName" style="color: #ffffff; font-weight: 700; font-size: 0.88rem;">@Campton</span>
            </div>
            <span id="threadTime" style="color: #64748b; font-size: 0.8rem;">Today</span>
          </div>
          <button id="closeForumThreadModalBtn" style="background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; padding: 0.2rem; line-height: 1;" title="Close (Esc)">✕</button>
        </div>

        <!-- MAIN THREAD BODY & ACTION BAR -->
        <div style="display: flex; padding: 1.6rem; gap: 1.4rem; background: #0f111a;">
          
          <!-- MAIN THREAD CONTENT COLUMN -->
          <div style="flex: 1; min-width: 0;">
            <h1 id="threadTitle" style="color: #ffffff; font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; margin: 0 0 1rem 0; line-height: 1.35; letter-spacing: -0.01em;">Discussion Title</h1>
            <div id="threadBody" style="color: #cbd5e1; font-size: 0.98rem; line-height: 1.7; white-space: pre-wrap; margin-bottom: 1.6rem; font-family: var(--font-sans-wiki);">Post body content...</div>

            <!-- ACTION BAR WITH SINGLE REDDIT-STYLE UPVOTE PILL -->
            <div style="display: flex; align-items: center; gap: 0.85rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.12); margin-bottom: 1.8rem; flex-wrap: wrap;">
              
              <!-- SINGLE UPVOTE PILL BUTTON -->
              <button id="upvoteThreadBtn" style="background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.35); color: #a855f7; padding: 0.45rem 1.1rem; border-radius: 20px; font-weight: 800; font-size: 0.88rem; display: flex; align-items: center; gap: 0.45rem; cursor: pointer; transition: all 0.2s ease;" title="Upvote Topic">
                <i class="ph ph-arrow-fat-up-fill" style="font-size: 1.1rem;"></i>
                <span id="threadUpvoteCount">42</span>
              </button>

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

            <!-- SLEEK REDDIT-STYLE COMMENT INPUT BOX -->
            <div class="sleek-comment-box-wrapper" style="background: rgba(20, 22, 34, 0.85); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px; padding: 1.2rem; margin-bottom: 2.2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: border-color 0.25s ease;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <img id="commentUserAvatar" src="https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1px solid var(--mw-gold);" alt="Avatar">
                  <span style="font-size: 0.82rem; color: #94a3b8; font-weight: 700;">Comment as <strong id="commentAsUserLabel" style="color: #ffffff; font-weight: 800;">@Campton</strong></span>
                </div>
                <span style="font-size: 0.75rem; color: #64748b;">Press <kbd style="background: rgba(255,255,255,0.1); padding: 0.15rem 0.4rem; border-radius: 4px; color: #cbd5e1; font-family: monospace;">Ctrl + Enter</kbd> to submit</span>
              </div>
              
              <textarea id="threadReplyInput" style="width: 100%; height: 95px; padding: 0.85rem; background: #070913; border: 1px solid rgba(255,255,255,0.18); border-radius: 8px; color: #ffffff; font-size: 0.95rem; outline: none; font-family: var(--font-sans-wiki); resize: vertical; line-height: 1.6; transition: border-color 0.2s ease, box-shadow 0.2s ease;" placeholder="What are your metaphysical contemplations on this topic?"></textarea>
              
              <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 0.85rem; gap: 0.75rem;">
                <span id="commentStatusMsg" style="font-size: 0.8rem; color: #4ade80; opacity: 0; transition: opacity 0.3s ease; font-weight: 700; display: flex; align-items: center; gap: 0.3rem;">
                  <i class="ph ph-check-circle"></i> Comment posted!
                </span>
                <button id="submitThreadReplyBtn" style="padding: 0.65rem 1.6rem; background: linear-gradient(135deg, #a855f7, #7e22ce); color: #ffffff; border: none; border-radius: 20px; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.25s ease; box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);">
                  <i class="ph ph-paper-plane-right" style="font-size: 1.05rem;"></i> Comment
                </button>
              </div>
            </div>

            <!-- COMMENT TREE CONTAINER -->
            <div id="threadRepliesContainer" style="display: flex; flex-direction: column; gap: 0.9rem;">
              <!-- Dynamically rendered replies -->
            </div>

          </div>
        </div>

      </div>
    `;

    // 2. Create Topic Modal Overlay
    let createModal = document.getElementById('createForumModal');
    if (!createModal) {
      createModal = document.createElement('div');
      createModal.id = 'createForumModal';
      createModal.className = 'discord-modal-overlay';
      if (createModal.style) {
        createModal.style.cssText = 'display: none; z-index: 10000; padding: 2rem 0; overflow-y: auto; background: rgba(0, 0, 0, 0.88); backdrop-filter: blur(14px);';
      }
      if (document.body) document.body.appendChild(createModal);
    }

    createModal.innerHTML = `
      <div style="max-width: 600px; width: 92%; margin: 2rem auto; background: #0f111a; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 14px; box-shadow: 0 25px 70px rgba(0,0,0,0.95); font-family: var(--font-sans-wiki); padding: 1.8rem; color: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.8rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: #ffffff; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ph ph-plus-circle" style="color: #a855f7;"></i> Start a Community Discussion
          </h3>
          <button id="closeCreateForumModalBtn" style="background: none; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer;">✕</button>
        </div>

        <div style="margin-bottom: 1.2rem;">
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: var(--mw-gold); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.5px;">Discussion Title</label>
          <input type="text" id="newTopicTitle" placeholder="e.g., Contemplating Non-Dual Perception and Consciousness Calibration" style="width: 100%; padding: 0.75rem; background: #000000; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #ffffff; font-size: 0.95rem; outline: none; font-family: var(--font-sans-wiki);">
        </div>

        <div style="margin-bottom: 1.2rem;">
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: var(--mw-gold); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.5px;">Category</label>
          <select id="newTopicCategory" style="width: 100%; padding: 0.75rem; background: #000000; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #ffffff; font-size: 0.95rem; outline: none; font-family: var(--font-sans-wiki); cursor: pointer;">
            <option value="Metaphysical Debate">🏛️ Metaphysical Debate</option>
            <option value="Meditation Practices">🧘 Meditation Practices</option>
            <option value="Depth Psychology">🎭 Depth Psychology</option>
            <option value="Non-Dual Contemplations">☯️ Non-Dual Contemplations</option>
            <option value="Sacred Mechanics">🔮 Sacred Mechanics</option>
            <option value="Hawkins LoC Debates">⚡ Hawkins LoC Debates</option>
            <option value="Hermetic Scholarship">📜 Hermetic Scholarship</option>
          </select>
        </div>

        <div style="margin-bottom: 1.6rem;">
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: var(--mw-gold); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.5px;">Discussion Content / Contemplation</label>
          <textarea id="newTopicBody" placeholder="Share your metaphysical insights, active imagination observations, or questions for the community..." style="width: 100%; height: 140px; padding: 0.75rem; background: #000000; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #ffffff; font-size: 0.92rem; outline: none; font-family: var(--font-sans-wiki); resize: vertical; line-height: 1.5;"></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.8rem;">
          <button id="cancelCreateTopicBtn" style="padding: 0.6rem 1.2rem; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #cbd5e1; border-radius: 8px; font-weight: 700; cursor: pointer;">Cancel</button>
          <button id="publishNewTopicBtn" style="padding: 0.6rem 1.5rem; background: #a855f7; color: #ffffff; border: none; border-radius: 8px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 14px rgba(168, 85, 247, 0.35);">Publish Discussion Topic</button>
        </div>
      </div>
    `;

    setupThreadModalEvents();
    setupCreateTopicModalEvents();
  }

  async function openForumThreadModal(topicId) {
    ensureForumModalsExist();

    const topics = getTopicsList();
    let topic = topics.find(t => String(t.id) === String(topicId));
    if (!topic) {
      topic = topics[0];
    }
    if (!topic) return;

    activeThreadTopicId = topic.id;

    const modal = document.getElementById('forumThreadModal');
    const title = document.getElementById('threadTitle');
    const category = document.getElementById('threadCategoryPill');
    const time = document.getElementById('threadTime');
    const authorAvatar = document.getElementById('threadAuthorAvatar');
    const authorName = document.getElementById('threadAuthorName');
    const body = document.getElementById('threadBody');
    const upvotesCount = document.getElementById('threadUpvoteCount');
    const upvoteBtn = document.getElementById('upvoteThreadBtn');
    const commentUserLabel = document.getElementById('commentAsUserLabel');
    const commentUserAvatar = document.getElementById('commentUserAvatar');

    const session = window.METAWIKI_AUTH ? window.METAWIKI_AUTH.getSession() : null;
    const activeUsername = session ? session.username : 'Campton';
    const activeAvatar = session ? session.avatar : 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256';

    if (commentUserLabel) commentUserLabel.textContent = `@${cleanUsername(activeUsername)}`;
    if (commentUserAvatar) commentUserAvatar.src = activeAvatar;

    if (category) category.textContent = cleanCategoryName(topic.category);
    if (title) title.textContent = topic.title;
    if (time) time.textContent = topic.time || topic.timestamp || 'Recently';
    if (authorAvatar) authorAvatar.src = topic.avatar || 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256';
    if (authorName) authorName.textContent = `@${cleanUsername(topic.author)}`;
    if (body) body.textContent = topic.body;

    let storedVotes = {};
    try { storedVotes = JSON.parse(localStorage.getItem('metawiki_forum_votes')) || {}; } catch(e) {}
    const userVote = storedVotes[topic.id] || 0;
    if (upvotesCount) upvotesCount.textContent = (topic.upvotes || 1) + userVote;
    if (upvoteBtn) {
      if (userVote === 1) {
        upvoteBtn.style.background = 'linear-gradient(135deg, #a855f7, #7e22ce)';
        upvoteBtn.style.color = '#ffffff';
        upvoteBtn.style.borderColor = '#a855f7';
      } else {
        upvoteBtn.style.background = 'rgba(168, 85, 247, 0.15)';
        upvoteBtn.style.color = '#a855f7';
        upvoteBtn.style.borderColor = 'rgba(168, 85, 247, 0.35)';
      }
    }

    // Load locally saved replies from localStorage if any
    try {
      const localCommentsMap = JSON.parse(localStorage.getItem('metawiki_local_comments')) || {};
      if (localCommentsMap[topic.id] && localCommentsMap[topic.id].length > 0) {
        topic.repliesList = localCommentsMap[topic.id];
      }
    } catch(e) {}

    // Fetch live replies from Supabase backend if available
    if (window.METAWIKI_FORUM_SERVICE) {
      try {
        const supaComments = await window.METAWIKI_FORUM_SERVICE.fetchComments(topic.id);
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
      container.innerHTML = `<div style="color: var(--mw-text-muted); font-size: 0.88rem; font-style: italic; text-align: center; padding: 1.6rem; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">No responses yet. Be the first to share your contemplation!</div>`;
      return;
    }

    container.innerHTML = replies.map(r => `
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 1rem; transition: border-color 0.2s ease;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.55rem;">
          <div style="display: flex; align-items: center; gap: 0.55rem;">
            <img src="${r.avatar || 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256'}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.25);" alt="Avatar">
            <span style="font-weight: 700; color: #f2f3f5; font-size: 0.88rem;">@${cleanUsername(r.author)}</span>
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
    const shareBtn = document.getElementById('shareThreadBtn');
    const saveBtn = document.getElementById('saveThreadBtn');
    const submitReplyBtn = document.getElementById('submitThreadReplyBtn');
    const replyInput = document.getElementById('threadReplyInput');

    function closeModal() {
      if (modal) modal.style.display = 'none';
      activeThreadTopicId = null;
    }

    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      };
    }
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) {
          e.preventDefault();
          e.stopPropagation();
          closeModal();
        }
      };
    }

    if (shareBtn) {
      shareBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = window.location.origin + window.location.pathname + '#forum-' + activeThreadTopicId;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url);
          shareBtn.innerHTML = `<i class="ph ph-check" style="color: #4ade80;"></i> Link Copied!`;
          setTimeout(() => {
            shareBtn.innerHTML = `<i class="ph ph-share-network"></i> Share Link`;
          }, 1500);
        }
      };
    }

    if (saveBtn) {
      saveBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        saveBtn.innerHTML = `<i class="ph ph-bookmark-simple-fill" style="color: #fbbf24;"></i> Saved!`;
        setTimeout(() => {
          saveBtn.innerHTML = `<i class="ph ph-bookmark-simple"></i> Save`;
        }, 1500);
      };
    }

    if (upvoteBtn) {
      upvoteBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!activeThreadTopicId) return;

        let storedVotes = {};
        try { storedVotes = JSON.parse(localStorage.getItem('metawiki_forum_votes')) || {}; } catch(err) {}

        const topics = getTopicsList();
        const topic = topics.find(t => String(t.id) === String(activeThreadTopicId));
        if (topic) {
          const currentVote = storedVotes[topic.id] || 0;
          const newVote = currentVote === 1 ? 0 : 1;
          storedVotes[topic.id] = newVote;
          localStorage.setItem('metawiki_forum_votes', JSON.stringify(storedVotes));

          const upvotesCount = document.getElementById('threadUpvoteCount');
          if (upvotesCount) upvotesCount.textContent = (topic.upvotes || 1) + newVote;

          if (newVote === 1) {
            upvoteBtn.style.background = 'linear-gradient(135deg, #a855f7, #7e22ce)';
            upvoteBtn.style.color = '#ffffff';
            upvoteBtn.style.borderColor = '#a855f7';
          } else {
            upvoteBtn.style.background = 'rgba(168, 85, 247, 0.15)';
            upvoteBtn.style.color = '#a855f7';
            upvoteBtn.style.borderColor = 'rgba(168, 85, 247, 0.35)';
          }

          renderForums();
        }
      };
    }

    // Optimistic Comment Submission Engine
    async function submitCommentOptimistically() {
      if (!replyInput || !activeThreadTopicId) return;

      const text = replyInput.value.trim();
      if (!text) {
        replyInput.focus();
        replyInput.style.borderColor = '#ef4444';
        setTimeout(() => { replyInput.style.borderColor = 'rgba(255,255,255,0.18)'; }, 1200);
        return;
      }

      const topics = getTopicsList();
      const topic = topics.find(t => String(t.id) === String(activeThreadTopicId));
      if (!topic) return;

      const session = window.METAWIKI_AUTH ? window.METAWIKI_AUTH.getSession() : null;
      const authorName = session ? session.username : 'Campton';
      const authorAvatar = session ? session.avatar : 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256';

      const newComment = {
        id: 'reply-' + Date.now(),
        author: authorName,
        avatar: authorAvatar,
        handle: `@${cleanUsername(authorName)}`,
        body: text,
        time: 'Just now'
      };

      // 1. INSTANT OPTIMISTIC FRONT-END UPDATE
      topic.repliesList = topic.repliesList || [];
      topic.repliesList.push(newComment);
      topic.repliesCount = topic.repliesList.length;

      replyInput.value = '';
      renderThreadReplies(topic);
      renderForums();

      // Show temporary success feedback
      const statusMsg = document.getElementById('commentStatusMsg');
      if (statusMsg) {
        statusMsg.style.opacity = '1';
        setTimeout(() => { statusMsg.style.opacity = '0'; }, 2200);
      }

      // Smooth scroll to newly added comment
      const container = document.getElementById('threadRepliesContainer');
      if (container && container.lastElementChild) {
        container.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // 2. BACKEND PERSISTENCE & ASYNC API SYNC
      try {
        let localComments = {};
        try { localComments = JSON.parse(localStorage.getItem('metawiki_local_comments')) || {}; } catch(e){}
        localComments[topic.id] = topic.repliesList;
        localStorage.setItem('metawiki_local_comments', JSON.stringify(localComments));
      } catch(e){}

      if (window.METAWIKI_FORUM_SERVICE) {
        try {
          window.METAWIKI_FORUM_SERVICE.createComment(topic.id, text).catch(() => {});
        } catch (e) {}
      }
    }

    if (submitReplyBtn) {
      submitReplyBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        submitCommentOptimistically();
      };
    }

    if (replyInput) {
      replyInput.onkeydown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          submitCommentOptimistically();
        }
      };
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

    if (openBtn) openBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); openModal(); };
    if (closeBtn) closeBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); closeModal(); };
    if (cancelBtn) cancelBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); closeModal(); };
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) {
          e.preventDefault();
          e.stopPropagation();
          closeModal();
        }
      };
    }

    if (publishBtn) {
      publishBtn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const title = titleInput ? titleInput.value.trim() : '';
        const category = categorySelect ? categorySelect.value : 'Metaphysical Debate';
        const body = bodyInput ? bodyInput.value.trim() : '';

        if (!title || !body) {
          alert('Please provide a title and body for your discussion topic.');
          return;
        }

        publishBtn.disabled = true;
        publishBtn.innerHTML = `<i class="ph ph-spinner spinner" style="animation: spin 1s linear infinite;"></i> Publishing...`;

        const session = window.METAWIKI_AUTH ? window.METAWIKI_AUTH.getSession() : null;
        const authorName = session ? session.username : 'Campton';
        const authorAvatar = session ? session.avatar : 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256';

        const newTopic = {
          id: 'topic-' + Date.now(),
          title: title,
          category: cleanCategoryName(category),
          author: authorName,
          avatar: authorAvatar,
          handle: `@${cleanUsername(authorName)}`,
          body: body,
          repliesCount: 0,
          upvotes: 1,
          timestamp: 'Just now',
          repliesList: []
        };

        const topics = getTopicsList();
        topics.unshift(newTopic);

        // Save new topic permanently to localStorage
        try {
          localStorage.setItem('metawiki_local_forum_topics', JSON.stringify(topics));
        } catch(err) {}

        // Async sync with Supabase Forum Service
        if (window.METAWIKI_FORUM_SERVICE) {
          try {
            window.METAWIKI_FORUM_SERVICE.createPost(title, category, body).catch(() => {});
          } catch(err) {}
        }

        if (titleInput) titleInput.value = '';
        if (bodyInput) bodyInput.value = '';

        publishBtn.disabled = false;
        publishBtn.innerHTML = `Publish Discussion Topic`;

        closeModal();
        renderForums();
      };
    }
  }

  function setupForumCategoryBubbleFeed() {
    const bubbleBar = document.getElementById('forumCategoryFeedBar');
    const showMoreBtn = document.getElementById('showMoreForumsBtn');

    if (bubbleBar) {
      bubbleBar.querySelectorAll('.category-bubble-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          bubbleBar.querySelectorAll('.category-bubble-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const cat = btn.getAttribute('data-cat') || 'all';
          if (!window.state) window.state = {};
          window.state.forumCategory = cat;
          window.state.forumVisibleCount = 15;
          renderForums();
        });
      });
    }

    if (showMoreBtn) {
      showMoreBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.state) window.state = {};
        window.state.forumVisibleCount = (window.state.forumVisibleCount || 15) + 15;
        renderForums();
      };
    }
  }

  function renderForums() {
    ensureForumModalsExist();

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
      const cleanCat = category.toLowerCase().trim();
      filtered = allTopics.filter(t => {
        if (!t.category) return false;
        const cat = t.category.toLowerCase().trim();
        return cat.includes(cleanCat) || cleanCat.includes(cat);
      });
    }

    if (filtered.length === 0) {
      filtered = allTopics;
    }

    const visibleItems = filtered.slice(0, countToDisplay);

    list.innerHTML = visibleItems.map((t, idx) => {
      const userVote = storedVotes[t.id] || 0;
      const netScore = (t.upvotes || 0) + userVote;
      const upvotedClass = userVote === 1 ? 'upvoted' : '';

      return `
        <div class="forum-topic-card" data-id="${t.id}" style="animation: fadeIn 0.4s ease forwards; animation-delay: ${(idx % 15) * 0.03}s; cursor: pointer; margin-bottom: 1.2rem; background: rgba(22, 17, 46, 0.7); border: 1px solid var(--mw-border); border-radius: 12px; padding: 1.3rem; display: flex; flex-direction: column; gap: 0.75rem;">
          
          <!-- TOPIC CATEGORY & TIME -->
          <div class="forum-topic-header" style="display: flex; justify-content: space-between; align-items: center;">
            <span class="forum-category-pill" style="font-size: 0.76rem; font-weight: 800; color: #a855f7; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); padding: 0.25rem 0.7rem; border-radius: 20px;">${cleanCategoryName(t.category)}</span>
            <span style="font-size: 0.78rem; color: var(--mw-text-muted);">${t.timestamp || t.time || 'Recently'}</span>
          </div>

          <!-- TOPIC TITLE & BODY -->
          <div class="forum-topic-title" style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #ffffff; margin: 0.1rem 0;">${t.title}</div>
          <div class="forum-topic-body" style="font-size: 0.9rem; color: var(--mw-text-muted); line-height: 1.55; margin-bottom: 0.4rem;">${t.body}</div>

          <!-- TOPIC FOOTER: AUTHOR & SINGLE REDDIT-STYLE UPVOTE BUTTON -->
          <div class="forum-topic-footer" style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.06);">
            
            <div class="forum-topic-author" style="display: flex; align-items: center; gap: 0.5rem;">
              <img src="${t.avatar || 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256'}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.25);" alt="Avatar">
              <span style="font-weight: 700; color: #f2f3f5; font-size: 0.86rem;">@${cleanUsername(t.author)}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <!-- SINGLE REDDIT-STYLE UPVOTE PILL -->
              <button class="vote-btn vote-up ${upvotedClass}" data-id="${t.id}" title="Upvote Topic" style="background: ${userVote === 1 ? 'linear-gradient(135deg, #a855f7, #7e22ce)' : 'rgba(168, 85, 247, 0.15)'}; border: 1px solid ${userVote === 1 ? '#a855f7' : 'rgba(168, 85, 247, 0.35)'}; color: ${userVote === 1 ? '#ffffff' : '#a855f7'}; padding: 0.35rem 0.85rem; border-radius: 20px; font-weight: 800; font-size: 0.82rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; transition: all 0.2s ease;">
                <i class="ph ph-arrow-fat-up-fill" style="font-size: 0.95rem;"></i>
                <span class="forum-net-score">${netScore}</span>
              </button>

              <span style="color: var(--mw-gold); font-weight: bold; font-size: 0.84rem; display: flex; align-items: center; gap: 0.35rem;">
                <i class="ph ph-chat-teardrop-dots" style="color: #a855f7;"></i> ${t.repliesCount || (t.repliesList ? t.repliesList.length : 0)} replies
              </span>
            </div>

          </div>

        </div>
      `;
    }).join('');

    // Upvote button handlers
    list.querySelectorAll('.vote-up').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const topicId = btn.getAttribute('data-id');
        const topic = getTopicsList().find(t => String(t.id) === String(topicId));
        if (topic) {
          const currentVote = storedVotes[topicId] || 0;
          storedVotes[topicId] = currentVote === 1 ? 0 : 1;
          localStorage.setItem('metawiki_forum_votes', JSON.stringify(storedVotes));
          renderForums();
        }
      };
    });

    // Card click event -> open thread modal
    list.querySelectorAll('.forum-topic-card').forEach(card => {
      card.onclick = (e) => {
        if (e.target.closest('.vote-btn')) return;
        e.preventDefault();
        const topicId = card.getAttribute('data-id');
        openForumThreadModal(topicId);
      };
    });
  }

  async function initForums() {
    getTopicsList();
    ensureForumModalsExist();
    setupForumCategoryBubbleFeed();
    renderForums();

    if (window.METAWIKI_FORUM_SERVICE) {
      try {
        const supaPosts = await window.METAWIKI_FORUM_SERVICE.fetchPosts();
        if (supaPosts && supaPosts.length > 0) {
          window.METAWIKI_DATA = window.METAWIKI_DATA || {};
          window.METAWIKI_DATA.forumTopics = supaPosts;
          renderForums();
        }
      } catch (e) {}
    }
  }

  window.ForumsEngine = {
    initForums,
    renderForums,
    openForumThreadModal
  };

  window.initForums = initForums;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForums);
  } else {
    initForums();
  }

})(window);
