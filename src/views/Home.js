/**
 * MetaWiki - Home View & Initiatory Portal Controller
 * Manages featured article carousel, 2,000 concept feeds, and practical guides feeds.
 */

(function(window) {
  'use strict';

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
      if (window.ArticleCard && window.ArticleCard.renderConceptCard) {
        return window.ArticleCard.renderConceptCard(a, idx);
      }
      const imgPath = (a.infobox && a.infobox.imagePath) || a.imagePath || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';
      return `
        <div class="triadic-card concept-feed-card" data-wiki="${a.id}" style="animation: fadeIn 0.4s ease forwards; animation-delay: ${(idx % 15) * 0.03}s;">
          <div>
            <div class="triadic-thumbnail-pic" style="overflow: hidden; height: 170px; position: relative;">
              <img src="${imgPath}" alt="${a.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
              <span style="position: absolute; top: 10px; right: 10px; padding: 0.25rem 0.65rem; background: rgba(10, 8, 20, 0.85); border: 1px solid var(--mw-gold); border-radius: 20px; font-size: 0.72rem; font-weight: 700; color: var(--mw-gold); backdrop-filter: blur(4px);">
                ${a.category || 'Metaphysics'}
              </span>
            </div>
            <div class="triadic-card-title" style="margin-top: 0.8rem;">${a.title}</div>
            <div class="triadic-card-summary" style="font-size: 0.82rem; color: var(--mw-text-muted); line-height: 1.4; margin-top: 0.4rem;">${a.shortDescription}</div>
          </div>
          <div class="triadic-card-footer" style="margin-top: 1rem;">
            ${window.createHawkinsRainbowBar ? window.createHawkinsRainbowBar(a.hawkinsCalibration || a.hawkinsNumeric) : ''}
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-top: 0.7rem; font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700;">
              <span class="card-views-footer" style="color: var(--mw-text-muted); flex-shrink: 0; white-space: nowrap;"><i class="ph ph-eye"></i> ${a.views || '45,000'}</span>
              <span style="color: var(--mw-gold); flex-shrink: 0; white-space: nowrap;">Read Article ➔</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

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
          window.state.forYouVisibleCount = 15;
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
      <div class="triadic-card guide-feed-card" data-wiki="${g.wikiId || 'plato-theory-of-forms'}" style="animation: fadeIn 0.4s ease forwards; animation-delay: ${(idx % 15) * 0.03}s; cursor: pointer;">
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
          ${window.createHawkinsRainbowBar ? window.createHawkinsRainbowBar(g.hawkinsLevel) : ''}
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

    const featured = window.METAWIKI_DATA.articles.slice(0, 6);
    container.innerHTML = featured.map(card => {
      if (window.ArticleCard && window.ArticleCard.renderFeaturedCard) {
        return window.ArticleCard.renderFeaturedCard(card);
      }
      return `
        <div class="featured-card" data-wiki="${card.id}" style="cursor: pointer;">
          <div>
            <div class="featured-card-thumb-wrapper">
              <img src="${card.infobox.imagePath}" alt="${card.title}" class="featured-card-img" referrerpolicy="no-referrer">
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
      `;
    }).join('');

    container.querySelectorAll('.featured-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-wiki');
        if (target && typeof window.loadArticle === 'function') {
          window.loadArticle(target);
        }
      });
    });
  }

  function initHomeView() {
    setupBubbleCategoryFeed();
    setupGuidesCategoryFeed();
    renderFeaturedCarouselGrid();
  }

  window.HomeView = {
    renderForYouConceptFeed,
    setupBubbleCategoryFeed,
    renderGuidesFeed,
    setupGuidesCategoryFeed,
    renderFeaturedCarouselGrid,
    initHomeView
  };

  window.renderForYouConceptFeed = renderForYouConceptFeed;
  window.setupBubbleCategoryFeed = setupBubbleCategoryFeed;
  window.renderGuidesFeed = renderGuidesFeed;
  window.setupGuidesCategoryFeed = setupGuidesCategoryFeed;
  window.renderFeaturedCarouselGrid = renderFeaturedCarouselGrid;
  window.initPortalFeedEngine = initHomeView;

})(window);
