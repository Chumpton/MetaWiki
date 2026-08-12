const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

// 1. Update initial state object
const oldStateStr = `  const state = {
    view: 'portal', // 'portal', 'spatial', 'article'
    currentArticleId: 'divine-logos',
    isHoverPaused: false,
    theme: localStorage.getItem('metawiki_theme') || 'dark'
  };`;

const newStateStr = `  const state = {
    view: 'portal', // 'portal', 'spatial', 'article'
    currentArticleId: 'divine-logos',
    isHoverPaused: false,
    theme: localStorage.getItem('metawiki_theme') || 'dark',
    feedCategory: 'foryou',
    feedSortBy: 'foryou',
    feedPage: 1,
    feedBatchSize: 24,
    userInterests: JSON.parse(localStorage.getItem('metawiki_user_interests')) || [
      'Non-Duality', 'World Religions & Gnosticism', 'Depth & Transpersonal Psychology', 'Judaism & Kabbalah', 'Sacred Geometry & Quantum Metaphysics'
    ]
  };`;

if (appCode.includes(oldStateStr)) {
  appCode = appCode.replace(oldStateStr, newStateStr);
}

// 2. Replace renderTriadicPortals call with renderPortalFeed setup in DOMContentLoaded
appCode = appCode.replace('renderTriadicPortals();', 'initPortalFeedEngine();');

// 3. Add the complete initPortalFeedEngine and setupInterestsModal implementation
const feedEngineCode = `
  // =========================================================================
  // CATEGORY SELECT & PERSONALIZED 'FOR YOU' FEED ENGINE
  // =========================================================================
  const AVAILABLE_INTEREST_TAGS = [
    'Non-Duality', 'World Religions & Gnosticism', 'Judaism & Kabbalah',
    'Islam & Sufism', 'Hinduism & Advaita Vedanta', 'Buddhism & Zen',
    'Hermeticism & Alchemy', 'Western Philosophy & Neoplatonism',
    'Depth & Transpersonal Psychology', 'Sacred Geometry & Quantum Metaphysics'
  ];

  function initPortalFeedEngine() {
    setupCategoryTabs();
    setupSortSelector();
    setupInterestsModal();
    setupLoadMoreBtn();
    renderPortalFeed();
  }

  function setupCategoryTabs() {
    const tabsContainer = document.getElementById('categoryTabsBar');
    if (!tabsContainer) return;

    tabsContainer.querySelectorAll('.cat-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabsContainer.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.feedCategory = btn.getAttribute('data-cat');
        state.feedPage = 1;
        renderPortalFeed();
      });
    });
  }

  function setupSortSelector() {
    const sortSelect = document.getElementById('feedSortSelect');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
      state.feedSortBy = e.target.value;
      state.feedPage = 1;
      renderPortalFeed();
    });
  }

  function setupLoadMoreBtn() {
    const loadMoreBtn = document.getElementById('loadMoreFeedBtn');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
      state.feedPage += 1;
      renderPortalFeed(true); // append mode
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
      grid.innerHTML = AVAILABLE_INTEREST_TAGS.map(tag => {
        const isSelected = state.userInterests.includes(tag);
        return \`<button class="interests-chip-btn \${isSelected ? 'selected' : ''}" data-tag="\${tag}">\${isSelected ? '✓ ' : ''}\${tag}</button>\`;
      }).join('');

      grid.querySelectorAll('.interests-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tag = btn.getAttribute('data-tag');
          if (state.userInterests.includes(tag)) {
            state.userInterests = state.userInterests.filter(t => t !== tag);
          } else {
            state.userInterests.push(tag);
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
        state.userInterests = [...AVAILABLE_INTEREST_TAGS];
        renderChips();
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        localStorage.setItem('metawiki_user_interests', JSON.stringify(state.userInterests));
        modal.style.display = 'none';

        // Switch to "For You" tab and re-render feed
        state.feedCategory = 'foryou';
        state.feedSortBy = 'foryou';
        state.feedPage = 1;

        const tabsContainer = document.getElementById('categoryTabsBar');
        if (tabsContainer) {
          tabsContainer.querySelectorAll('.cat-tab-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-cat') === 'foryou');
          });
        }
        const sortSelect = document.getElementById('feedSortSelect');
        if (sortSelect) sortSelect.value = 'foryou';

        renderPortalFeed();
      });
    }
  }

  function getRankedArticles() {
    const allArticles = window.METAWIKI_DATA.articles || [];
    let filtered = [...allArticles];

    // Category Filter
    if (state.feedCategory !== 'all' && state.feedCategory !== 'foryou') {
      filtered = filtered.filter(a => a.category === state.feedCategory);
    }

    // Sorting & Personalization Algorithm
    if (state.feedSortBy === 'foryou' || state.feedCategory === 'foryou') {
      filtered.sort((a, b) => {
        const aInterestMatch = state.userInterests.some(t => a.category.includes(t) || a.shortDescription.includes(t)) ? 50 : 0;
        const bInterestMatch = state.userInterests.some(t => b.category.includes(t) || b.shortDescription.includes(t)) ? 50 : 0;

        const aScore = aInterestMatch + ((a.hawkinsNumeric || 500) / 20) + ((a.watchers || 100) / 20);
        const bScore = bInterestMatch + ((b.hawkinsNumeric || 500) / 20) + ((b.watchers || 100) / 20);

        return bScore - aScore;
      });
    } else if (state.feedSortBy === 'loc-desc') {
      filtered.sort((a, b) => (b.hawkinsNumeric || 0) - (a.hawkinsNumeric || 0));
    } else if (state.feedSortBy === 'views-desc') {
      filtered.sort((a, b) => (parseInt(b.views) || 0) - (parseInt(a.views) || 0));
    } else if (state.feedSortBy === 'alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }

  function renderPortalFeed(append = false) {
    const grid = document.getElementById('portalFeedGrid');
    const badge = document.getElementById('feedCountBadge');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (!grid) return;

    const ranked = getRankedArticles();
    if (badge) badge.textContent = \`\${ranked.length.toLocaleString()} Contemplations\`;

    const visibleCount = state.feedPage * state.feedBatchSize;
    const visibleItems = ranked.slice(0, visibleCount);

    const cardsHTML = visibleItems.map(a => \`
      <div class="triadic-card" data-wiki="\${a.id}">
        <div>
          <div class="triadic-thumbnail-pic" style="overflow: hidden;">
            <img src="\${a.infobox && a.infobox.imagePath ? a.infobox.imagePath : 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png'}" alt="\${a.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.style.display='none';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
          </div>
          <div class="triadic-card-title">\${a.title}</div>
          <div class="triadic-card-subtitle">\${a.shortDescription}</div>
          <div class="triadic-card-summary" style="font-size: 0.8rem; color: var(--mw-text-muted); margin-top: 0.4rem; line-height: 1.4;">Category: <strong>\${a.category}</strong></div>
        </div>
        <div class="triadic-card-footer">
          \${createHawkinsRainbowBar(a.hawkinsCalibration || a.hawkinsNumeric)}
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="card-views-footer"><i class="ph ph-eye"></i> \${a.views || '45,000'}</span>
            <span>Read Article ➔</span>
          </div>
        </div>
      </div>
    \`).join('');

    grid.innerHTML = cardsHTML;

    grid.querySelectorAll('.triadic-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-wiki');
        if (target) loadArticle(target);
      });
    });

    if (loadMoreContainer) {
      loadMoreContainer.style.display = visibleCount < ranked.length ? 'block' : 'none';
    }
  }
`;

// Append feed engine implementation to app.js
appCode = appCode.replace('function renderTriadicPortals() {', feedEngineCode + '\n  function renderTriadicPortals() {');

fs.writeFileSync('app.js', appCode, 'utf-8');
console.log('Successfully updated app.js with Feed Engine and Personalization!');
