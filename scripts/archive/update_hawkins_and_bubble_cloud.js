const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

const feedSectionStart = '<div class="portal-sections-container" id="portalFeedSection">';
const startIndex = html.indexOf(feedSectionStart);

if (startIndex !== -1) {
  const newSectionHTML = `<div class="portal-sections-container" id="portalFeedSection" style="border: none;">
      
      <!-- DR. DAVID R. HAWKINS MAP OF CONSCIOUSNESS VISUAL BANNER -->
      <div class="hawkins-scale-banner-container" style="margin-bottom: 2.5rem; background: rgba(18, 18, 26, 0.7); backdrop-filter: blur(20px); border-radius: 20px; padding: 2rem; border: none; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;">
              <i class="ph ph-chart-line-up" style="color: var(--mw-gold); font-size: 1.4rem;"></i>
              <span style="font-family: var(--font-heading); font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--mw-gold);">Dr. David R. Hawkins, M.D., Ph.D.</span>
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #fff; margin: 0;">Map of Consciousness Scale (LoC 200 – 1000)</h3>
          </div>
          <div style="font-size: 0.85rem; color: var(--mw-text-muted); max-width: 420px; line-height: 1.4; text-align: right;">
            Calibration spectrum measuring the vibrational frequency of human awareness, non-dual realization, and spiritual truth.
          </div>
        </div>

        <!-- Hawkins Map Spectrum Grid Visual -->
        <div class="hawkins-spectrum-visual" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.8rem; margin-top: 1rem;">
          
          <div class="hawkins-level-card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(245, 158, 11, 0.18)); padding: 0.9rem; border-radius: 14px; text-align: center; border: none;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #f87171; font-family: var(--font-heading);">LoC 200</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #fff; margin: 0.2rem 0;">Courage</div>
            <div style="font-size: 0.72rem; color: rgba(255,255,255,0.7);">Threshold of Truth</div>
          </div>

          <div class="hawkins-level-card" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(234, 179, 8, 0.18)); padding: 0.9rem; border-radius: 14px; text-align: center; border: none;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #fbbf24; font-family: var(--font-heading);">LoC 350-400</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #fff; margin: 0.2rem 0;">Reason & Logic</div>
            <div style="font-size: 0.72rem; color: rgba(255,255,255,0.7);">Scientific Inquiry</div>
          </div>

          <div class="hawkins-level-card" style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.18), rgba(16, 185, 129, 0.18)); padding: 0.9rem; border-radius: 14px; text-align: center; border: none;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #4ade80; font-family: var(--font-heading);">LoC 500</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #fff; margin: 0.2rem 0;">Love</div>
            <div style="font-size: 0.72rem; color: rgba(255,255,255,0.7);">Unconditional Compassion</div>
          </div>

          <div class="hawkins-level-card" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(59, 130, 246, 0.18)); padding: 0.9rem; border-radius: 14px; text-align: center; border: none;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #38bdf8; font-family: var(--font-heading);">LoC 540</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #fff; margin: 0.2rem 0;">Joy & Ecstasy</div>
            <div style="font-size: 0.72rem; color: rgba(255,255,255,0.7);">Transpersonal Healing</div>
          </div>

          <div class="hawkins-level-card" style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(147, 51, 234, 0.18)); padding: 0.9rem; border-radius: 14px; text-align: center; border: none;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #c084fc; font-family: var(--font-heading);">LoC 600</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #fff; margin: 0.2rem 0;">Peace</div>
            <div style="font-size: 0.72rem; color: rgba(255,255,255,0.7);">Self-Realization & Illumination</div>
          </div>

          <div class="hawkins-level-card" style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.18), rgba(251, 191, 36, 0.3)); padding: 0.9rem; border-radius: 14px; text-align: center; border: none;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #f472b6; font-family: var(--font-heading);">LoC 700 - 1000</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #fff; margin: 0.2rem 0;">Enlightenment</div>
            <div style="font-size: 0.72rem; color: rgba(255,255,255,0.7);">Non-Dual Absolute Awareness</div>
          </div>

        </div>

        <!-- Hawkins Rainbow Spectrum Bar -->
        <div style="margin-top: 1.2rem; height: 8px; border-radius: 10px; background: linear-gradient(90deg, #ef4444 0%, #f59e0b 20%, #22c55e 40%, #06b6d4 60%, #a855f7 80%, #f472b6 100%); box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);"></div>
      </div>

      <!-- Category & Feed Header Bar (Borderless) -->
      <div class="feed-header-wrapper" style="border: none;">
        <div class="feed-title-row">
          <div class="feed-title-main">
            <i class="ph ph-sparkle" style="color: var(--mw-gold); font-size: 1.6rem;"></i>
            <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0;">Explore Knowledge Feed</h2>
            <span class="feed-count-badge" id="feedCountBadge">1,008 Contemplations</span>
          </div>

          <div class="feed-actions-row">
            <button class="customize-interests-btn" id="openInterestsModalBtn" style="border: none;">
              <i class="ph ph-sliders-horizontal"></i> <span>Customize My Interests</span>
            </button>

            <div class="feed-sort-wrapper">
              <label for="feedSortSelect" style="font-size: 0.8rem; color: var(--mw-text-muted); font-weight: 600;">Sort By:</label>
              <select id="feedSortSelect" class="feed-sort-select" style="border: none;">
                <option value="foryou">✨ Recommended for You</option>
                <option value="loc-desc">⚡ Hawkins Scale (LoC 1000 ➔ 200)</option>
                <option value="views-desc">🔥 Most Viewed</option>
                <option value="alphabetical">🔤 Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Borderless Category Bubble Spread Cloud -->
        <div class="category-bubble-spread" id="categoryTabsBar">
          <button class="cat-bubble-btn active" data-cat="foryou"><i class="ph ph-sparkle"></i> ✨ For You</button>
          <button class="cat-bubble-btn" data-cat="all"><i class="ph ph-squares-four"></i> All (1,008)</button>
          <button class="cat-bubble-btn" data-cat="World Religions & Gnosticism">⛩️ World Religions & Gnosticism</button>
          <button class="cat-bubble-btn" data-cat="Judaism & Kabbalah">✡️ Judaism & Kabbalah</button>
          <button class="cat-bubble-btn" data-cat="Islam & Sufism">☪️ Islam & Sufism</button>
          <button class="cat-bubble-btn" data-cat="Hinduism & Advaita Vedanta">🕉️ Hinduism & Advaita</button>
          <button class="cat-bubble-btn" data-cat="Buddhism & Zen">☸️ Buddhism & Zen</button>
          <button class="cat-bubble-btn" data-cat="Hermeticism & Alchemy">🪶 Hermeticism & Alchemy</button>
          <button class="cat-bubble-btn" data-cat="Western Philosophy & Neoplatonism">🏛️ Western Philosophy</button>
          <button class="cat-bubble-btn" data-cat="Depth & Transpersonal Psychology">🧠 Depth Psychology</button>
          <button class="cat-bubble-btn" data-cat="Sacred Geometry & Quantum Metaphysics">⚛️ Sacred Geometry & Physics</button>
        </div>
      </div>

      <!-- Dynamic Article Feed Grid -->
      <div class="triadic-grid" id="portalFeedGrid" style="margin-top: 2rem;">
        <!-- Rendered dynamically -->
      </div>

      <!-- Load More Button Container -->
      <div style="text-align: center; margin-top: 3rem; margin-bottom: 4rem;" id="loadMoreContainer">
        <button id="loadMoreFeedBtn" class="load-more-feed-btn" style="border: none;">
          <span>Load More Contemplations ➔</span>
        </button>
      </div>

    </div>
  </div>`;

  const endIndex = html.indexOf('<!-- CUSTOMIZE USER INTERESTS MODAL -->');
  html = html.substring(0, startIndex) + newSectionHTML + '\n\n  ' + html.substring(endIndex);
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully updated index.html with Hawkins Scale Visual & Bubble Spread Cloud!');
}
