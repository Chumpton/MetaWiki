/**
 * MetaWiki - Portal Landing & Feed Engine
 * Controls the Initiatory Portal view, Hawkins scale visualizations,
 * 2,000-article Bubble Category Feed & 15-concept "For You" Selection Area with Show More pagination.
 */

(function(window) {
  'use strict';

  // Ensure window.state is safely initialized
  if (!window.state) {
    window.state = {
      view: 'portal',
      currentArticleId: 'divine-logos',
      forYouCategory: 'all',
      forYouVisibleCount: 15
    };
  }

  function createHawkinsRainbowBar(rawLevel) {
    const level = parseInt(rawLevel) || 500;
    const clamped = Math.max(200, Math.min(1000, level));
    const percent = Math.round(((clamped - 200) / 800) * 100);

    let color = '#fbbf24';
    let label = `Reason (${clamped})`;
    if (clamped >= 700) { color = '#f472b6'; label = `Enlightenment (${clamped})`; }
    else if (clamped >= 600) { color = '#c084fc'; label = `Peace (${clamped})`; }
    else if (clamped >= 540) { color = '#38bdf8'; label = `Joy (${clamped})`; }
    else if (clamped >= 500) { color = '#4ade80'; label = `Love (${clamped})`; }
    else if (clamped >= 350) { color = '#fbbf24'; label = `Reason (${clamped})`; }
    else { color = '#f87171'; label = `Courage (${clamped})`; }

    return `
      <div class="hawkins-bar-wrapper" title="Hawkins Calibration: ${label}">
        <div class="hawkins-bar-header" style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--mw-text-muted); margin-bottom: 3px;">
          <span>LoC Scale</span>
          <span style="color: ${color}; font-weight: bold;">${label}</span>
        </div>
        <div class="hawkins-bar-track" style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; position: relative; overflow: hidden;">
          <div class="hawkins-bar-fill" style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, #ef4444, #fbbf24, #4ade80, #38bdf8, #c084fc, #f472b6); border-radius: 10px; transition: width 0.4s ease;"></div>
        </div>
      </div>
    `;
  }

  function getArticleViews(wikiId) {
    if (!wikiId || !window.METAWIKI_DATA || !window.METAWIKI_DATA.articles) return '185,000';
    const article = window.METAWIKI_DATA.articles.find(a => a.id === wikiId);
    return article && article.views ? article.views : '185,000';
  }

  // =========================================================================
  // 15 CONCEPTS BUBBLE CATEGORY FEED & SHOW MORE PAGINATION ENGINE
  // =========================================================================
  function renderForYouConceptFeed() {
    const grid = document.getElementById('forYouFeedGrid');
    const badge = document.getElementById('feedCounterBadge');
    const showMoreBtn = document.getElementById('showMoreFeedBtn');
    if (!grid) return;

    const allArticles = (window.METAWIKI_DATA && window.METAWIKI_DATA.articles) || [];
    const category = (window.state && window.state.forYouCategory) || 'all';
    const countToDisplay = (window.state && window.state.forYouVisibleCount) || 15;

    let filtered = allArticles;
    if (category !== 'all') {
      filtered = allArticles.filter(a => a.category && a.category.toLowerCase().includes(category.toLowerCase()));
    }

    const visibleItems = filtered.slice(0, countToDisplay);

    if (badge) {
      badge.textContent = `Showing ${visibleItems.length.toLocaleString()} of ${filtered.length.toLocaleString()} Concepts`;
    }

    grid.innerHTML = visibleItems.map((a, idx) => {
        const rawPath = (a.infobox && a.infobox.imagePath) || a.imagePath;
        const imgPath = window.getWikiImgUrl ? window.getWikiImgUrl(rawPath, 330) : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';
        const viewsFormatted = window.getArticleViewsFormatted ? window.getArticleViewsFormatted(a.id) : (a.views || '0');

        return `
          <div class="triadic-card concept-feed-card" data-wiki="${a.id}" style="animation: fadeIn 0.4s ease forwards; animation-delay: ${(idx % 15) * 0.03}s; cursor: pointer;">
            <div>
              <div class="triadic-thumbnail-pic" style="overflow: hidden; height: 170px; position: relative; border-radius: 10px;">
                <img src="${imgPath}" alt="${a.title}" referrerpolicy="no-referrer" onerror="if(window.handleCardImgError){window.handleCardImgError(this,'${(a.title||'').replace(/'/g,"\\\'")}');}else{this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px; transition: transform 0.3s ease;">
                
                <!-- THUMBNAIL CATEGORY BADGE -->
                <span style="position: absolute; top: 10px; right: 10px; padding: 0.25rem 0.65rem; background: rgba(10, 8, 20, 0.85); border: 1px solid var(--mw-gold); border-radius: 20px; font-size: 0.72rem; font-weight: 700; color: var(--mw-gold); backdrop-filter: blur(4px);">
                  ${a.category || 'Metaphysics'}
                </span>
              </div>
              <div class="triadic-card-title" style="margin-top: 0.8rem;">${a.title}</div>
              <div class="triadic-card-summary" style="font-size: 0.82rem; color: var(--mw-text-muted); line-height: 1.4; margin-top: 0.4rem;">
                ${a.shortDescription}
              </div>
            </div>

            <div class="triadic-card-footer" style="margin-top: 1rem;">
              ${createHawkinsRainbowBar(a.hawkinsCalibration || a.hawkinsNumeric)}
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-top: 0.7rem; font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700;">
                <span class="card-views-footer" style="color: var(--mw-text-muted); flex-shrink: 0; white-space: nowrap;"><i class="ph ph-eye" style="color: #fbbf24;"></i> ${viewsFormatted} views</span>
                <span style="color: var(--mw-gold); flex-shrink: 0; white-space: nowrap;">Read Article ➔</span>
              </div>
            </div>
          </div>
        `;
    }).join('');

    // Bind Click Handlers to Cards
    grid.querySelectorAll('.concept-feed-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-wiki');
        if (target && typeof window.loadArticle === 'function') {
          window.loadArticle(target);
        }
      });
    });

    if (showMoreBtn) {
      if (countToDisplay >= filtered.length) {
        showMoreBtn.style.display = 'none';
      } else {
        showMoreBtn.style.display = 'inline-flex';
        showMoreBtn.querySelector('span').textContent = `Show More Concepts (Batch +15)`;
      }
    }
  }

  function setupBubbleCategoryFeed() {
    const bubbleBar = document.getElementById('bubbleCategoryFeedBar');
    const showMoreBtn = document.getElementById('showMoreFeedBtn');

    if (bubbleBar) {
      bubbleBar.querySelectorAll('.category-bubble-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          bubbleBar.querySelectorAll('.category-bubble-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const cat = btn.getAttribute('data-cat');
          if (!window.state) window.state = {};
          window.state.forYouCategory = cat;
          window.state.forYouVisibleCount = 15; // Reset to 15 concepts per category selection
          renderForYouConceptFeed();
        });
      });
    }

    if (showMoreBtn) {
      showMoreBtn.addEventListener('click', () => {
        if (!window.state) window.state = {};
        window.state.forYouVisibleCount = (window.state.forYouVisibleCount || 15) + 15;
        renderForYouConceptFeed();
      });
    }

    renderForYouConceptFeed();
  }

  // =========================================================================
  // PRACTICAL GUIDES BUBBLE CATEGORY FEED ENGINE (15 CARDS + SHOW MORE)
  // =========================================================================
  function renderGuidesFeed() {
    const grid = document.getElementById('guidesFeedGrid');
    const showMoreBtn = document.getElementById('showMoreGuidesBtn');
    if (!grid) return;

    const allGuides = (window.METAWIKI_DATA && window.METAWIKI_DATA.guides) || [];
    const category = (window.state && window.state.guidesCategory) || 'all';
    const countToDisplay = (window.state && window.state.guidesVisibleCount) || 15;

    let filtered = allGuides;
    if (category !== 'all') {
      filtered = allGuides.filter(g => g.category && g.category.toLowerCase().includes(category.toLowerCase()));
    }

    const visibleItems = filtered.slice(0, countToDisplay);

    grid.innerHTML = visibleItems.map((g, idx) => `
      <div class="triadic-card guide-feed-card" data-wiki="${g.wikiId || 'plato-theory-of-forms'}" style="animation: fadeIn 0.4s ease forwards; animation-delay: ${(idx % 15) * 0.03}s;">
        <div>
          <div class="triadic-thumbnail-pic" style="overflow: hidden; height: 160px; position: relative;">
            <img src="${g.imagePath}" alt="${g.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
            <span style="position: absolute; top: 10px; right: 10px; padding: 0.25rem 0.65rem; background: rgba(10, 8, 20, 0.85); border: 1px solid var(--mw-gold); border-radius: 20px; font-size: 0.72rem; font-weight: 700; color: var(--mw-gold); backdrop-filter: blur(4px);">
              ${g.readTime || '10 min'}
            </span>
          </div>
          <div class="triadic-card-title" style="margin-top: 0.8rem;">${g.title}</div>
          <div class="triadic-card-subtitle">${g.subtitle}</div>
          <div class="triadic-card-summary" style="font-size: 0.82rem; color: var(--mw-text-muted); margin-top: 0.4rem;">${g.summary}</div>
        </div>
        <div class="triadic-card-footer" style="margin-top: 1rem;">
          ${createHawkinsRainbowBar(g.hawkinsLevel)}
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-top: 0.7rem; font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700;">
            <span class="card-views-footer" style="color: var(--mw-text-muted); flex-shrink: 0; white-space: nowrap;"><i class="ph ph-eye"></i> ${g.views}</span>
            <span style="color: var(--mw-gold); flex-shrink: 0; white-space: nowrap;">Open Guide ➔</span>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.guide-feed-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-wiki');
        if (target && typeof window.loadArticle === 'function') {
          window.loadArticle(target);
        }
      });
    });

    if (showMoreBtn) {
      if (countToDisplay >= filtered.length) {
        showMoreBtn.style.display = 'none';
      } else {
        showMoreBtn.style.display = 'inline-flex';
        showMoreBtn.querySelector('span').textContent = `Show More Guides (Batch +15)`;
      }
    }
  }

  function setupGuidesCategoryFeed() {
    const bubbleBar = document.getElementById('guidesCategoryFeedBar');
    const showMoreBtn = document.getElementById('showMoreGuidesBtn');

    if (bubbleBar) {
      bubbleBar.querySelectorAll('.category-bubble-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          bubbleBar.querySelectorAll('.category-bubble-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const cat = btn.getAttribute('data-cat');
          if (!window.state) window.state = {};
          window.state.guidesCategory = cat;
          window.state.guidesVisibleCount = 15;
          renderGuidesFeed();
        });
      });
    }

    if (showMoreBtn) {
      showMoreBtn.addEventListener('click', () => {
        if (!window.state) window.state = {};
        window.state.guidesVisibleCount = (window.state.guidesVisibleCount || 15) + 15;
        renderGuidesFeed();
      });
    }

    renderGuidesFeed();
  }

  function renderFeaturedCarouselGrid() {
    const container = document.getElementById('featuredCarouselGrid');
    if (!container || !window.METAWIKI_DATA || !window.METAWIKI_DATA.articles) return;

    const featured = window.METAWIKI_DATA.articles.slice(0, 4);
    container.innerHTML = featured.map(card => `
      <div class="featured-card" data-wiki="${card.id}" style="cursor: pointer;">
        <div>
          <div class="featured-card-thumb-wrapper">
            <img src="${window.getWikiImgUrl ? window.getWikiImgUrl((card.infobox && card.infobox.imagePath) || card.imagePath, 330) : card.imagePath}" alt="${card.title}" class="featured-card-img" referrerpolicy="no-referrer">
          </div>
          <div class="featured-card-title">${card.title}</div>
          <div class="featured-card-subtitle">${card.shortDescription}</div>
        </div>
        <div class="featured-card-link" style="display: flex; align-items: center; justify-content: space-between;">
          <span class="card-views-footer"><i class="ph ph-eye"></i> ${card.views}</span>
          <div style="display: flex; align-items: center; gap: 0.3rem;">
            <span>Read Article</span> <i class="ph ph-arrow-right"></i>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.featured-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-wiki');
        if (target && typeof window.loadArticle === 'function') {
          window.loadArticle(target);
        }
      });
    });
  }

  function initPortalFeedEngine() {
    setupBubbleCategoryFeed();
    setupGuidesCategoryFeed();
    renderFeaturedCarouselGrid();
  }

  // Export Portal API
  window.createHawkinsRainbowBar = createHawkinsRainbowBar;
  window.getArticleViews = getArticleViews;
  window.renderForYouConceptFeed = renderForYouConceptFeed;
  window.setupBubbleCategoryFeed = setupBubbleCategoryFeed;
  window.renderGuidesFeed = renderGuidesFeed;
  window.setupGuidesCategoryFeed = setupGuidesCategoryFeed;
  window.renderFeaturedCarouselGrid = renderFeaturedCarouselGrid;
  window.initPortalFeedEngine = initPortalFeedEngine;

})(window);

