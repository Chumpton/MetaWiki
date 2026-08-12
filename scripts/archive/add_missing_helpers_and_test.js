const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

const missingHelpers = `
  function loadRandomArticle() {
    if (!window.METAWIKI_DATA || !window.METAWIKI_DATA.articles || window.METAWIKI_DATA.articles.length === 0) return;
    const randomIndex = Math.floor(Math.random() * window.METAWIKI_DATA.articles.length);
    const article = window.METAWIKI_DATA.articles[randomIndex];
    if (article) loadArticle(article.id);
  }

  function showSpatialMapView() {
    showPortalView();
    setTimeout(() => {
      const banner = document.querySelector('.hawkins-scale-banner-container');
      if (banner) banner.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }
`;

// Insert helpers before bindHeroEvents
appCode = appCode.replace('function bindHeroEvents() {', missingHelpers + '\n  function bindHeroEvents() {');

fs.writeFileSync('app.js', appCode, 'utf-8');
console.log('Successfully added loadRandomArticle and showSpatialMapView to app.js!');
