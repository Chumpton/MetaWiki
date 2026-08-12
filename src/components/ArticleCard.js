/**
 * MetaWiki - Article & Feed Card Builder Component
 */

(function(window) {
  'use strict';

  function getCardImgUrl(path, fallbackWidth = 330) {
    if (window.getWikiImgUrl) return window.getWikiImgUrl(path, fallbackWidth);
    return path || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';
  }

  function renderConceptCard(article, index) {
    const rawPath = (article.infobox && article.infobox.imagePath) || article.imagePath;
    const imgPath = getCardImgUrl(rawPath, 330);
    const rainbowBar = window.createHawkinsRainbowBar ? window.createHawkinsRainbowBar(article.hawkinsCalibration || article.hawkinsNumeric) : '';
    const viewsFormatted = window.getArticleViewsFormatted ? window.getArticleViewsFormatted(article.id, article.views) : (article.views || '45,000');

    return `
      <div class="triadic-card concept-feed-card" data-wiki="${article.id}" style="animation: fadeIn 0.4s ease forwards; animation-delay: ${(index % 15) * 0.03}s; cursor: pointer;">
        <div>
          <div class="triadic-thumbnail-pic" style="overflow: hidden; height: 170px; position: relative; border-radius: 10px;">
            <img src="${imgPath}" alt="${article.title}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px; transition: transform 0.3s ease;">
            
            <span style="position: absolute; top: 10px; right: 10px; padding: 0.25rem 0.65rem; background: rgba(10, 8, 20, 0.85); border: 1px solid var(--mw-gold); border-radius: 20px; font-size: 0.72rem; font-weight: 700; color: var(--mw-gold); backdrop-filter: blur(4px);">
              ${article.category || 'Metaphysics'}
            </span>
          </div>
          <div class="triadic-card-title" style="margin-top: 0.8rem;">${article.title}</div>
          <div class="triadic-card-summary" style="font-size: 0.82rem; color: var(--mw-text-muted); line-height: 1.4; margin-top: 0.4rem;">
            ${article.shortDescription}
          </div>
        </div>

        <div class="triadic-card-footer" style="margin-top: 1rem;">
          ${rainbowBar}
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-top: 0.7rem; font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700;">
            <span class="card-views-footer" style="color: var(--mw-text-muted); flex-shrink: 0; white-space: nowrap;"><i class="ph ph-eye" style="color: #fbbf24;"></i> ${viewsFormatted} views</span>
            <span style="color: var(--mw-gold); flex-shrink: 0; white-space: nowrap;">Read Article ➔</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderFeaturedCard(article) {
    const rawPath = (article.infobox && article.infobox.imagePath) || article.imagePath;
    const imgPath = getCardImgUrl(rawPath, 400);
    return `
      <div class="featured-card" data-wiki="${article.id}" style="cursor: pointer;">
        <div>
          <div class="featured-card-thumb-wrapper">
            <img src="${imgPath}" alt="${article.title}" class="featured-card-img" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';">
          </div>
          <div class="featured-card-title">${article.title}</div>
          <div class="featured-card-subtitle">${article.shortDescription}</div>
        </div>
        <div class="featured-card-link" style="display: flex; align-items: center; justify-content: space-between;">
          <span class="card-views-footer"><i class="ph ph-eye"></i> ${article.views || '120,000'}</span>
          <div style="display: flex; align-items: center; gap: 0.3rem;">
            <span>Read Article</span> <i class="ph ph-arrow-right"></i>
          </div>
        </div>
      </div>
    `;
  }

  function renderGuideCard(guide, index) {
    const rawPath = guide.imagePath;
    const imgPath = getCardImgUrl(rawPath, 330);
    const rainbowBar = window.createHawkinsRainbowBar ? window.createHawkinsRainbowBar(guide.hawkinsLevel || 500) : '';

    return `
      <div class="triadic-card guide-feed-card" data-wiki="${guide.wikiId || guide.id}" style="animation: fadeIn 0.4s ease forwards; animation-delay: ${(index % 15) * 0.03}s; cursor: pointer;">
        <div>
          <div class="triadic-thumbnail-pic" style="overflow: hidden; height: 160px; position: relative;">
            <img src="${imgPath}" alt="${guide.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Emerald_Tablet_of_Hermes.jpg/300px-Emerald_Tablet_of_Hermes.jpg';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px; transition: transform 0.3s ease;">
            <span style="position: absolute; top: 10px; right: 10px; padding: 0.25rem 0.65rem; background: rgba(168, 85, 247, 0.9); border: 1px solid var(--mw-violet); border-radius: 20px; font-size: 0.72rem; font-weight: 700; color: #fff; backdrop-filter: blur(4px);">
              ${guide.readTime || '10 min'} read
            </span>
          </div>
          <div class="triadic-card-title" style="margin-top: 0.8rem;">${guide.title}</div>
          <div class="triadic-card-summary" style="font-size: 0.82rem; color: var(--mw-text-muted); line-height: 1.4; margin-top: 0.4rem;">
            ${guide.summary || guide.subtitle}
          </div>
        </div>

        <div class="triadic-card-footer" style="margin-top: 1rem;">
          ${rainbowBar}
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-top: 0.7rem; font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700;">
            <span class="card-views-footer" style="color: var(--mw-text-muted); flex-shrink: 0; white-space: nowrap;"><i class="ph ph-book-open"></i> ${guide.views || '24,000'}</span>
            <span style="color: var(--mw-violet); flex-shrink: 0; white-space: nowrap;">Open Guide ➔</span>
          </div>
        </div>
      </div>
    `;
  }

  window.ArticleCard = {
    renderConceptCard,
    renderFeaturedCard,
    renderGuideCard
  };

})(window);
