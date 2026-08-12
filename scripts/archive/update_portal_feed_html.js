const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const staticSectionsStart = '<div class="portal-sections-container">';
const staticSectionsEnd = '<!-- FULLSCREEN DIMENSION VIEWER MODAL -->';

const startIndex = html.indexOf(staticSectionsStart);
const endIndex = html.indexOf(staticSectionsEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const newFeedHTML = `<div class="portal-sections-container" id="portalFeedSection">
      
      <!-- Category & Feed Header Bar -->
      <div class="feed-header-wrapper">
        <div class="feed-title-row">
          <div class="feed-title-main">
            <i class="ph ph-sparkle" style="color: var(--mw-gold); font-size: 1.6rem;"></i>
            <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0;">Explore Knowledge Feed</h2>
            <span class="feed-count-badge" id="feedCountBadge">1,008 Contemplations</span>
          </div>

          <div class="feed-actions-row">
            <button class="customize-interests-btn" id="openInterestsModalBtn">
              <i class="ph ph-sliders-horizontal"></i> <span>Customize My Interests</span>
            </button>

            <div class="feed-sort-wrapper">
              <label for="feedSortSelect" style="font-size: 0.8rem; color: var(--mw-text-muted); font-weight: 600;">Sort By:</label>
              <select id="feedSortSelect" class="feed-sort-select">
                <option value="foryou">✨ Recommended for You</option>
                <option value="loc-desc">⚡ Hawkins Scale (LoC 1000 ➔ 200)</option>
                <option value="views-desc">🔥 Most Viewed</option>
                <option value="alphabetical">🔤 Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Scrollable Category Tabs Bar -->
        <div class="category-tabs-bar" id="categoryTabsBar">
          <button class="cat-tab-btn active" data-cat="foryou"><i class="ph ph-sparkle"></i> ✨ For You</button>
          <button class="cat-tab-btn" data-cat="all"><i class="ph ph-squares-four"></i> All (1,008)</button>
          <button class="cat-tab-btn" data-cat="World Religions & Gnosticism">⛩️ World Religions & Gnosticism</button>
          <button class="cat-tab-btn" data-cat="Judaism & Kabbalah">✡️ Judaism & Kabbalah</button>
          <button class="cat-tab-btn" data-cat="Islam & Sufism">☪️ Islam & Sufism</button>
          <button class="cat-tab-btn" data-cat="Hinduism & Advaita Vedanta">🕉️ Hinduism & Advaita</button>
          <button class="cat-tab-btn" data-cat="Buddhism & Zen">☸️ Buddhism & Zen</button>
          <button class="cat-tab-btn" data-cat="Hermeticism & Alchemy">🪶 Hermeticism & Alchemy</button>
          <button class="cat-tab-btn" data-cat="Western Philosophy & Neoplatonism">🏛️ Western Philosophy</button>
          <button class="cat-tab-btn" data-cat="Depth & Transpersonal Psychology">🧠 Depth Psychology</button>
          <button class="cat-tab-btn" data-cat="Sacred Geometry & Quantum Metaphysics">⚛️ Sacred Geometry & Physics</button>
        </div>
      </div>

      <!-- Dynamic Article Feed Grid -->
      <div class="triadic-grid" id="portalFeedGrid" style="margin-top: 2rem;">
        <!-- Rendered dynamically -->
      </div>

      <!-- Load More Button Container -->
      <div style="text-align: center; margin-top: 3rem; margin-bottom: 4rem;" id="loadMoreContainer">
        <button id="loadMoreFeedBtn" class="load-more-feed-btn">
          <span>Load More Contemplations ➔</span>
        </button>
      </div>

    </div>
  </div>

  <!-- CUSTOMIZE USER INTERESTS MODAL -->
  <div id="interestsModal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 99999; justify-content: center; align-items: center;">
    <div class="modal-card" style="background: rgba(18, 18, 24, 0.95); border: 1px solid var(--mw-border-gold); border-radius: 16px; padding: 2rem; max-width: 560px; width: 92%; box-shadow: 0 20px 50px rgba(0,0,0,0.9);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="font-family: var(--font-heading); font-size: 1.3rem; color: #fff; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
          <i class="ph ph-sliders-horizontal" style="color: var(--mw-gold);"></i> Customize Your Interests
        </h3>
        <i class="ph ph-x" id="closeInterestsModalBtn" style="cursor: pointer; font-size: 1.4rem; color: var(--mw-text-muted);"></i>
      </div>
      <p style="color: var(--mw-text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.5;">
        Select your core metaphysical interests. The <b>"For You"</b> feed algorithm will dynamically prioritize and rank articles matching your personal seeker path.
      </p>

      <div class="interests-chips-grid" id="interestsChipsGrid" style="display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1.8rem;">
        <!-- Chips rendered dynamically -->
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.8rem;">
        <button id="resetInterestsBtn" style="padding: 0.65rem 1.2rem; background: transparent; border: 1px solid var(--mw-border); color: #fff; border-radius: 8px; cursor: pointer; font-size: 0.85rem;">Reset All</button>
        <button id="saveInterestsBtn" style="padding: 0.65rem 1.6rem; background: var(--mw-gold); color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85rem;">Save & Update Feed ➔</button>
      </div>
    </div>
  </div>\n\n  `;

  html = html.substring(0, startIndex) + newFeedHTML + html.substring(endIndex);
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully updated index.html with Category Select & Feed System!');
} else {
  console.error('Could not find portal sections in index.html');
}
