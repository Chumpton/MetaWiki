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

    let selectedIndex = -1;

    const TRENDING_TOPIC_TAGS = [
      { label: '🔮 Hermeticism', query: 'Hermeticism' },
      { label: '📊 Hawkins Scale', query: 'Hawkins' },
      { label: '⚡ Quantum Metaphysics', query: 'Quantum' },
      { label: '☸️ Non-Duality', query: 'Non-Duality' },
      { label: '📐 Sacred Geometry', query: 'Geometry' },
      { label: '🕊️ Gnosticism', query: 'Gnosticism' },
      { label: '🧠 Archetypal Psychology', query: 'Psychology' }
    ];

    const trendingArticles = [
      { id: "platos-theory-of-forms", tag: "🔥 #1 Trending", category: "Philosophy" },
      { id: "emerald-tablet-of-hermes", tag: "🔥 Popular", category: "Hermeticism" },
      { id: "hawkins-scale-map-of-consciousness", tag: "⚡ Featured", category: "Consciousness" },
      { id: "carl-jung-shadow-archetypes", tag: "🧠 Trending", category: "Psychology" },
      { id: "divine-logos-metaphysics", tag: "✨ Popular", category: "Metaphysics" },
      { id: "advaita-vedanta-nonduality", tag: "☸️ Trending", category: "Non-Duality" }
    ];

    function renderTrending() {
      if (!window.METAWIKI_DATA || !window.METAWIKI_DATA.articles) return;
      
      const tagChipsHtml = `
        <div style="padding: 0.75rem 1rem 0.5rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(15, 12, 28, 0.95);">
          <div style="font-size: 0.72rem; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
            <i class="ph ph-trend-up"></i> Trending Topics & Directives
          </div>
          <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
            ${TRENDING_TOPIC_TAGS.map(t => `
              <span class="search-trending-chip" data-query="${t.query}" style="font-size: 0.75rem; font-weight: 700; color: #e2e8f0; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15); padding: 0.25rem 0.65rem; border-radius: 14px; cursor: pointer; transition: all 0.2s ease;">
                ${t.label}
              </span>
            `).join('')}
          </div>
        </div>
      `;

      const trendingItemsHtml = trendingArticles.map(t => {
        const article = window.METAWIKI_DATA.articles.find(a => a.id === t.id);
        if (!article) return '';
        return `
          <div class="search-dropdown-item" data-id="${article.id}" style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--mw-border); cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background 0.15s ease;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <strong style="color: var(--mw-gold); font-family: var(--font-heading); font-size: 0.95rem;">${article.title}</strong>
                <span style="font-size: 0.68rem; background: rgba(168, 85, 247, 0.18); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4); padding: 0.1rem 0.45rem; border-radius: 6px; font-weight: 700;">${article.category || 'Metaphysics'}</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--mw-text-muted); margin-top: 0.15rem;">${article.shortDescription}</div>
            </div>
            <span style="font-size: 0.7rem; font-weight: 800; background: rgba(251, 191, 36, 0.15); color: var(--mw-gold); border: 1px solid var(--mw-border-gold); padding: 0.15rem 0.5rem; border-radius: 10px; flex-shrink: 0; margin-left: 0.5rem;">${t.tag}</span>
          </div>
        `;
      }).join('');

      dropdown.innerHTML = tagChipsHtml + trendingItemsHtml;
      dropdown.style.display = 'block';

      dropdown.querySelectorAll('.search-trending-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          const query = chip.getAttribute('data-query');
          input.value = query;
          input.focus();
          triggerSearch(query);
        });
      });

      dropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.getAttribute('data-id');
          if (id && typeof window.loadArticle === 'function') window.loadArticle(id);
          dropdown.style.display = 'none';
        });
      });
    }

    function triggerSearch(queryStr) {
      const q = queryStr.toLowerCase().trim();
      if (!q) {
        renderTrending();
        return;
      }

      if (!window.METAWIKI_DATA || !window.METAWIKI_DATA.articles) return;
      
      const matches = window.METAWIKI_DATA.articles.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.shortDescription.toLowerCase().includes(q) ||
        (a.category && a.category.toLowerCase().includes(q))
      ).slice(0, 8);

      if (matches.length === 0) {
        dropdown.innerHTML = `<div style="padding: 1.2rem; color: var(--mw-text-muted); text-align: center; font-style: italic; font-size: 0.88rem;">No contemplations found matching "${q}"</div>`;
        dropdown.style.display = 'block';
        return;
      }

      const matchHeader = `
        <div style="padding: 0.5rem 1rem; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; background: rgba(10, 10, 15, 0.98); border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center;">
          <span>Predictive Search Results (${matches.length})</span>
          <span style="font-weight: 500; font-size: 0.68rem; color: #fbbf24;">Press ↵ to open top match</span>
        </div>
      `;

      dropdown.innerHTML = matchHeader + matches.map((a, idx) => {
        const titleHighlighted = a.title.replace(new RegExp(`(${q})`, 'gi'), `<mark style="background: rgba(251, 191, 36, 0.25); color: #fbbf24; border-radius: 2px; padding: 0 2px;">$1</mark>`);
        return `
          <div class="search-dropdown-item predictive-item" data-id="${a.id}" data-index="${idx}" style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--mw-border); cursor: pointer; transition: background 0.15s ease;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.2rem;">
              <strong style="color: #ffffff; font-family: var(--font-heading); font-size: 0.95rem;">${titleHighlighted}</strong>
              <span style="font-size: 0.68rem; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); padding: 0.1rem 0.45rem; border-radius: 6px; font-weight: 700; flex-shrink: 0;">${a.category || 'Article'}</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--mw-text-muted); line-height: 1.35;">${a.shortDescription}</div>
          </div>
        `;
      }).join('');

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
      triggerSearch(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.predictive-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        items.forEach((item, idx) => {
          item.style.background = idx === selectedIndex ? 'rgba(251, 191, 36, 0.12)' : 'transparent';
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items.forEach((item, idx) => {
          item.style.background = idx === selectedIndex ? 'rgba(251, 191, 36, 0.12)' : 'transparent';
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const target = selectedIndex >= 0 ? items[selectedIndex] : items[0];
        if (target) {
          const id = target.getAttribute('data-id');
          if (id && typeof window.loadArticle === 'function') window.loadArticle(id);
          dropdown.style.display = 'none';
        }
      }
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
    const wrapper = document.getElementById('dimensionMiniWrapper');
    const btnFullscreen = document.getElementById('btnFullscreenDimension');
    const fullscreenModal = document.getElementById('dimensionFullscreenModal');
    const btnCloseFullscreen = document.getElementById('closeDimensionFullscreenBtn');

    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => {
        if (!window.state) window.state = {};
        window.state.isHoverPaused = true;
      });
      wrapper.addEventListener('mouseleave', () => {
        if (!window.state) window.state = {};
        window.state.isHoverPaused = false;
      });
    }

    if (btnFullscreen && fullscreenModal) {
      btnFullscreen.addEventListener('click', () => {
        fullscreenModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
          const fsDriver = document.querySelector('#cnscns-widget-fullscreen .scroll-driver') || document.querySelector('#cnscns-widget-fullscreen #scroll-container');
          if (fsDriver) {
            fsDriver.scrollTop = fsDriver.clientHeight || 400;
            fsDriver.dispatchEvent(new Event('scroll'));
          }
        }, 60);
      });
    }

    if (btnCloseFullscreen && fullscreenModal) {
      btnCloseFullscreen.addEventListener('click', () => {
        fullscreenModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
    }

    function getActiveDriver() {
      if (fullscreenModal && fullscreenModal.style.display === 'block') {
        return document.querySelector('#cnscns-widget-fullscreen .scroll-driver') || document.querySelector('#cnscns-widget-fullscreen #scroll-container');
      }
      return document.querySelector('#cnscns-widget .scroll-driver') || document.querySelector('#cnscns-widget #scroll-container') || document.querySelector('#dimensionMiniWrapper .scroll-driver');
    }

    let currentStage = 1;

    // Fast initial lock onto slide 1 (stage 1) once mounted
    let mountAttempts = 0;
    const mountLockInterval = setInterval(() => {
      mountAttempts++;
      const driver = getActiveDriver();
      if (driver && driver.scrollHeight > driver.clientHeight) {
        const snaps = driver.querySelectorAll('.snap-section');
        if (snaps.length > 1 && snaps[1].offsetTop > 0) {
          driver.scrollTop = snaps[1].offsetTop;
        } else {
          const totalStages = snaps.length > 1 ? snaps.length - 1 : 34;
          const maxScroll = driver.scrollHeight - driver.clientHeight;
          const stageHeight = maxScroll / totalStages;
          driver.scrollTop = Math.round(stageHeight);
        }
        driver.dispatchEvent(new Event('scroll'));
        clearInterval(mountLockInterval);
      } else if (mountAttempts > 50) {
        clearInterval(mountLockInterval);
      }
    }, 100);

    if (dimensionStepTimer) clearInterval(dimensionStepTimer);

    // Continuous 5-Second Stage Auto-Play Engine
    dimensionStepTimer = setInterval(() => {
      if (window.state && window.state.isHoverPaused) return;

      const driver = getActiveDriver();
      if (!driver) return;

      const snaps = driver.querySelectorAll('.snap-section');
      const totalStages = snaps.length > 1 ? snaps.length - 1 : 34;
      const maxScroll = driver.scrollHeight - driver.clientHeight;

      if (maxScroll <= 0) return;

      if (snaps.length > 1) {
        const currentScrollTop = driver.scrollTop;
        let detectedIndex = 1;
        let minDiff = Infinity;
        snaps.forEach((sec, idx) => {
          if (idx < 1) return;
          const diff = Math.abs(sec.offsetTop - currentScrollTop);
          if (diff < minDiff) {
            minDiff = diff;
            detectedIndex = idx;
          }
        });
        currentStage = detectedIndex + 1;
        if (currentStage >= snaps.length) {
          currentStage = 1;
        }
        const targetSection = snaps[currentStage];
        if (targetSection) {
          driver.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
          });
          driver.dispatchEvent(new Event('scroll'));
        }
      } else {
        const stageHeight = maxScroll / totalStages;
        currentStage++;
        if (currentStage > totalStages) {
          currentStage = 1;
        }
        driver.scrollTo({
          top: Math.round(currentStage * stageHeight),
          behavior: 'smooth'
        });
        driver.dispatchEvent(new Event('scroll'));
      }
    }, 5000);
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

  // Pure JS MD5 Hasher for Wikimedia Commons Hash Paths
  function wikiMd5(string) {
    function rotateLeft(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function addUnsigned(lX, lY) {
      var lX4, lY4, lX8, lY8, lResult;
      lX8 = (lX & 0x80000000); lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000); lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
      if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      if (lX4 | lY4) {
        if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      } else return (lResult ^ lX8 ^ lY8);
    }
    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
    function FF(a,b,c,d,x,s,ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function GG(a,b,c,d,x,s,ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function HH(a,b,c,d,x,s,ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function II(a,b,c,d,x,s,ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function convertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1 = lMessageLength + 8;
      var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      var lWordArray = Array(lNumberOfWords - 1);
      var lBytePosition = 0; var lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    }
    function wordToHex(lValue) {
      var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      }
      return WordToHexValue;
    }
    function utf8Encode(str) {
      str = str.replace(/\r\n/g, "\n");
      var utftext = "";
      for (var n = 0; n < str.length; n++) {
        var c = str.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    }
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = utf8Encode(string);
    x = convertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
      AA = a; BB = b; CC = c; DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478); d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756); c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB); b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF); d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A); c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613); b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8); d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF); c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1); b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122); d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193); c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E); b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562); d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340); c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51); b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D); d = GG(d, a, b, c, x[k + 10], S22, 0x2441453); c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681); b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6); d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6); c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87); b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905); d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8); c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9); b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942); d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681); c = HH(c, d, a, b, x[k + 13], S33, 0x6D9D6122); b = HH(b, c, d, a, x[k + 2], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k + 5], S31, 0xA4BEEA44); d = HH(d, a, b, c, x[k + 10], S32, 0x4BDECFA9); c = HH(c, d, a, b, x[k + 15], S33, 0xF6BB4B60); b = HH(b, c, d, a, x[k + 4], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k + 9], S31, 0x289B7EC6); d = HH(d, a, b, c, x[k + 14], S32, 0xEAA127FA); c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085); b = HH(b, c, d, a, x[k + 8], S34, 0x4881D05);
      a = HH(a, b, c, d, x[k + 13], S31, 0xD9D4D039); d = HH(d, a, b, c, x[k + 2], S32, 0xE6DB99E5); c = HH(c, d, a, b, x[k + 7], S33, 0x1FA27CF8); b = HH(b, c, d, a, x[k + 12], S34, 0xC4AC5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244); d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97); c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7); b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3); d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92); c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D); b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F); d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0); c = II(c, d, a, b, x[k + 6], S43, 0xA3014314); b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82); d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235); c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB); b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
      a = addUnsigned(a, AA); b = addUnsigned(b, BB); c = addUnsigned(c, CC); d = addUnsigned(d, DD);
    }
    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
  }

  function getWikiImgUrl(shortPath, width = 330) {
    if (!shortPath || typeof shortPath !== 'string') {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';
    }
    if (shortPath.startsWith('http://') || shortPath.startsWith('https://') || shortPath.startsWith('data:')) {
      return shortPath;
    }
    var cleanPath = shortPath.replace(/^\/+/, '').trim();
    if (!cleanPath) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';
    }

    // 1. Path already has 2-level hash prefix (e.g. 4/4a/Platon.png)
    if (/^[0-9a-f]\/[0-9a-f]{2}\//i.test(cleanPath)) {
      var parts = cleanPath.split('/');
      var fileName = parts[parts.length - 1];
      if (fileName.toLowerCase().endsWith('.svg')) {
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + cleanPath + '/' + width + 'px-' + fileName + '.png';
      }
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + cleanPath + '/' + width + 'px-' + fileName;
    }

    // 2. Direct MD5 hash resolution for clean filenames
    var fileNameOnly = cleanPath.split('/').pop().replace(/ /g, '_');
    var hash = wikiMd5(fileNameOnly);
    var a = hash[0];
    var ab = hash.slice(0, 2);
    var fullHashPath = a + '/' + ab + '/' + fileNameOnly;

    if (fileNameOnly.toLowerCase().endsWith('.svg')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + fullHashPath + '/' + width + 'px-' + fileNameOnly + '.png';
    }
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + fullHashPath + '/' + width + 'px-' + fileNameOnly;
  }

  function handleCardImgError(imgEl, titleOrTopic) {
    if (!imgEl || imgEl.dataset.failed) return;
    imgEl.dataset.failed = 'true';
    imgEl.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';
  }

  // Export UI Components API
  window.AVAILABLE_INTEREST_TAGS = AVAILABLE_INTEREST_TAGS;
  window.getWikiImgUrl = getWikiImgUrl;
  window.handleCardImgError = handleCardImgError;
  window.setupThemeColorController = setupThemeColorController;
  window.setupLiveCommunityChat = setupLiveCommunityChat;
  window.setupSearch = setupSearch;
  window.setupInterestsModal = setupInterestsModal;
  window.initDimensionViewer = initDimensionViewer;
  window.setupScrollHideHeader = setupScrollHideHeader;

})(window);
