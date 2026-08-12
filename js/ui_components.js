/**
 * MetaWiki - Sitewide UI Components & Modals Engine
 * Controls Theme Accent Color, Semantic Search, Live Community Chat, Interests Customization, and Dimension Viewer.
 */

(function(window) {
  'use strict';

  const AVAILABLE_INTEREST_TAGS = [
    'Non-Duality', 'World Religions & Gnosticism', 'Judaism & Kabbalah',
    'Islam & Sufism', 'Hinduism & Advaita Vedanta', 'Buddhism & Zen',
    'Hermeticism & Alchemy', 'Western Philosophy & Neoplatonism',
    'Depth & Transpersonal Psychology', 'Sacred Geometry & Quantum Metaphysics'
  ];

  function setupThemeColorController() {
    const wheelBtn = document.getElementById('themeColorWheelBtn');
    const popover = document.getElementById('themeColorPopover');
    const closeBtn = document.getElementById('closeThemePopoverBtn');
    const picker = document.getElementById('themeColorPicker');
    const resetBtn = document.getElementById('resetThemeColorBtn');
    const swatches = document.querySelectorAll('.swatch-btn');

    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const num = parseInt(hex, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }

    function applyThemeColor(hex) {
      if (!hex) return;
      const root = document.documentElement;
      const rgb = hexToRgb(hex);

      root.style.setProperty('--mw-gold', hex);
      root.style.setProperty('--mw-border-gold', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`);
      root.style.setProperty('--mw-glow-gold', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`);
      localStorage.setItem('metawiki_theme_color', hex);
      if (picker) picker.value = hex;
    }

    const saved = localStorage.getItem('metawiki_theme_color');
    if (saved) applyThemeColor(saved);

    if (wheelBtn && popover) {
      wheelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.style.display = popover.style.display === 'none' || !popover.style.display ? 'block' : 'none';
      });
    }

    if (closeBtn && popover) {
      closeBtn.addEventListener('click', () => { popover.style.display = 'none'; });
    }

    document.addEventListener('click', (e) => {
      if (popover && popover.style.display === 'block' && !popover.contains(e.target) && e.target !== wheelBtn) {
        popover.style.display = 'none';
      }
    });

    if (picker) {
      picker.addEventListener('input', (e) => applyThemeColor(e.target.value));
    }

    swatches.forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        if (color) applyThemeColor(color);
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        localStorage.removeItem('metawiki_theme_color');
        applyThemeColor('#fbbf24');
      });
    }
  }

  function setupLiveCommunityChat() {
    const launcher = document.getElementById('liveChatLauncher');
    const drawer = document.getElementById('liveChatDrawer');
    const closeBtn = document.getElementById('closeLiveChatBtn');
    const input = document.getElementById('liveChatInput');
    const sendBtn = document.getElementById('liveChatSendBtn');
    const messagesContainer = document.getElementById('liveChatMessages');
    const userBanner = document.getElementById('chatUserBanner');

    let activeChannel = 'general';

    const defaultMessagesByChannel = {
      general: [
        { 
          author: "Campton", 
          avatar: "https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256", 
          time: "Today at 10:14 AM", 
          text: "Welcome to the official 🌌 Meta Wiki Discord server! Feel free to share metaphysical contemplations and research here." 
        },
        { 
          author: "Campton", 
          avatar: "https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256", 
          time: "Today at 10:20 AM", 
          text: "Join our official Discord community directly via https://discord.gg/sZwwXgR5vf !" 
        }
      ]
    };

    async function fetchRealDiscordServerData() {
      try {
        const res = await fetch('https://discord.com/api/v10/invites/sZwwXgR5vf?with_counts=true');
        if (res.ok) {
          const data = await res.json();
          const onlineCount = data.approximate_presence_count || 1;
          const memberCount = data.approximate_member_count || 10;
          const channelName = data.channel?.name || '💬│general';

          const drawerHeader = document.querySelector('#liveChatDrawer .live-chat-header');
          if (drawerHeader) {
            const onlineBadge = drawerHeader.querySelector('span[style*="23a55a"]');
            if (onlineBadge) {
              onlineBadge.innerHTML = `<span style="width: 6px; height: 6px; border-radius: 50%; background: #23a55a; display: inline-block;"></span> ${onlineCount} Online (${memberCount} Members)`;
            }
            const chanNameEl = drawerHeader.querySelector('span[style*="f2f3f5"]');
            if (chanNameEl) chanNameEl.textContent = channelName;
          }
        }
      } catch (e) {
        console.warn('Could not fetch live Discord server invite data:', e);
      }
    }

    function getMessages() {
      try {
        const stored = localStorage.getItem('metawiki_chat_channels');
        if (stored) {
          const parsed = JSON.parse(stored);
          let msgs = parsed[activeChannel] || [];
          // Filter out all legacy mock profiles
          msgs = msgs.filter(m => 
            !m.author.includes('EgoDissolver') && 
            !m.author.includes('Sophia_Lover') && 
            !m.author.includes('CalibrationAdept') && 
            !m.author.includes('KybalionInitiate') && 
            !m.author.includes('GnosticAlchemist') && 
            !m.author.includes('QuantumVedantin') && 
            !m.author.includes('JungianAnalyst') &&
            !m.author.includes('GnosticSeeker')
          );
          if (msgs.length > 0) return msgs;
        }
      } catch (e) {}
      return defaultMessagesByChannel[activeChannel] || [];
    }

    function saveMessage(msgObj) {
      try {
        const stored = JSON.parse(localStorage.getItem('metawiki_chat_channels') || '{}');
        stored[activeChannel] = stored[activeChannel] || [...(defaultMessagesByChannel[activeChannel] || [])];
        stored[activeChannel].push(msgObj);
        localStorage.setItem('metawiki_chat_channels', JSON.stringify(stored));
      } catch (e) {}
    }

    function renderUserBanner() {
      if (!userBanner) return;
      const auth = window.METAWIKI_AUTH || window.METAWIKI_DISCORD_BACKEND;
      const session = auth ? auth.getSession() : null;

      if (session) {
        userBanner.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0.9rem; background: #2b2d31; border-bottom: 1px solid #1f2023;">
            <div style="display: flex; align-items: center; gap: 0.45rem;">
              <img src="${session.avatar}" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover; border: 1px solid #23a55a;" alt="User">
              <span style="font-weight: 700; color: #f2f3f5; font-size: 0.78rem;">${session.username}</span>
            </div>
            <span style="font-size: 0.68rem; color: #23a55a; font-weight: 700; display: inline-flex; align-items: center; gap: 0.2rem;"><i class="ph ph-check-circle"></i> Verified Initiate</span>
          </div>
        `;
      } else {
        userBanner.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0.9rem; background: #2b2d31; border-bottom: 1px solid #1f2023;">
            <div style="font-size: 0.75rem; color: #949ba4;">Chatting as <strong style="color: #dbdee1;">Guest Initiate</strong></div>
            <button id="chatLoginBtn" style="background: none; border: none; color: #5865F2; cursor: pointer; font-size: 0.75rem; font-weight: 700; text-decoration: underline;">Sign In with Discord</button>
          </div>
        `;
        const loginBtn = document.getElementById('chatLoginBtn');
        if (loginBtn && window.METAWIKI_DISCORD_BACKEND) {
          loginBtn.addEventListener('click', () => window.METAWIKI_DISCORD_BACKEND.openModal());
        }
      }
    }

    function renderMessages() {
      if (!messagesContainer) return;
      const msgs = getMessages();
      messagesContainer.innerHTML = msgs.map(m => `
        <div style="display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.2rem 0.3rem; border-radius: 4px; transition: background 0.15s ease;">
          <img src="${m.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0; margin-top: 0.1rem;" alt="${m.author}">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: baseline; gap: 0.55rem; margin-bottom: 0.15rem;">
              <span style="font-weight: 700; color: #f2f3f5; font-size: 0.88rem; letter-spacing: -0.01em;">${m.author}</span>
              <span style="font-size: 0.68rem; color: #949ba4; font-weight: 500;">${m.time || 'Today at 10:42 AM'}</span>
            </div>
            <div style="font-size: 0.88rem; color: #dbdee1; line-height: 1.45; word-wrap: break-word;">${m.text}</div>
          </div>
        </div>
      `).join('');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function sendMessage() {
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;

      const auth = window.METAWIKI_AUTH || window.METAWIKI_DISCORD_BACKEND;
      const session = auth ? auth.getSession() : null;
      const author = session ? session.username : 'GuestInitiate';
      const avatar = session ? session.avatar : 'https://cdn.discordapp.com/embed/avatars/0.png';

      const now = new Date();
      const timeStr = 'Today at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const msgObj = { author, avatar, time: timeStr, text };
      saveMessage(msgObj);
      input.value = '';
      renderMessages();
    }

    fetchRealDiscordServerData();

    if (launcher && drawer) {
      launcher.addEventListener('click', () => {
        drawer.style.display = drawer.style.display === 'none' || !drawer.style.display ? 'flex' : 'none';
        fetchRealDiscordServerData();
        renderUserBanner();
        renderMessages();
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => { drawer.style.display = 'none'; });
    }

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
    }

    document.querySelectorAll('.chat-emoji-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (input) {
          input.value += btn.getAttribute('data-emoji');
          input.focus();
        }
      });
    });

    window.addEventListener('metawiki_auth_changed', () => {
      renderUserBanner();
    });

    renderUserBanner();
  }

  function setupSearch(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;

    const trendingArticles = [
      { id: "divine-logos", tag: "🔥 Trending" },
      { id: "advaita-vedanta-nonduality", tag: "🔥 Popular" },
      { id: "patanjali-eight-limbs", tag: "🔥 Trending" },
      { id: "jungian-archetypes-shadow", tag: "🔥 Popular" },
      { id: "ten-sephirot-tree-of-life", tag: "🔥 Trending" }
    ];

    function renderTrending() {
      if (!window.METAWIKI_DATA || !window.METAWIKI_DATA.articles) return;
      const trendingItems = trendingArticles.map(t => {
        const article = window.METAWIKI_DATA.articles.find(a => a.id === t.id);
        if (!article) return '';
        return `
          <div class="search-dropdown-item" data-id="${article.id}" style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--mw-border); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <strong style="color: var(--mw-gold); font-family: var(--font-heading); font-size: 0.95rem;">${article.title}</strong>
              <div style="font-size: 0.8rem; color: var(--mw-text-muted);">${article.shortDescription}</div>
            </div>
            <span style="font-size: 0.7rem; font-weight: 800; background: rgba(251, 191, 36, 0.15); color: var(--mw-gold); border: 1px solid var(--mw-border-gold); padding: 0.15rem 0.5rem; border-radius: 10px; flex-shrink: 0; margin-left: 0.5rem;">${t.tag}</span>
          </div>
        `;
      }).join('');

      dropdown.innerHTML = `
        <div style="padding: 0.5rem 1rem; font-size: 0.72rem; font-weight: 800; color: var(--mw-gold); text-transform: uppercase; letter-spacing: 1px; background: rgba(10, 10, 15, 0.95);">
          ✨ Popular Metaphysical Searches
        </div>
        ${trendingItems}
      `;
      dropdown.style.display = 'block';

      dropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.getAttribute('data-id');
          if (id && typeof window.loadArticle === 'function') window.loadArticle(id);
          dropdown.style.display = 'none';
        });
      });
    }

    input.addEventListener('focus', () => {
      if (!input.value.trim()) renderTrending();
    });

    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderTrending();
        return;
      }

      if (!window.METAWIKI_DATA || !window.METAWIKI_DATA.articles) return;
      const matches = window.METAWIKI_DATA.articles.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.shortDescription.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      ).slice(0, 8);

      if (matches.length === 0) {
        dropdown.innerHTML = `<div style="padding: 1rem; color: var(--mw-text-muted); text-align: center; font-style: italic;">No contemplations found matching "${q}"</div>`;
        dropdown.style.display = 'block';
        return;
      }

      dropdown.innerHTML = matches.map(a => `
        <div class="search-dropdown-item" data-id="${a.id}" style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--mw-border); cursor: pointer;">
          <strong style="color: var(--mw-gold); font-family: var(--font-heading); font-size: 0.95rem; display: block; margin-bottom: 0.2rem;">${a.title}</strong>
          <div style="font-size: 0.8rem; color: var(--mw-text-muted); line-height: 1.3;">${a.shortDescription}</div>
        </div>
      `).join('');
      dropdown.style.display = 'block';

      dropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.getAttribute('data-id');
          if (id && typeof window.loadArticle === 'function') window.loadArticle(id);
          dropdown.style.display = 'none';
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }

  function setupInterestsModal() {
    const modal = document.getElementById('interestsModal');
    const openBtn = document.getElementById('openInterestsModalBtn');
    const closeBtn = document.getElementById('closeInterestsModalBtn');
    const saveBtn = document.getElementById('saveInterestsBtn');
    const resetBtn = document.getElementById('resetInterestsBtn');
    const grid = document.getElementById('interestsChipsGrid');

    if (!modal || !grid) return;

    function renderChips() {
      const state = window.state || {};
      const userInterests = state.userInterests || AVAILABLE_INTEREST_TAGS;

      grid.innerHTML = AVAILABLE_INTEREST_TAGS.map(tag => {
        const isSelected = userInterests.includes(tag);
        return `<button class="interests-chip-btn ${isSelected ? 'selected' : ''}" data-tag="${tag}">${isSelected ? '✓ ' : ''}${tag}</button>`;
      }).join('');

      grid.querySelectorAll('.interests-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tag = btn.getAttribute('data-tag');
          if (!window.state) window.state = {};
          if (!window.state.userInterests) window.state.userInterests = [...AVAILABLE_INTEREST_TAGS];

          if (window.state.userInterests.includes(tag)) {
            window.state.userInterests = window.state.userInterests.filter(t => t !== tag);
          } else {
            window.state.userInterests.push(tag);
          }
          renderChips();
        });
      });
    }

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        renderChips();
        modal.style.display = 'flex';
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (!window.state) window.state = {};
        window.state.userInterests = [...AVAILABLE_INTEREST_TAGS];
        renderChips();
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (window.state && window.state.userInterests) {
          localStorage.setItem('metawiki_user_interests', JSON.stringify(window.state.userInterests));
        }
        modal.style.display = 'none';

        if (!window.state) window.state = {};
        window.state.feedCategory = 'foryou';
        window.state.feedSortBy = 'foryou';
        window.state.feedPage = 1;

        const tabsContainer = document.getElementById('categoryTabsBar');
        if (tabsContainer) {
          tabsContainer.querySelectorAll('.cat-bubble-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-cat') === 'foryou');
          });
        }
        const sortSelect = document.getElementById('feedSortSelect');
        if (sortSelect) sortSelect.value = 'foryou';

        if (typeof window.renderPortalFeed === 'function') window.renderPortalFeed();
      });
    }
  }

  let dimensionStepTimer = null;

  function initDimensionViewer() {
    const btnFullscreen = document.getElementById('btnFullscreenDimension');
    const modalFullscreen = document.getElementById('dimensionFullscreenModal');
    const btnCloseFullscreen = document.getElementById('closeDimensionFullscreenBtn');

    const HOLD_SECONDS = 7; // Stay on each section for 7 seconds
    const TOTAL_STAGES = 34; // 34 stages in the dimension viewer widget

    function getDriver() {
      return document.querySelector('#cnscns-widget .scroll-driver');
    }

    function scrollToSection(secIndex) {
      const driver = getDriver();
      if (!driver) return false;

      const maxScroll = driver.scrollHeight - driver.clientHeight;
      if (maxScroll <= 0) return false;

      const secH = maxScroll / TOTAL_STAGES;
      const targetTop = Math.min(Math.max(0, secIndex) * secH, maxScroll);

      // Snap transition instantly to section top
      driver.scrollTop = targetTop;
      return true;
    }

    function startSectionTraversal() {
      if (dimensionStepTimer) clearInterval(dimensionStepTimer);

      let currentSection = 1; // Skip section 0, start on section 1

      // Ensure initial snap to section 1 when widget DOM is ready
      let retries = 0;
      const initCheck = setInterval(() => {
        retries++;
        if (scrollToSection(1) || retries > 25) {
          clearInterval(initCheck);
        }
      }, 200);

      // Every 7 seconds, snap transition to the next section (1 to 34)
      dimensionStepTimer = setInterval(() => {
        currentSection++;
        if (currentSection > TOTAL_STAGES) {
          currentSection = 1; // Loop back to section 1 (skipping 0)
        }
        scrollToSection(currentSection);
      }, HOLD_SECONDS * 1000);
    }

    if (btnFullscreen && modalFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        modalFullscreen.style.display = 'block';
        if (window.CnscnsWidget && typeof window.CnscnsWidget.initFullscreen === 'function') {
          window.CnscnsWidget.initFullscreen('cnscns-widget-fullscreen');
        }
      });
    }

    if (btnCloseFullscreen && modalFullscreen) {
      btnCloseFullscreen.addEventListener('click', () => {
        modalFullscreen.style.display = 'none';
      });
    }

    // Start the gentle section-by-section traversal (starts at infinity)
    startSectionTraversal();
  }

  function setupScrollHideHeader() {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const globalNav = document.getElementById('mwGlobalNav');

      if (window.state && window.state.view === 'article') {
        if (globalNav) {
          globalNav.classList.remove('nav-hidden');
          globalNav.style.display = 'flex';
        }
        return;
      }

      if (currentScrollY > lastScrollY + 8 && currentScrollY > 120) {
        if (globalNav) globalNav.classList.add('nav-hidden');
      } else if (currentScrollY < lastScrollY - 4) {
        if (globalNav) globalNav.classList.remove('nav-hidden');
      }
      lastScrollY = currentScrollY;
    });
  }

  function getWikiImgUrl(shortPath, width = 330) {
    if (!shortPath || typeof shortPath !== 'string') {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';
    }
    if (shortPath.startsWith('http://') || shortPath.startsWith('https://') || shortPath.startsWith('data:')) {
      return shortPath;
    }
    const cleanPath = shortPath.replace(/^\/+/, '');
    const parts = cleanPath.split('/');
    const fileName = parts[parts.length - 1];

    if (fileName.toLowerCase().endsWith('.svg')) {
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/${cleanPath}/${width}px-${fileName}.png`;
    }

    return `https://upload.wikimedia.org/wikipedia/commons/thumb/${cleanPath}/${width}px-${fileName}`;
  }

  // Export UI Components API
  window.AVAILABLE_INTEREST_TAGS = AVAILABLE_INTEREST_TAGS;
  window.getWikiImgUrl = getWikiImgUrl;
  window.setupThemeColorController = setupThemeColorController;
  window.setupLiveCommunityChat = setupLiveCommunityChat;
  window.setupSearch = setupSearch;
  window.setupInterestsModal = setupInterestsModal;
  window.initDimensionViewer = initDimensionViewer;
  window.setupScrollHideHeader = setupScrollHideHeader;

})(window);
