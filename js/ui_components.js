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
      wrapper.addEventListener('mouseenter', () => { if (window.state) window.state.isHoverPaused = true; });
      wrapper.addEventListener('mouseleave', () => { if (window.state) window.state.isHoverPaused = false; });
    }

    if (btnFullscreen && fullscreenModal) {
      btnFullscreen.addEventListener('click', () => {
        fullscreenModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
          const fsDriver = document.querySelector('#cnscns-widget-fullscreen .scroll-driver');
          if (fsDriver) {
            const fsSnaps = fsDriver.querySelectorAll('.snap-section');
            if (fsSnaps.length > 1) fsDriver.scrollTop = fsSnaps[1].offsetTop;
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

    let currentSlideIndex = 1;

    const attemptInfinityLock = () => {
      let locked = false;
      const miniDriver = document.querySelector('#cnscns-widget .scroll-driver') || document.querySelector('#dimensionMiniWrapper .scroll-driver');
      if (miniDriver) {
        const snaps = miniDriver.querySelectorAll('.snap-section');
        if (snaps.length > 1 && snaps[1].offsetTop > 0) {
          miniDriver.scrollTop = snaps[1].offsetTop;
          locked = true;
        }
      }
      const fsDriver = document.querySelector('#cnscns-widget-fullscreen .scroll-driver');
      if (fsDriver) {
        const fsSnaps = fsDriver.querySelectorAll('.snap-section');
        if (fsSnaps.length > 1 && fsSnaps[1].offsetTop > 0) {
          fsDriver.scrollTop = fsSnaps[1].offsetTop;
        }
      }
      return locked;
    };

    // Poll until React renders .snap-section elements and locks onto Infinity slide
    const lockPoll = setInterval(() => {
      if (attemptInfinityLock()) {
        clearInterval(lockPoll);
      }
    }, 40);

    setTimeout(attemptInfinityLock, 100);
    setTimeout(attemptInfinityLock, 350);
    setTimeout(attemptInfinityLock, 800);
    setTimeout(attemptInfinityLock, 1500);

    if (dimensionStepTimer) clearInterval(dimensionStepTimer);

    // Clean Synchronized 7-Second Slide Pacing
    dimensionStepTimer = setInterval(() => {
      if (window.state && window.state.isHoverPaused) return; // Pause on hover!
      const miniDriver = document.querySelector('#cnscns-widget .scroll-driver') || document.querySelector('#dimensionMiniWrapper .scroll-driver');
      const fsDriver = document.querySelector('#cnscns-widget-fullscreen .scroll-driver');
      const activeDriver = (fullscreenModal && fullscreenModal.style.display === 'block' && fsDriver) ? fsDriver : miniDriver;

      if (activeDriver) {
        const snapSections = activeDriver.querySelectorAll('.snap-section');
        if (snapSections.length > 1) {
          const currentScrollTop = activeDriver.scrollTop;
          let detectedIndex = 1;
          let minDiff = Infinity;

          snapSections.forEach((sec, idx) => {
            if (idx < 1) return;
            const diff = Math.abs(sec.offsetTop - currentScrollTop);
            if (diff < minDiff) {
              minDiff = diff;
              detectedIndex = idx;
            }
          });

          currentSlideIndex = detectedIndex + 1;
          if (currentSlideIndex >= snapSections.length) {
            currentSlideIndex = 1; // Loop back to slide 1
          }

          const targetSnap = snapSections[currentSlideIndex];
          if (targetSnap) {
            activeDriver.scrollTo({
              top: targetSnap.offsetTop,
              behavior: 'smooth'
            });
          }
        }
      }
    }, 7000);
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
