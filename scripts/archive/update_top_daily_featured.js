const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

const oldHeroRowRegex = /<div class="hero-cards-row" style="margin-top: 2rem;">[\s\S]*?<\/div>\s*<\/div>/g;
const newTopDailyHTML = `<!-- Top Daily Featured Article Card (Bigger & Highlighted) -->
      <div class="top-daily-featured-container" style="max-width: 1100px; margin: 2.5rem auto 1rem auto;">
        <div class="top-daily-featured-card" id="topDailyFeaturedCard" style="cursor: pointer;">
          <!-- Dynamically populated in app.js -->
        </div>
      </div>`;

if (oldHeroRowRegex.test(html)) {
  html = html.replace(oldHeroRowRegex, newTopDailyHTML);
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully updated index.html with Top Daily Featured Article Card!');
} else {
  console.log('Old hero cards row regex not matched in index.html');
}

// 2. Append CSS to styles.css
const topDailyCss = `
/* =========================================================================
   TOP DAILY FEATURED ARTICLE CARD STYLES (BIGGER & HIGHLIGHTED)
   ========================================================================= */

.top-daily-featured-container {
  padding: 0 1rem;
}

.top-daily-featured-card {
  background: rgba(18, 18, 26, 0.85);
  backdrop-filter: blur(25px);
  border: 1px solid var(--mw-border-gold);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(251, 191, 36, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.top-daily-featured-card:hover {
  border-color: #fbbf24;
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.9), 0 0 50px rgba(251, 191, 36, 0.45);
}

.top-daily-image-wrapper {
  flex-shrink: 0;
  width: 340px;
  height: 220px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--mw-border-gold);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

.top-daily-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.top-daily-featured-card:hover .top-daily-img {
  transform: scale(1.05);
}

.top-daily-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 220px;
}

.top-daily-badge {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--mw-gold);
  margin-bottom: 0.6rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid var(--mw-border-gold);
  padding: 0.25rem 0.8rem;
  border-radius: 20px;
}

.top-daily-title {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.top-daily-desc {
  font-size: 0.98rem;
  color: var(--mw-text-muted);
  line-height: 1.55;
  margin: 0 0 1rem 0;
}

.top-daily-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--mw-border);
  padding-top: 0.8rem;
}

.top-daily-read-btn {
  font-family: var(--font-heading);
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--mw-gold);
  transition: all 0.2s ease;
}

.top-daily-featured-card:hover .top-daily-read-btn {
  letter-spacing: 0.5px;
  color: #ffffff;
}

@media (max-width: 860px) {
  .top-daily-featured-card {
    flex-direction: column;
    padding: 1.5rem;
  }
  .top-daily-image-wrapper {
    width: 100%;
    height: 200px;
  }
  .top-daily-content {
    height: auto;
  }
}
`;

let css = fs.readFileSync('styles.css', 'utf8');
fs.writeFileSync('styles.css', css.trim() + '\n\n' + topDailyCss, 'utf8');
console.log('Successfully appended top daily featured styles to styles.css!');

// 3. Add renderTopDailyFeaturedCard function in app.js
let appCode = fs.readFileSync('app.js', 'utf8');

const topDailyCode = `
  function renderTopDailyFeaturedCard() {
    const container = document.getElementById('topDailyFeaturedCard');
    if (!container || !window.METAWIKI_DATA.articles) return;

    const topArticle = window.METAWIKI_DATA.articles.find(a => a.id === 'logos') || window.METAWIKI_DATA.articles[0];

    container.innerHTML = \`
      <div class="top-daily-image-wrapper">
        <img src="\${topArticle.infobox && topArticle.infobox.imagePath ? topArticle.infobox.imagePath : 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png'}" alt="\${topArticle.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.style.display='none';" class="top-daily-img">
      </div>
      <div class="top-daily-content">
        <div>
          <div class="top-daily-badge"><i class="ph ph-sparkle"></i> 🌟 Top Daily Featured Article</div>
          <h2 class="top-daily-title">\${topArticle.title}</h2>
          <p class="top-daily-desc">\${topArticle.shortDescription}</p>
        </div>
        <div class="top-daily-footer">
          \${createHawkinsRainbowBar(topArticle.hawkinsCalibration || topArticle.hawkinsNumeric)}
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span class="card-views-footer"><i class="ph ph-eye"></i> \${topArticle.views || '195,000'} views</span>
            <span class="top-daily-read-btn">Read Top Article ➔</span>
          </div>
        </div>
      </div>
    \`;

    container.addEventListener('click', () => {
      loadArticle(topArticle.id);
    });
  }
`;

if (!appCode.includes('function renderTopDailyFeaturedCard()')) {
  appCode = appCode.replace('renderFeaturedCarouselGrid();', 'renderTopDailyFeaturedCard();\n  renderFeaturedCarouselGrid();');
  appCode = appCode.replace('function renderFeaturedCarouselGrid() {', topDailyCode + '\n  function renderFeaturedCarouselGrid() {');
  fs.writeFileSync('app.js', appCode, 'utf-8');
  console.log('Successfully added renderTopDailyFeaturedCard logic to app.js!');
}
