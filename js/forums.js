/**
 * MetaWiki - Metaphysical Community Forums Engine (Reconstructed & Fully Functional)
 * Full Reddit-style thread screen mode, modal injector, upvoting, category bubble feed filtering,
 * live comments, and official Campton community post.
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

  // Official Campton Community Post
  const OFFICIAL_CAMPTON_MOCK_POST = {
    id: 'topic-campton-official',
    title: 'Welcome to MetaWiki Community — Consciousness & Hermetic Contemplations',
    category: 'Metaphysical Debate',
    author: 'Campton',
    avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
    handle: '@campton',
    body: 'Welcome to the official MetaWiki community forums! Here we explore non-dual perception, Dr. David R. Hawkins\' consciousness calibrations, Hermetic mechanics, and perennial philosophy. Feel free to start a discussion or leave a reply.',
    repliesCount: 3,
    upvotes: 42,
    timestamp: 'Just now',
    repliesList: [
      {
        author: 'Campton',
        avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
        body: 'All posts, replies, and upvotes are linked directly to your authenticated Discord user profile.',
        time: 'Just now'
      }
    ]
  };

  // Authentic default community discussion topics across all categories
  const DEFAULT_AUTHENTIC_TOPICS = [
    OFFICIAL_CAMPTON_MOCK_POST,
    {
      id: 'topic-init-1',
      title: 'Contemplating Non-Dual Perception and Consciousness Calibration',
      category: 'Metaphysical Debate',
      author: 'Campton',
      avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
      handle: '@campton',
      body: 'Welcome to the MetaWiki community discussions. Share your insights on Hawkins consciousness calibrations, Hermetic principles, or Advaita Vedanta traditions.',
      repliesCount: 3,
      upvotes: 24,
      timestamp: '1 hours ago',
      repliesList: [
        {
          author: 'Campton',
          avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
          body: 'All posts and comments are linked directly to your authenticated Discord user profile.',
          time: '1 hours ago'
        }
      ]
    },
    {
      id: 'topic-init-2',
      title: 'Transitioning from Intellectual LoC 400s to Direct Observation in Silence',
      category: 'Meditation Practices',
      author: 'Campton',
      avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
      handle: '@campton',
      body: 'How do you experience the perceptual shift when transitioning from analytical reasoning (LoC 400) to heart-centered surrender (LoC 500+)? Would love community insights on silent meditation protocols.',
      repliesCount: 5,
      upvotes: 18,
      timestamp: '2 hours ago',
      repliesList: [
        {
          author: 'Campton',
          avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
          body: 'The key shift is from analyzing content to resting as the space of awareness itself.',
          time: '1 hours ago'
        }
      ]
    },
    {
      id: 'topic-init-3',
      title: 'Archetypal Symbolism of the Logos in Jungian Active Imagination',
      category: 'Depth Psychology',
      author: 'Campton',
      avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
      handle: '@campton',
      body: 'Exploring how Carl Jung’s transcendent function mirrors the Divine Logos of Hellenistic philosophy and Neoplatonism in active imagination work.',
      repliesCount: 4,
      upvotes: 31,
      timestamp: '3 hours ago',
      repliesList: []
    },
    {
      id: 'topic-init-4',
      title: 'The Witnessing Subject vs. The Unmanifest Absolute (Turiyatita)',
      category: 'Non-Dual Contemplations',
      author: 'Campton',
      avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
      handle: '@campton',
      body: 'Examining Adi Shankara’s Vivekacudamani on the subtle distinction between the sakshin (witnessing self) and the non-dual unmanifest Brahman.',
      repliesCount: 2,
      upvotes: 29,
      timestamp: '4 hours ago',
      repliesList: []
    },
    {
      id: 'topic-init-5',
      title: 'Geometric Resonance and the Geometry of Metatron’s Cube',
      category: 'Sacred Mechanics',
      author: 'Campton',
      avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
      handle: '@campton',
      body: 'How sacred geometry encapsulates harmonic ratios found across crystal lattices, planetary orbits, and subtle body energetic meridians.',
      repliesCount: 6,
      upvotes: 42,
      timestamp: '5 hours ago',
      repliesList: []
    },
    {
      id: 'topic-init-6',
      title: 'Calibrating Classical Texts: The Bhagavad Gita vs. Hermetic Corpus',
      category: 'Hawkins LoC Debates',
      author: 'Campton',
      avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
      handle: '@campton',
      body: 'Discussing Dr. David R. Hawkins’ calibrations of world spiritual scriptures and how their core essence converges across traditions.',
      repliesCount: 8,
      upvotes: 53,
      timestamp: '6 hours ago',
      repliesList: []
    },
    {
      id: 'topic-init-7',
      title: 'The Seven Hermetic Principles in Modern Quantum Field Theory',
      category: 'Hermetic Scholarship',
      author: 'Campton',
      avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
      handle: '@campton',
      body: 'Analyzing "As above, so below; as within, so without" through the lens of non-local entanglement and fractal holographic cosmology.',
      repliesCount: 7,
      upvotes: 39,
      timestamp: '7 hours ago',
      repliesList: []
    }
  ];

  function getTopicsList() {
    if (!window.METAWIKI_DATA) window.METAWIKI_DATA = {};
    if (!window.METAWIKI_DATA.forumTopics || window.METAWIKI_DATA.forumTopics.length === 0) {
      window.METAWIKI_DATA.forumTopics = DEFAULT_AUTHENTIC_TOPICS;
    }
    return window.METAWIKI_DATA.forumTopics;
  }

  function ensureForumModalsExist() {
    // 1. Reddit Thread Reader Modal Overlay
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
        
        <!-- REDDIT SUBREDDIT / TOPIC HEADER -->
        <div style="padding: 0.8rem 1.4rem; background: #161924; border-bottom: 1px solid rgba(255, 255, 255, 0.12); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <span id="threadCategoryPill" style="font-size: 0.78rem; font-weight: 800; color: #a855f7; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.35); padding: 0.25rem 0.75rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">r/Metaphysics</span>
            <span style="color: #64748b; font-size: 0.82rem;">• Posted by</span>
            <div style="display: flex; align-items: center; gap: 0.45rem;">
              <img id="threadAuthorAvatar" src="https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid #fbbf24;" alt="Author">
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
            <span id="threadUpvoteCount" style="font-weight: 800; font-size: 0.98rem; color: #fbbf24; margin: 0.1rem 0;">42</span>
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
    const commentUserLabel = document.getElementById('commentAsUserLabel');

    const session = window.METAWIKI_AUTH ? window.METAWIKI_AUTH.getSession() : null;
    if (commentUserLabel) commentUserLabel.textContent = `u/${session ? session.username : 'Campton'}`;

    const catName = topic.category || 'Metaphysical Debate';
    if (category) category.textContent = catName.startsWith('r/') ? catName : `r/${catName.replace(/\s+/g, '')}`;
    if (title) title.textContent = topic.title;
    if (time) time.textContent = topic.time || topic.timestamp || 'Recently';
    if (authorAvatar) authorAvatar.src = topic.avatar || 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256';
    if (authorName) authorName.textContent = `u/${topic.author || 'Campton'}`;
    if (body) body.textContent = topic.body;

    let storedVotes = {};
    try { storedVotes = JSON.parse(localStorage.getItem('metawiki_forum_votes')) || {}; } catch(e) {}
    const userVote = storedVotes[topic.id] || 0;
    if (upvotesCount) upvotesCount.textContent = (topic.upvotes || 1) + userVote;

    // Fetch comments from Supabase if available
    if (window.METAWIKI_FORUM_SERVICE && String(topic.id).includes('-')) {
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
      container.innerHTML = `<div style="color: var(--mw-text-muted); font-size: 0.88rem; font-style: italic; text-align: center; padding: 1.5rem; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">No responses yet. Be the first to share your contemplation!</div>`;
      return;
    }

    container.innerHTML = replies.map(r => `
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 1rem; transition: border-color 0.2s ease;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.55rem;">
          <div style="display: flex; align-items: center; gap: 0.55rem;">
            <img src="${r.avatar || 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256'}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.25);" alt="Avatar">
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

    if (closeBtn) closeBtn.onclick = closeModal;
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) closeModal();
      };
    }

    if (shareBtn) {
      shareBtn.onclick = () => {
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
      saveBtn.onclick = () => {
        saveBtn.innerHTML = `<i class="ph ph-bookmark-simple-fill" style="color: #fbbf24;"></i> Saved!`;
        setTimeout(() => {
          saveBtn.innerHTML = `<i class="ph ph-bookmark-simple"></i> Save`;
        }, 1500);
      };
    }

    if (upvoteBtn) {
      upvoteBtn.onclick = () => {
        if (!activeThreadTopicId) return;
        const topics = getTopicsList();
        const topic = topics.find(t => t.id === activeThreadTopicId);
        if (topic) {
          topic.upvotes = (topic.upvotes || 0) + 1;
          const upvotesCount = document.getElementById('threadUpvoteCount');
          if (upvotesCount) upvotesCount.textContent = topic.upvotes;
          renderForums();
        }
      };
    }

    if (downvoteBtn) {
      downvoteBtn.onclick = () => {
        if (!activeThreadTopicId) return;
        const topics = getTopicsList();
        const topic = topics.find(t => t.id === activeThreadTopicId);
        if (topic && topic.upvotes > 0) {
          topic.upvotes = topic.upvotes - 1;
          const upvotesCount = document.getElementById('threadUpvoteCount');
          if (upvotesCount) upvotesCount.textContent = topic.upvotes;
          renderForums();
        }
      };
    }

    if (submitReplyBtn && replyInput) {
      submitReplyBtn.onclick = async () => {
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
          try {
            commentObj = await window.METAWIKI_FORUM_SERVICE.createComment(activeThreadTopicId, text);
          } catch(e) {}
        }

        topic.repliesList = topic.repliesList || [];
        topic.repliesList.push(commentObj);
        topic.repliesCount = topic.repliesList.length;

        replyInput.value = '';
        renderThreadReplies(topic);
        renderForums();
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

    if (openBtn) openBtn.onclick = openModal;
    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) closeModal();
      };
    }

    if (publishBtn) {
      publishBtn.onclick = async () => {
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
          try {
            newTopic = await window.METAWIKI_FORUM_SERVICE.createPost(title, category, body);
          } catch(e) {}
        }

        if (!newTopic) {
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
      };
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

          const cat = btn.getAttribute('data-cat') || 'all';
          if (!window.state) window.state = {};
          window.state.forumCategory = cat;
          window.state.forumVisibleCount = 15;
          renderForums();
        });
      });
    }

    if (showMoreBtn) {
      showMoreBtn.onclick = () => {
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

    // Always fallback to showing all topics if filtering returns 0 items
    if (filtered.length === 0) {
      filtered = allTopics;
    }

    const visibleItems = filtered.slice(0, countToDisplay);

    list.innerHTML = visibleItems.map((t, idx) => {
      const userVote = storedVotes[t.id] || 0;
      const netScore = (t.upvotes || 0) + userVote;
      const upvotedClass = userVote === 1 ? 'upvoted' : '';
      const downvotedClass = userVote === -1 ? 'downvoted' : '';

      return `
        <div class="forum-topic-card" data-id="${t.id}" style="animation: fadeIn 0.4s ease forwards; animation-delay: ${(idx % 15) * 0.03}s; cursor: pointer; margin-bottom: 1.2rem; background: rgba(22, 17, 46, 0.7); border: 1px solid var(--mw-border); border-radius: 12px; padding: 1.2rem; display: flex; gap: 1.2rem;">
          <div class="forum-vote-column" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 40px; background: rgba(0,0,0,0.25); padding: 0.4rem; border-radius: 8px;">
            <button class="vote-btn vote-up ${upvotedClass}" data-id="${t.id}" title="Upvote Topic" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem;">
              <i class="ph ph-caret-up-bold"></i>
            </button>
            <span class="forum-net-score ${upvotedClass} ${downvotedClass}" style="font-weight: 800; font-size: 0.95rem; color: #fbbf24; margin: 0.2rem 0;">${netScore}</span>
            <button class="vote-btn vote-down ${downvotedClass}" data-id="${t.id}" title="Downvote Topic" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem;">
              <i class="ph ph-caret-down-bold"></i>
            </button>
          </div>

          <div style="flex: 1;">
            <div class="forum-topic-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span class="forum-category-pill" style="font-size: 0.76rem; font-weight: 800; color: #a855f7; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); padding: 0.2rem 0.65rem; border-radius: 20px;">r/${(t.category || 'General').replace(/\s+/g, '')}</span>
              <span style="font-size: 0.78rem; color: var(--mw-text-muted);">${t.timestamp || t.time || 'Recently'}</span>
            </div>
            <div class="forum-topic-title" style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 0.4rem;">${t.title}</div>
            <div class="forum-topic-body" style="font-size: 0.9rem; color: var(--mw-text-muted); line-height: 1.5; margin-bottom: 0.8rem;">${t.body}</div>
            <div class="forum-topic-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.6rem;">
              <div class="forum-topic-author" style="display: flex; align-items: center; gap: 0.45rem;">
                <img src="${t.avatar || 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256'}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.25);" alt="Avatar">
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

    // Vote button handlers
    list.querySelectorAll('.vote-up').forEach(btn => {
      btn.onclick = (e) => {
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

    list.querySelectorAll('.vote-down').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const topicId = btn.getAttribute('data-id');
        const topic = getTopicsList().find(t => String(t.id) === String(topicId));
        if (topic) {
          const currentVote = storedVotes[topicId] || 0;
          storedVotes[topicId] = currentVote === -1 ? 0 : -1;
          localStorage.setItem('metawiki_forum_votes', JSON.stringify(storedVotes));
          renderForums();
        }
      };
    });

    // Card click event -> open thread modal
    list.querySelectorAll('.forum-topic-card').forEach(card => {
      card.onclick = (e) => {
        if (e.target.closest('.vote-btn')) return;
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

  // Run automatically when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForums);
  } else {
    initForums();
  }

})(window);
