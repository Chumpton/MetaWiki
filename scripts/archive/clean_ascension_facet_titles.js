const fs = require('fs');

let code = fs.readFileSync('data/articles.js', 'utf8');

global.window = global;
eval(code);

let cleanedCount = 0;

window.METAWIKI_DATA.articles.forEach(article => {
  // 1. Clean Title
  if (article.title && article.title.includes('Ascension Facet')) {
    article.title = article.title.replace(/\s*\([^)]*Ascension Facet[^)]*\)/gi, '').trim();
    cleanedCount++;
  }

  // 2. Clean Infobox Title
  if (article.infobox && article.infobox.title && article.infobox.title.includes('Ascension Facet')) {
    article.infobox.title = article.infobox.title.replace(/\s*\([^)]*Ascension Facet[^)]*\)/gi, '').trim();
  }

  // 3. Clean Infobox Image Caption
  if (article.infobox && article.infobox.imageCaption && article.infobox.imageCaption.includes('Ascension Facet')) {
    article.infobox.imageCaption = article.infobox.imageCaption.replace(/\s*\([^)]*Ascension Facet[^)]*\)/gi, '').trim();
  }

  // 4. Clean Short Description
  if (article.shortDescription && article.shortDescription.includes('Conscious Ascension and Metaphysical study of')) {
    article.shortDescription = article.shortDescription.replace(/Conscious Ascension and Metaphysical study of ([^within]+) within (.+)\./gi, '$1 — Core concept in $2.');
  }

  // 5. Clean contentHTML headings and text
  if (article.contentHTML) {
    article.contentHTML = article.contentHTML.replace(/\s*\([^)]*Ascension Facet[^)]*\)/gi, '');
  }
});

// Also clean featuredArticles and triadicPortals in window.METAWIKI_DATA
if (window.METAWIKI_DATA.featuredArticles) {
  window.METAWIKI_DATA.featuredArticles.forEach(f => {
    if (f.title) f.title = f.title.replace(/\s*\([^)]*Ascension Facet[^)]*\)/gi, '').trim();
    if (f.subtitle) f.subtitle = f.subtitle.replace(/\s*\([^)]*Ascension Facet[^)]*\)/gi, '').trim();
  });
}

if (window.METAWIKI_DATA.triadicPortals) {
  Object.keys(window.METAWIKI_DATA.triadicPortals).forEach(k => {
    window.METAWIKI_DATA.triadicPortals[k].forEach(item => {
      if (item.title) item.title = item.title.replace(/\s*\([^)]*Ascension Facet[^)]*\)/gi, '').trim();
      if (item.subtitle) item.subtitle = item.subtitle.replace(/\s*\([^)]*Ascension Facet[^)]*\)/gi, '').trim();
    });
  });
}

const updatedJs = `/**
 * MetaWiki - Metaphysical Knowledge Repository
 * Master Dataset with Clean Titles & Authentic Wikipedia Extracts
 */

window.METAWIKI_DATA = ${JSON.stringify(window.METAWIKI_DATA, null, 2)};
`;

fs.writeFileSync('data/articles.js', updatedJs, 'utf-8');
console.log(`Successfully stripped (Ascension Facet xxx) from ${cleanedCount} article titles in data/articles.js!`);
