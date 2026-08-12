/**
 * MetaWiki - Master Application Controller
 * Implementation of Router, Hovercards, Force-Directed Physics Map, ScrollSpy TOC, Hover-Pause, and Hawkins Rainbow Bar Pointer.
 */

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    view: 'portal', // 'portal', 'spatial', 'article'
    currentArticleId: 'divine-logos',
    isHoverPaused: false,
    theme: localStorage.getItem('metawiki_theme') || 'dark'
  };

  // Initialize Theme
  document.documentElement.setAttribute('data-theme', state.theme);

  // 1. Initialize Dimension Viewer with Hover-Pause Feature
  initDimensionViewer();

  // 2. Render Featured Carousel & Portals & Bubble Category Feed
  if (typeof window.setupBubbleCategoryFeed === 'function') {
    window.setupBubbleCategoryFeed();
  }
  if (typeof window.renderFeaturedCarouselGrid === 'function') {
    window.renderFeaturedCarouselGrid();
  }
  if (typeof window.renderTriadicPortals === 'function') {
    window.renderTriadicPortals();
  }
  if (typeof window.renderSidebar === 'function') {
    window.renderSidebar();
  }

  // 3. Setup Global Search Engine
  setupSearch('semanticSearchInput', 'semanticSearchDropdown');

  // 4. Setup Live Community Chat & Contextual Replies
  setupLiveCommunityChat();

  // 5. Setup Suggest Edits Modal
  setupSuggestEditsModal();

  // 6. Setup Hovercard Engine for Wiki Links
  setupHovercardEngine();

  // 7. Initialize Pixel Stars Background Canvas
  initPixelStarsCanvas();

  // 8. Setup Gentle Interactive Letter Physics & Floating for Title
  initInteractiveTitleLetters();

  // 9. Bind All Hero Card & Navigation Click Events
  bindHeroEvents();
  if (typeof window.bindUniversalClickDelegation === 'function') {
    window.bindUniversalClickDelegation();
  }

  // 10. Setup Dynamic Theme Color Wheel Controller
  setupThemeColorController();

  // 11. Setup Discord Authentication & Verified Account Manager
  setupDiscordAuth();

  // 12. Setup Sitewide Desktop & Mobile Scroll Auto-Hide Navigation Header
  setupScrollHideHeader();

  // Initial View State
  showPortalView();

  // =========================================================================
  // DYNAMIC THEME COLOR WHEEL CONTROLLER
  // =========================================================================
  function hexToRgb(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function setupThemeColorController() {
    const wheelBtn = document.getElementById('themeColorWheelBtn');
    const popover = document.getElementById('themeColorPopover');
    const closeBtn = document.getElementById('closeThemePopoverBtn');
    const colorPicker = document.getElementById('themeColorPicker');
    const swatches = document.querySelectorAll('.swatch-btn');
    const resetBtn = document.getElementById('resetThemeColorBtn');

    function applyThemeColor(hex) {
      if (!hex) return;
      const rgb = hexToRgb(hex);
      const glowRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55)`;
      const glowLightRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.22)`;

      document.documentElement.style.setProperty('--mw-theme-accent', hex);
      document.documentElement.style.setProperty('--mw-gold', hex);
      document.documentElement.style.setProperty('--mw-border-gold', hex);
      document.documentElement.style.setProperty('--mw-link-blue', hex);
      document.documentElement.style.setProperty('--mw-theme-glow', glowRgba);
      document.documentElement.style.setProperty('--mw-theme-glow-light', glowLightRgba);

      if (colorPicker) colorPicker.value = hex;
      localStorage.setItem('metawiki_theme_color', hex);
    }

    // Load saved color on startup
    const savedColor = localStorage.getItem('metawiki_theme_color');
    if (savedColor) {
      applyThemeColor(savedColor);
    }

    if (wheelBtn && popover) {
      wheelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.style.display = popover.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (closeBtn && popover) {
      closeBtn.addEventListener('click', () => {
        popover.style.display = 'none';
      });
    }

    document.addEventListener('click', (e) => {
      if (popover && popover.style.display === 'block' && !popover.contains(e.target) && e.target !== wheelBtn && !wheelBtn.contains(e.target)) {
        popover.style.display = 'none';
      }
    });

    if (colorPicker) {
      colorPicker.addEventListener('input', (e) => {
        applyThemeColor(e.target.value);
      });
    }

    swatches.forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        if (color) applyThemeColor(color);
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        document.documentElement.style.removeProperty('--mw-theme-accent');
        document.documentElement.style.removeProperty('--mw-gold');
        document.documentElement.style.removeProperty('--mw-border-gold');
        document.documentElement.style.removeProperty('--mw-link-blue');
        document.documentElement.style.removeProperty('--mw-theme-glow');
        document.documentElement.style.removeProperty('--mw-theme-glow-light');
        localStorage.removeItem('metawiki_theme_color');
        if (colorPicker) colorPicker.value = '#ffffff';
      });
    }
  }

  // =========================================================================
  // PIXEL FLOATING STARS BACKGROUND CANVAS (GENTLE MOUSE AVOIDANCE)
  // =========================================================================
  function initPixelStarsCanvas() {
    const canvas = document.getElementById('pixelStarsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -1000;
    let mouseY = -1000;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    const numStars = 160;
    const stars = [];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 2 : 3,
        speedY: 0.15 + Math.random() * 0.35,
        speedX: (Math.random() - 0.5) * 0.1,
        alpha: 0.2 + Math.random() * 0.8,
        twinkleSpeed: 0.005 + Math.random() * 0.02,
        twinkleDir: Math.random() < 0.5 ? 1 : -1
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = false;

      stars.forEach(s => {
        // Upward floating motion
        s.y -= s.speedY;
        s.x += s.speedX;

        // Gentle Mouse Repulsion (Stars avoid mouse cursor)
        const dx = s.x - mouseX;
        const dy = s.y - mouseY;
        const dist = Math.hypot(dx, dy);
        const repelRadius = 120;

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          s.x += (dx / dist) * force * 3.5;
          s.y += (dy / dist) * force * 3.5;
        }

        if (s.y < 0) { s.y = height; s.x = Math.random() * width; }
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;

        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha >= 0.95) { s.alpha = 0.95; s.twinkleDir = -1; }
        if (s.alpha <= 0.15) { s.alpha = 0.15; s.twinkleDir = 1; }

        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // =========================================================================
  // GENTLE INTERACTIVE TITLE & SUBTEXT LETTER MOTION
  // =========================================================================
  function initInteractiveTitleLetters() {
    const titleEl = document.querySelector('.centered-site-title');
    if (!titleEl) return;

    const text = titleEl.textContent.trim();
    titleEl.innerHTML = text.split('').map((char, i) => {
      if (char === ' ') return '<span class="interactive-letter-space">&nbsp;</span>';
      // Alternate delay so every other letter moves up while its neighbor moves down
      const delay = (i % 2 === 0) ? '0s' : '2.1s';
      return `<span class="interactive-letter" style="animation-delay: ${delay};">${char}</span>`;
    }).join('');

    const letters = titleEl.querySelectorAll('.interactive-letter');

    titleEl.addEventListener('mousemove', (e) => {
      letters.forEach(span => {
        const rect = span.getBoundingClientRect();
        const lx = rect.left + rect.width / 2;
        const ly = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - lx, e.clientY - ly);

        if (dist < 50) {
          const force = (50 - dist) / 50;
          const dy = (ly - e.clientY) < 0 ? 1 : -1;
          const offsetY = dy * force * 4;
          const themeAccent = getComputedStyle(document.documentElement).getPropertyValue('--mw-gold').trim() || '#ffffff';
          const themeGlow = getComputedStyle(document.documentElement).getPropertyValue('--mw-theme-glow').trim() || 'rgba(255, 255, 255, 0.6)';
          span.style.animationPlayState = 'paused';
          span.style.transform = `translateY(${offsetY}px) scale(${1 + force * 0.05})`;
          span.style.color = themeAccent;
          span.style.textShadow = `0 0 14px ${themeGlow}, 0 0 25px ${themeAccent}`;
        } else {
          span.style.animationPlayState = 'running';
          span.style.transform = '';
          span.style.color = '';
          span.style.textShadow = '';
        }
      });
    });

    titleEl.addEventListener('mouseleave', () => {
      letters.forEach(span => {
        span.style.animationPlayState = 'running';
        span.style.transform = '';
        span.style.color = '';
        span.style.textShadow = '';
      });
    });
  }

  // =========================================================================
  // HAWKINS RAINBOW CALIBRATION BAR POINTER HELPER
  // =========================================================================
  function createHawkinsRainbowBar(rawLevel) {
    let num = 500;
    if (typeof rawLevel === 'number') num = rawLevel;
    else if (typeof rawLevel === 'string') {
      const match = rawLevel.match(/\d+/);
      if (match) num = parseInt(match[0]);
    }

    const pct = Math.min(96, Math.max(4, (num / 1000) * 100));
    
    let color = '#fbbf24'; // Gold (700+)
    if (num < 200) color = '#ef4444';      // Red
    else if (num < 350) color = '#10b981'; // Emerald
    else if (num < 500) color = '#60a5fa'; // Blue
    else if (num < 600) color = '#a855f7'; // Violet
    else if (num < 700) color = '#38bdf8'; // Electric Cyan

    return `
      <div class="hawkins-mini-bar-wrapper" title="Dr. Hawkins Calibration Scale: LoC ${num}">
        <div class="hawkins-rainbow-track">
          <div class="hawkins-pointer-pin" style="left: ${pct}%; background-color: ${color}; box-shadow: 0 0 8px ${color};"></div>
        </div>
        <div class="hawkins-number-tag" style="color: ${color};">LoC ${num}</div>
      </div>
    `;
  }

  // =========================================================================
  // VIEW ROUTER CONTROLLER (with global nav active state management)
  // =========================================================================
  function updateNavActiveState(activeId) {
    document.querySelectorAll('.mw-nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const activeEl = document.getElementById(activeId);
    if (activeEl) activeEl.classList.add('active');
  }

  function showGlobalNav(visible) {
    const nav = document.getElementById('mwGlobalNav');
    if (nav) nav.style.display = visible ? '' : 'none';
    document.body.classList.toggle('article-view-active', !visible);
  }

  function showPortalView() {
    state.view = 'portal';
    document.body.classList.remove('article-view-active');
    document.getElementById('initiatoryPortalView').style.display = 'block';
    document.getElementById('articleReaderView').style.display = 'none';
    const forumsView = document.getElementById('forumsView');
    if (forumsView) forumsView.style.display = 'none';
    showGlobalNav(true);
    updateNavActiveState('navHomeBtn');
    window.scrollTo(0, 0);
  }

  function showForumsView() {
    state.view = 'forums';
    document.body.classList.remove('article-view-active');
    document.getElementById('initiatoryPortalView').style.display = 'none';
    document.getElementById('articleReaderView').style.display = 'none';
    const forumsView = document.getElementById('forumsView');
    if (forumsView) forumsView.style.display = 'block';
    showGlobalNav(true);
    updateNavActiveState('navForumsBtn');
    renderForums();
    window.scrollTo(0, 0);
  }

  function loadArticle(articleId) {
    const article = window.METAWIKI_DATA.articles.find(a => a.id === articleId);
    if (!article) return;

    state.view = 'article';
    state.currentArticleId = articleId;

    // Set body class for CSS scoping
    document.body.classList.add('article-view-active');

    // Switch View Containers
    document.getElementById('initiatoryPortalView').style.display = 'none';
    document.getElementById('articleReaderView').style.display = 'block';
    const forumsView = document.getElementById('forumsView');
    if (forumsView) forumsView.style.display = 'none';

    // Unhide headers immediately when article loads
    const globalNav = document.getElementById('mwGlobalNav');
    if (globalNav) globalNav.classList.remove('nav-hidden');
    const articleTopbar = document.querySelector('.mw-article-topbar');
    if (articleTopbar) articleTopbar.classList.remove('nav-hidden');

    // Set Titles & Breadcrumbs
    const titleEl = document.getElementById('articleMainTitle');
    if (titleEl) titleEl.textContent = article.title;

    const subEl = document.getElementById('articleMainSubtitle');
    if (subEl) subEl.textContent = article.shortDescription;

    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = article.title;

    // Render Infobox
    renderInfobox(article.infobox);

    // Render Main Content HTML
    const mainText = document.getElementById('articleMainText');
    if (mainText) {
      mainText.innerHTML = article.contentHTML;
    }

    // Build Dynamic TOC Sidebar & Initialize ScrollSpy
    buildDynamicTOC();
    initScrollSpy();

    // Instantly scroll to top of article without smooth scroll lag
    window.scrollTo(0, 0);
  }

  function loadRandomArticle() {
    const articles = window.METAWIKI_DATA.articles;
    const randomIndex = Math.floor(Math.random() * articles.length);
    loadArticle(articles[randomIndex].id);
  }

  // =========================================================================
  // DYNAMIC TOC SIDEBAR & SCROLLSPY ENGINE
  // =========================================================================
  function buildDynamicTOC() {
    const tocList = document.getElementById('articleTOCList');
    const articleBody = document.getElementById('articleMainText');
    if (!tocList || !articleBody) return;

    const headings = articleBody.querySelectorAll('h2');
    if (headings.length === 0) {
      tocList.innerHTML = `<li class="toc-sidebar-item active">1. Main Overview</li>`;
      return;
    }

    tocList.innerHTML = Array.from(headings).map((h, i) => {
      const title = h.textContent.trim();
      const id = h.id || `heading-${i}`;
      h.id = id;
      return `<li class="toc-sidebar-item ${i === 0 ? 'active' : ''}" data-target="${id}">${title}</li>`;
    }).join('');

    tocList.querySelectorAll('.toc-sidebar-item').forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initScrollSpy() {
    const headings = document.querySelectorAll('#articleMainText h2');
    const tocItems = document.querySelectorAll('#articleTOCList .toc-sidebar-item');

    window.addEventListener('scroll', () => {
      if (state.view !== 'article') return;
      let currentId = '';
      headings.forEach(h => {
        const rect = h.getBoundingClientRect();
        if (rect.top <= 180) currentId = h.id;
      });

      if (currentId) {
        tocItems.forEach(item => {
          item.classList.toggle('active', item.getAttribute('data-target') === currentId);
        });
      }
    });
  }

  // =========================================================================
  // WIKIPEDIA-STYLE HOVERCARD ENGINE
  // =========================================================================
  function setupHovercardEngine() {
    const hovercard = document.getElementById('mwHovercard');
    let hoverTimeout = null;

    document.addEventListener('mouseover', (e) => {
      const wikilink = e.target.closest('.mw-wikilink');
      if (!wikilink) return;

      const wikiId = wikilink.getAttribute('data-wiki-id');
      const article = window.METAWIKI_DATA.articles.find(a => a.id === wikiId);
      if (!article || !hovercard) return;

      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        hovercard.innerHTML = `
          <div class="mw-hovercard-title">${article.title}</div>
          ${article.infobox && article.infobox.imagePath ? `<img src="${article.infobox.imagePath}" alt="${article.title}" class="mw-hovercard-img">` : ''}
          <div class="mw-hovercard-excerpt">${article.shortDescription}</div>
          <div style="margin-top: 0.5rem;">${createHawkinsRainbowBar(article.hawkinsCalibration)}</div>
        `;

        const rect = wikilink.getBoundingClientRect();
        hovercard.style.display = 'block';
        hovercard.style.top = `${window.scrollY + rect.bottom + 8}px`;
        hovercard.style.left = `${Math.min(rect.left, window.innerWidth - 340)}px`;
      }, 150);
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('.mw-wikilink') || e.target.closest('#mwHovercard')) {
        hoverTimeout = setTimeout(() => {
          if (hovercard) hovercard.style.display = 'none';
        }, 300);
      }
    });

    if (hovercard) {
      hovercard.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
      hovercard.addEventListener('mouseleave', () => { hovercard.style.display = 'none'; });
    }

    document.addEventListener('click', (e) => {
      const wikilink = e.target.closest('.mw-wikilink');
      if (wikilink) {
        const wikiId = wikilink.getAttribute('data-wiki-id');
        if (wikiId) {
          if (hovercard) hovercard.style.display = 'none';
          loadArticle(wikiId);
        }
      }
    });
  }

  // =========================================================================
  // DIMENSION VIEWER HOVER-PAUSE & FULLSCREEN CONTROLLER
  // =========================================================================
  function initDimensionViewer() {
    const wrapper = document.getElementById('dimensionMiniWrapper');
    const btnFullscreen = document.getElementById('btnFullscreenDimension');
    const fullscreenModal = document.getElementById('dimensionFullscreenModal');
    const btnCloseFullscreen = document.getElementById('closeDimensionFullscreenBtn');

    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => { state.isHoverPaused = true; });
      wrapper.addEventListener('mouseleave', () => { state.isHoverPaused = false; });
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

    // Force Start directly on ∞_ABSOLUTE (Infinity Slide: snapSections index 1)
    let currentSlideIndex = 1;

    const attemptInfinityLock = () => {
      let locked = false;
      const miniDriver = document.querySelector('#dimensionMiniWrapper .scroll-driver');
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

    // Timeout safety locks
    setTimeout(attemptInfinityLock, 100);
    setTimeout(attemptInfinityLock, 350);
    setTimeout(attemptInfinityLock, 800);
    setTimeout(attemptInfinityLock, 1500);

    // Clean Synchronized 7-Second Slide Pacing
    setInterval(() => {
      if (state.isHoverPaused) return; // Pause on hover!
      const miniDriver = document.querySelector('#dimensionMiniWrapper .scroll-driver');
      const fsDriver = document.querySelector('#cnscns-widget-fullscreen .scroll-driver');
      const activeDriver = (fullscreenModal && fullscreenModal.style.display === 'block' && fsDriver) ? fsDriver : miniDriver;

      if (activeDriver) {
        const snapSections = activeDriver.querySelectorAll('.snap-section');
        if (snapSections.length > 1) {
          // Intelligently detect current section index from scrollTop
          const currentScrollTop = activeDriver.scrollTop;
          let detectedIndex = 1;
          let minDiff = Infinity;

          snapSections.forEach((sec, idx) => {
            if (idx < 1) return; // Skip intro section 0
            const diff = Math.abs(sec.offsetTop - currentScrollTop);
            if (diff < minDiff) {
              minDiff = diff;
              detectedIndex = idx;
            }
          });

          // Advance to next section cleanly
          currentSlideIndex = detectedIndex + 1;
          if (currentSlideIndex >= snapSections.length) {
            currentSlideIndex = 1; // Wrap back to Infinity slide!
          }

          const targetSection = snapSections[currentSlideIndex];
          if (targetSection) {
            activeDriver.scrollTo({
              top: targetSection.offsetTop,
              behavior: 'smooth'
            });
          }
        }
      }
    }, 7000); // Exactly 7 seconds per slide!
  }

  // =========================================================================
  // DISCORD AUTHENTICATION & PROFILE CONTROLLER
  // =========================================================================
  function setupDiscordAuth() {
    const defaultUser = {
      username: 'SeekerOfWisdom',
      discriminator: '1337',
      avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      role: 'Initiate Scholar',
      isVerified: true
    };

    let currentUser = JSON.parse(localStorage.getItem('metawiki_discord_user')) || defaultUser;

    const discordBtn = document.getElementById('navDiscordBtn');
    const discordLabel = document.getElementById('discordNavLabel');
    const modal = document.getElementById('discordLoginModal');
    const closeBtn = document.getElementById('closeDiscordModalBtn');
    const confirmBtn = document.getElementById('confirmDiscordLoginBtn');
    const handleInput = document.getElementById('discordHandleInput');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const userBanner = document.getElementById('chatUserBanner');

    function updateUI() {
      if (discordLabel) {
        if (currentUser && currentUser.username) {
          discordLabel.innerHTML = `${currentUser.username} <span style="color:#57F287; font-size:0.75rem;">✓</span>`;
        } else {
          discordLabel.textContent = 'Discord';
        }
      }

      if (userBanner) {
        userBanner.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <img src="${currentUser.avatar}" style="width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #5865F2;">
            <div>
              <strong style="color: #fff;">${currentUser.username}</strong>
              <span style="font-size: 0.7rem; color: #5865F2; font-weight: 800; margin-left: 0.3rem;">[Discord Verified ✓]</span>
            </div>
          </div>
          <button id="discordSwitchBtn" style="background: none; border: none; color: var(--mw-text-muted); cursor: pointer; font-size: 0.75rem; text-decoration: underline;">Switch Account</button>
        `;

        const switchBtn = document.getElementById('discordSwitchBtn');
        if (switchBtn) {
          switchBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'flex';
          });
        }
      }
    }

    updateUI();

    if (discordBtn && modal) {
      discordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    avatarOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        avatarOptions.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const previewImg = document.getElementById('discordAvatarPreview');
        if (previewImg) previewImg.src = opt.getAttribute('data-avatar');
      });
    });

    if (handleInput) {
      handleInput.addEventListener('input', (e) => {
        const val = e.target.value.trim() || 'SeekerOfWisdom';
        const namePreview = document.getElementById('discordNamePreview');
        if (namePreview) namePreview.textContent = val;
      });
    }

    if (confirmBtn && modal) {
      confirmBtn.addEventListener('click', () => {
        const selectedAvatar = document.querySelector('.avatar-option.selected')?.getAttribute('data-avatar') || 'https://cdn.discordapp.com/embed/avatars/0.png';
        const handle = handleInput && handleInput.value.trim() ? handleInput.value.trim() : 'HermeticInitiate';

        currentUser = {
          username: handle,
          discriminator: String(Math.floor(1000 + Math.random() * 9000)),
          avatar: selectedAvatar,
          role: 'Verified Initiated Scholar',
          isVerified: true
        };

        localStorage.setItem('metawiki_discord_user', JSON.stringify(currentUser));
        updateUI();
        modal.style.display = 'none';
      });
    }
  }

  // =========================================================================
  // DESKTOP & MOBILE SCROLL AUTO-HIDE NAVIGATION BAR
  // =========================================================================
  function setupScrollHideHeader() {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const globalNav = document.getElementById('mwGlobalNav');
      const articleTopbar = document.querySelector('.mw-article-topbar');

      if (currentScrollY > lastScrollY + 6 && currentScrollY > 50) {
        // Scrolling DOWN — hide headers
        if (globalNav) globalNav.classList.add('nav-hidden');
        if (articleTopbar) articleTopbar.classList.add('nav-hidden');
      } else if (currentScrollY < lastScrollY - 4) {
        // Scrolling UP — reveal headers
        if (globalNav) globalNav.classList.remove('nav-hidden');
        if (articleTopbar) articleTopbar.classList.remove('nav-hidden');
      }
      lastScrollY = currentScrollY;
    });
  }

  // =========================================================================
  // LIVE COMMUNITY DISCORD CHAT CONTROLLER
  // =========================================================================
  function setupLiveCommunityChat() {
    const launcher = document.getElementById('liveChatLauncher');
    const drawer = document.getElementById('liveChatDrawer');
    const closeBtn = document.getElementById('closeLiveChatBtn');
    const input = document.getElementById('liveChatInput');
    const sendBtn = document.getElementById('liveChatSendBtn');
    const msgContainer = document.getElementById('liveChatMessages');
    const emojiBtns = document.querySelectorAll('.chat-emoji-btn');

    const defaultMessages = [
      {
        user: 'GnosticScholar_42',
        avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
        verified: true,
        text: 'Welcome to MetaWiki Live Discord Chat! Discussing John 1:1 Logos and Atman is Brahman connection.',
        time: '18:40'
      },
      {
        user: 'SophiaContemplative',
        avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
        verified: true,
        text: 'Has anyone cross-referenced Meister Eckhart\'s non-dual Godhead with Advaita Vedanta today?',
        time: '18:45'
      }
    ];

    let chatHistory = JSON.parse(localStorage.getItem('metawiki_chat_history')) || defaultMessages;

    function renderMessages() {
      if (!msgContainer) return;
      msgContainer.innerHTML = chatHistory.map(msg => `
        <div class="chat-msg" style="display: flex; gap: 0.6rem; margin-bottom: 0.6rem; align-items: flex-start;">
          <img src="${msg.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" style="width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #5865F2; flex-shrink: 0; margin-top: 2px;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem;">
              <strong style="color: #fff;">${msg.user}</strong>
              ${msg.verified ? '<span style="color: #57F287; font-size: 0.7rem; font-weight: 800;">[✓ Verified]</span>' : ''}
              <span style="color: var(--mw-text-muted); font-size: 0.7rem;">${msg.time || '19:00'}</span>
            </div>
            <div style="font-size: 0.84rem; color: #e2e8f0; margin-top: 2px; line-height: 1.4;">${msg.text}</div>
          </div>
        </div>
      `).join('');
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    renderMessages();

    if (launcher && drawer) {
      launcher.addEventListener('click', () => {
        drawer.style.display = drawer.style.display === 'none' ? 'flex' : 'none';
        const badge = document.getElementById('chatUnreadBadge');
        if (badge) badge.style.display = 'none';
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => { drawer.style.display = 'none'; });
    }

    emojiBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const emoji = btn.getAttribute('data-emoji');
        if (input && emoji) {
          input.value += emoji;
          input.focus();
        }
      });
    });

    function sendMessage() {
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;

      const userObj = JSON.parse(localStorage.getItem('metawiki_discord_user')) || { username: 'SeekerOfWisdom', avatar: 'https://cdn.discordapp.com/embed/avatars/0.png' };
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;

      chatHistory.push({
        user: userObj.username || 'SeekerOfWisdom',
        avatar: userObj.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png',
        verified: true,
        text: text,
        time: timeStr
      });

      localStorage.setItem('metawiki_chat_history', JSON.stringify(chatHistory));
      input.value = '';
      renderMessages();

      // Automated community reply
      setTimeout(() => {
        const scholarReplies = [
          "Fascinating contemplation! That aligns directly with Hawkins LoC 600 calibration.",
          "Deep observation. Notice how the observer self remains unmoving behind that thought.",
          "The Hermetic principle of Mentalism (The All is Mind) echoes this exact realization!",
          "Yes! Sri Aurobindo and Plotinus described that exact luminous expansion."
        ];
        const randomReply = scholarReplies[Math.floor(Math.random() * scholarReplies.length)];
        chatHistory.push({
          user: 'HermeticMaster#0001',
          avatar: 'https://cdn.discordapp.com/embed/avatars/3.png',
          verified: true,
          text: randomReply,
          time: `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`
        });
        localStorage.setItem('metawiki_chat_history', JSON.stringify(chatHistory));
        renderMessages();
      }, 1500);
    }

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
    }
  }

  // =========================================================================
  // SUGGEST EDITS MODAL & HERO ACTIONS
  // =========================================================================
  function setupSuggestEditsModal() {
    const modal = document.getElementById('suggestEditModal');
    const openHeaderBtn = document.getElementById('openSuggestEditBtnHeader');
    const openTopbarLink = document.getElementById('topbarSuggestEditLink');
    const closeBtn = document.getElementById('closeSuggestEditBtn');
    const cancelBtn = document.getElementById('cancelSuggestEditBtn');
    const submitBtn = document.getElementById('submitSuggestEditBtn');

    function openModal() { if (modal) modal.style.display = 'flex'; }
    function closeModal() { if (modal) modal.style.display = 'none'; }

    if (openHeaderBtn) openHeaderBtn.addEventListener('click', openModal);
    if (openTopbarLink) openTopbarLink.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        alert('✨ Edit Proposal Submitted Successfully!\n\nYour proposal has been logged for peer review.');
        closeModal();
      });
    }
  }

  function bindHeroEvents() {
    const heroFoolCard = document.getElementById('heroFoolCard');
    if (heroFoolCard) heroFoolCard.addEventListener('click', () => loadArticle('fool-archetype'));

    const heroHermeticCard = document.getElementById('heroHermeticCard');
    if (heroHermeticCard) heroHermeticCard.addEventListener('click', () => loadArticle('kybalion-seven-principles'));

    const heroJungCard = document.getElementById('heroJungCard');
    if (heroJungCard) heroJungCard.addEventListener('click', () => loadArticle('jungian-archetypes-shadow'));

    const heroRandomBtn = document.getElementById('heroRandomBtn');
    if (heroRandomBtn) heroRandomBtn.addEventListener('click', loadRandomArticle);

    const articleRandomBtn = document.getElementById('articleRandomBtn');
    if (articleRandomBtn) articleRandomBtn.addEventListener('click', loadRandomArticle);

    const heroSpatialMapBtn = document.getElementById('heroSpatialMapBtn');
    if (heroSpatialMapBtn) heroSpatialMapBtn.addEventListener('click', showSpatialMapView);

    const closeSpatialMapBtn = document.getElementById('closeSpatialMapBtn');
    if (closeSpatialMapBtn) closeSpatialMapBtn.addEventListener('click', showPortalView);

    // Global Nav Bar Handlers
    const navHomeBtn = document.getElementById('navHomeBtn');
    if (navHomeBtn) navHomeBtn.addEventListener('click', (e) => { e.preventDefault(); showPortalView(); });

    const navSpatialBtn = document.getElementById('navSpatialBtn');
    if (navSpatialBtn) navSpatialBtn.addEventListener('click', (e) => { e.preventDefault(); showSpatialMapView(); });

    const sidebarHome = document.getElementById('sidebarHomeBtn');
    if (sidebarHome) sidebarHome.addEventListener('click', (e) => { e.preventDefault(); showPortalView(); });

    const articleHome = document.getElementById('articleHomeLink');
    if (articleHome) articleHome.addEventListener('click', (e) => { e.preventDefault(); showPortalView(); });

    const breadcrumbHome = document.getElementById('breadcrumbHome');
    if (breadcrumbHome) breadcrumbHome.addEventListener('click', (e) => { e.preventDefault(); showPortalView(); });

    // Guides Navigation Handlers
    const navGuidesBtn = document.getElementById('navGuidesBtn');
    if (navGuidesBtn) navGuidesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalView();
      updateNavActiveState('navGuidesBtn');
      setTimeout(() => {
        const guidesEl = document.getElementById('guidesSection');
        if (guidesEl) guidesEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    const articleGuidesLink = document.getElementById('articleGuidesLink');
    if (articleGuidesLink) articleGuidesLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalView();
      const guidesEl = document.getElementById('guidesSection');
      if (guidesEl) guidesEl.scrollIntoView({ behavior: 'smooth' });
    });

    // Forums Navigation Handlers
    const navForumsBtn = document.getElementById('navForumsBtn');
    if (navForumsBtn) navForumsBtn.addEventListener('click', (e) => { e.preventDefault(); showForumsView(); });

    const articleForumsLink = document.getElementById('articleForumsLink');
    if (articleForumsLink) articleForumsLink.addEventListener('click', (e) => { e.preventDefault(); showForumsView(); });

    // Forum Category Filter Pills
    document.querySelectorAll('.forum-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.forum-filter-pill').forEach(b => {
          b.classList.remove('active');
          b.style.background = 'var(--mw-bg-card)';
          b.style.color = 'var(--mw-text)';
          b.style.border = '1px solid var(--mw-border)';
        });
        btn.classList.add('active');
        btn.style.background = 'var(--mw-gold)';
        btn.style.color = '#000';
        btn.style.border = 'none';
        renderForums(btn.getAttribute('data-cat'));
      });
    });

    const forumCreateBtn = document.getElementById('forumCreateTopicBtn');
    if (forumCreateBtn) {
      forumCreateBtn.addEventListener('click', () => {
        const title = prompt("Enter your topic title:");
        if (!title) return;
        const body = prompt("Enter your initial contemplation body:");
        if (!body) return;

        window.METAWIKI_DATA.forumTopics.unshift({
          id: `topic-${Date.now()}`,
          category: "Universal Concepts & Metaphysical Mechanics",
          title: title,
          author: "Seeker_Of_Light",
          avatarColor: "#10b981",
          timestamp: "Just now",
          repliesCount: 0,
          upvotes: 1,
          pinned: false,
          body: body
        });
        renderForums();
      });
    }
  }

  function getArticleViews(wikiId) {
    if (!wikiId || !window.METAWIKI_DATA.articles) return '185,000';
    const article = window.METAWIKI_DATA.articles.find(a => a.id === wikiId);
    return article && article.views ? article.views : '185,000';
  }

  function renderFeaturedCarouselGrid() {
    const container = document.getElementById('featuredCarouselGrid');
    if (!container || !window.METAWIKI_DATA.featuredArticles) return;

    container.innerHTML = window.METAWIKI_DATA.featuredArticles.map(card => `
      <div class="featured-card" data-wiki="${card.wikiId}">
        <div>
          <div class="featured-card-thumb-wrapper">
            <img src="${card.imagePath}" alt="${card.title}" class="featured-card-img">
          </div>
          <div class="featured-card-title">${card.title}</div>
          <div class="featured-card-subtitle">${card.subtitle}</div>
        </div>
        <div class="featured-card-link" style="display: flex; align-items: center; justify-content: space-between;">
          <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(card.wikiId)}</span>
          <div style="display: flex; align-items: center; gap: 0.3rem;">
            <span>Read More</span> <i class="ph ph-arrow-right"></i>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.featured-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-wiki');
        if (target) loadArticle(target);
      });
    });
  }

  function renderTriadicPortals() {
    const guidesGrid = document.getElementById('guidesGrid');
    const faithsGrid = document.getElementById('faithsGrid');
    const conceptsGrid = document.getElementById('conceptsGrid');
    const avatarsGrid = document.getElementById('avatarsGrid');

    if (guidesGrid && window.METAWIKI_DATA.guides) {
      guidesGrid.innerHTML = window.METAWIKI_DATA.guides.map(g => `
        <div class="triadic-card" data-wiki="${g.wikiId}">
          <div>
            <div class="triadic-thumbnail-pic" style="overflow: hidden;">
              <img src="${g.imagePath}" alt="${g.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
            </div>
            <div class="triadic-card-title">${g.title}</div>
            <div class="triadic-card-subtitle">${g.subtitle}</div>
            <div class="triadic-card-summary">${g.summary}</div>
          </div>
          <div class="triadic-card-footer">
            ${createHawkinsRainbowBar(g.hawkinsLevel)}
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(g.wikiId)}</span>
              <span>Open Guide ➔</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    if (faithsGrid) {
      faithsGrid.innerHTML = window.METAWIKI_DATA.triadicPortals.faiths.map(f => `
        <div class="triadic-card" data-wiki="${f.wikiId}">
          <div>
            <div class="triadic-thumbnail-pic" style="overflow: hidden;">
              <img src="${f.imagePath}" alt="${f.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
            </div>
            <div class="triadic-card-title">${f.title}</div>
            <div class="triadic-card-subtitle">${f.subtitle}</div>
            <div class="triadic-card-summary">${f.summary}</div>
          </div>
          <div class="triadic-card-footer">
            ${createHawkinsRainbowBar(f.hawkinsLevel)}
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(f.wikiId)}</span>
              <span>Read Article ➔</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    if (conceptsGrid) {
      conceptsGrid.innerHTML = window.METAWIKI_DATA.triadicPortals.concepts.map(c => `
        <div class="triadic-card" data-wiki="${c.wikiId}">
          <div>
            <div class="triadic-thumbnail-pic" style="overflow: hidden;">
              <img src="${c.imagePath}" alt="${c.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
            </div>
            <div class="triadic-card-title">${c.title}</div>
            <div class="triadic-card-subtitle">${c.subtitle}</div>
            <div class="triadic-card-summary">${c.summary}</div>
          </div>
          <div class="triadic-card-footer">
            ${createHawkinsRainbowBar(c.hawkinsLevel)}
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(c.wikiId)}</span>
              <span>Read Article ➔</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    if (avatarsGrid) {
      avatarsGrid.innerHTML = window.METAWIKI_DATA.triadicPortals.avatars.map(a => `
        <div class="triadic-card" data-wiki="${a.wikiId}">
          <div>
            <div class="triadic-thumbnail-pic" style="overflow: hidden;">
              <img src="${a.imagePath}" alt="${a.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
            </div>
            <div class="triadic-card-title">${a.title}</div>
            <div class="triadic-card-subtitle">${a.role}</div>
            <div class="triadic-card-summary">${a.summary}</div>
          </div>
          <div class="triadic-card-footer">
            ${createHawkinsRainbowBar(a.hawkinsLevel)}
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="card-views-footer"><i class="ph ph-eye"></i> ${getArticleViews(a.wikiId)}</span>
              <span>Open Article ➔</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    document.querySelectorAll('.triadic-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-wiki');
        if (target) loadArticle(target);
      });
    });
  }

  function renderForums(filterCategory = 'all') {
    const list = document.getElementById('forumTopicsList');
    if (!list || !window.METAWIKI_DATA.forumTopics) return;

    let storedVotes = {};
    try {
      storedVotes = JSON.parse(localStorage.getItem('metawiki_forum_votes')) || {};
    } catch(e) {}

    let topics = window.METAWIKI_DATA.forumTopics;
    if (filterCategory !== 'all' && filterCategory !== 'top') {
      topics = topics.filter(t => t.category === filterCategory);
    } else if (filterCategory === 'top') {
      topics = [...topics].sort((a, b) => (b.upvotes + (storedVotes[b.id] || 0)) - (a.upvotes + (storedVotes[a.id] || 0)));
    }

    list.innerHTML = topics.map(t => {
      const userVote = storedVotes[t.id] || 0; // +1, -1, 0
      const netScore = t.upvotes + userVote;
      const upvotedClass = userVote === 1 ? 'upvoted' : '';
      const downvotedClass = userVote === -1 ? 'downvoted' : '';

      return `
        <div class="forum-topic-card" data-id="${t.id}">
          <!-- Reddit Style Upvote / Downvote Area -->
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
            <div class="forum-topic-header">
              <span class="forum-category-pill">${t.category}</span>
              <span style="font-size: 0.78rem; color: var(--mw-text-muted);">${t.timestamp}</span>
            </div>
            <div class="forum-topic-title">${t.title}</div>
            <div class="forum-topic-body">${t.body}</div>
            <div class="forum-topic-footer">
              <div class="forum-topic-author">
                <div class="forum-author-avatar" style="background: ${t.avatarColor};">${t.author.charAt(0)}</div>
                <span>${t.author}</span>
              </div>
              <div style="display: flex; gap: 1rem;">
                <span>💬 ${t.repliesCount} replies</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind Vote Buttons
    list.querySelectorAll('.vote-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = btn.getAttribute('data-id');
        const currentVote = storedVotes[topicId] || 0;
        storedVotes[topicId] = currentVote === 1 ? 0 : 1;
        localStorage.setItem('metawiki_forum_votes', JSON.stringify(storedVotes));
        renderForums(filterCategory);
      });
    });

    list.querySelectorAll('.vote-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = btn.getAttribute('data-id');
        const currentVote = storedVotes[topicId] || 0;
        storedVotes[topicId] = currentVote === -1 ? 0 : -1;
        localStorage.setItem('metawiki_forum_votes', JSON.stringify(storedVotes));
        renderForums(filterCategory);
      });
    });
  }

  function renderSidebar() {
    const nav = window.METAWIKI_DATA.navigationSidebar;
    const mainList = document.getElementById('sidebarMainList');

    if (mainList) {
      mainList.innerHTML = nav.main.map(m => `
        <li><a href="#" class="sidebar-link" data-id="${m.id}">${m.title}</a></li>
      `).join('');
    }

    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('data-id');
        if (id === 'main-portal') showPortalView();
        else loadArticle(id);
      });
    });
  }

  function renderInfobox(data) {
    const container = document.getElementById('mwInfoboxContainer');
    if (!container || !data) {
      if (container) container.innerHTML = '';
      return;
    }

    let rows = data.data ? data.data.map(d => `
      <tr><th>${d.label}</th><td>${d.value}</td></tr>
    `).join('') : '';

    let imgHeader = data.imagePath ? `<div style="text-align: center; padding: 0.5rem;"><img src="${data.imagePath}" alt="${data.title}" style="width: 100%; max-height: 180px; object-fit: cover; border-radius: 6px;"></div>` : '';

    container.innerHTML = `
      <table class="infobox">
        <tr><th colspan="2" class="infobox-title">${data.title}</th></tr>
        <tr><td colspan="2">${imgHeader}<div style="font-size: 0.75rem; color: var(--mw-text-muted); margin-top: 4px; text-align: center;">${data.imageCaption || ''}</div></td></tr>
        ${rows}
      </table>
    `;
  }

  function setupSearch(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;

    // Trending Articles list shown by default when search bar is clicked
    const trendingArticles = [
      { id: "divine-logos", tag: "🔥 Trending" },
      { id: "advaita-vedanta-nonduality", tag: "🔥 Popular" },
      { id: "patanjali-eight-limbs", tag: "🔥 Trending" },
      { id: "jungian-archetypes-shadow", tag: "🔥 Popular" },
      { id: "ten-sephirot-tree-of-life", tag: "🔥 Trending" }
    ];

    function renderTrending() {
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
        <div style="padding: 0.5rem 1rem; font-family: var(--font-heading); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--mw-text-muted); letter-spacing: 0.05em; background: rgba(0,0,0,0.3); border-bottom: 1px solid var(--mw-border);">
          🔥 Trending & Popular Contemplations
        </div>
        ${trendingItems}
      `;
      dropdown.style.display = 'block';
      bindDropdownItems();
    }

    function bindDropdownItems() {
      dropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          dropdown.style.display = 'none';
          input.value = '';
          loadArticle(item.getAttribute('data-id'));
        });
      });
    }

    // Auto-guessing dictionary for intelligent query expansions
    const autoGuessMap = {
      'god': ['divine-logos', 'ein-sof-infinite', 'atman-brahman-identity', 'wahdat-al-wujud'],
      'divine': ['divine-logos', 'ninety-nine-divine-names', 'ten-sephirot-tree-of-life'],
      'christ': ['divine-logos', 'hesychasm-contemplative-prayer', 'nag-hammadi-codices'],
      'mind': ['patanjali-eight-limbs', 'freud-structural-model', 'transpersonal-observer-self', 'advaita-vedanta-nonduality'],
      'ego': ['freud-structural-model', 'fana-annihilation-self', 'anatta-nonself', 'transpersonal-observer-self'],
      'self': ['atman-brahman-identity', 'anatta-nonself', 'transpersonal-observer-self', 'jungian-archetypes-shadow'],
      'soul': ['atman-brahman-identity', 'merkabah-mysticism', 'subtle-body-nadis-chakras'],
      'energy': ['subtle-body-nadis-chakras', 'kundalini-shakti', 'patanjali-eight-limbs'],
      'breath': ['patanjali-eight-limbs', 'hesychasm-contemplative-prayer', 'subtle-body-nadis-chakras'],
      'shadow': ['jungian-archetypes-shadow', 'nag-hammadi-codices', 'freud-structural-model'],
      'light': ['hesychasm-contemplative-prayer', 'ein-sof-infinite', 'divine-logos']
    };

    input.addEventListener('focus', () => {
      if (!input.value.trim()) {
        renderTrending();
      }
    });

    input.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!input.value.trim()) {
        renderTrending();
      }
    });

    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderTrending();
        return;
      }

      // 1. Direct Title & Description Matches
      let matches = window.METAWIKI_DATA.articles.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.shortDescription.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      ).map(a => ({ ...a, tag: '📖 Article' }));

      // 2. Auto-Guessing Semantic Expansion
      let autoGuessedIds = new Set();
      Object.keys(autoGuessMap).forEach(key => {
        if (q.includes(key) || key.includes(q)) {
          autoGuessMap[key].forEach(id => autoGuessedIds.add(id));
        }
      });

      autoGuessedIds.forEach(id => {
        if (!matches.some(m => m.id === id)) {
          const guessedArticle = window.METAWIKI_DATA.articles.find(a => a.id === id);
          if (guessedArticle) {
            matches.push({ ...guessedArticle, tag: '✨ Auto-guess' });
          }
        }
      });

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div style="padding: 1rem; color: var(--mw-text-muted); font-size: 0.85rem; text-align: center;">
            No direct matches found. Try exploring <a href="#" id="searchFallbackBtn" style="color: var(--mw-gold); font-weight: bold;">Interactive Spatial Physics Map ➔</a>
          </div>
        `;
        dropdown.style.display = 'block';
        const fallbackBtn = document.getElementById('searchFallbackBtn');
        if (fallbackBtn) {
          fallbackBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            dropdown.style.display = 'none';
            showSpatialMapView();
          });
        }
        return;
      }

      dropdown.innerHTML = `
        <div style="padding: 0.4rem 1rem; font-family: var(--font-heading); font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: var(--mw-text-muted); letter-spacing: 0.05em; background: rgba(0,0,0,0.3); border-bottom: 1px solid var(--mw-border);">
          Matching & Auto-Guessed Articles (${matches.length})
        </div>
        ${matches.map(m => `
          <div class="search-dropdown-item" data-id="${m.id}" style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--mw-border); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <strong style="color: var(--mw-gold); font-family: var(--font-heading); font-size: 0.95rem;">${m.title}</strong>
              <div style="font-size: 0.8rem; color: var(--mw-text-muted);">${m.shortDescription}</div>
            </div>
            <span style="font-size: 0.7rem; font-weight: 800; background: ${m.tag.includes('Auto-guess') ? 'rgba(168, 85, 247, 0.2)' : 'rgba(99, 102, 241, 0.2)'}; color: ${m.tag.includes('Auto-guess') ? 'var(--mw-violet)' : '#93c5fd'}; border: 1px solid ${m.tag.includes('Auto-guess') ? 'var(--mw-border-violet)' : 'rgba(147, 197, 253, 0.3)'}; padding: 0.15rem 0.5rem; border-radius: 10px; flex-shrink: 0; margin-left: 0.5rem;">${m.tag}</span>
          </div>
        `).join('')}
      `;

      dropdown.style.display = 'block';
      bindDropdownItems();
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }
});
