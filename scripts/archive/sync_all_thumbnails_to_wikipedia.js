const fs = require('fs');

let code = fs.readFileSync('data/articles.js', 'utf8');

global.window = global;
eval(code);

const articles = window.METAWIKI_DATA.articles;

// Helper to resolve an article's authentic Wikipedia lead image
function getAuthenticWikiImage(wikiId, defaultFallback) {
  if (!wikiId) return defaultFallback;
  const match = articles.find(a => a.id === wikiId || a.id.includes(wikiId) || wikiId.includes(a.id));
  if (match && match.infobox && match.infobox.imagePath) {
    return match.infobox.imagePath;
  }
  return defaultFallback;
}

// 1. Sync Featured Cards
window.METAWIKI_DATA.featuredArticles.forEach(card => {
  if (card.wikiId === 'logos') {
    card.imagePath = getAuthenticWikiImage('logos', card.imagePath);
  } else if (card.wikiId === 'tree-of-life-kabbalah' || card.wikiId === 'sefirot') {
    card.imagePath = getAuthenticWikiImage('sefirot', card.imagePath);
  } else if (card.wikiId === 'wahdat-al-wujud' || card.wikiId === 'sufism') {
    card.imagePath = getAuthenticWikiImage('sufism', card.imagePath);
  } else if (card.wikiId === 'ashtanga-yoga' || card.wikiId === 'patanjali') {
    card.imagePath = getAuthenticWikiImage('patanjali', card.imagePath);
  } else if (card.wikiId === 'chakra' || card.wikiId === 'kundalini') {
    card.imagePath = getAuthenticWikiImage('kundalini', card.imagePath);
  } else if (card.wikiId === 'jungian-archetypes' || card.wikiId === 'carl-jung') {
    card.imagePath = getAuthenticWikiImage('carl-jung', card.imagePath);
  }
});

// 2. Sync Triadic Portals (Faiths, Concepts, Avatars)
if (window.METAWIKI_DATA.triadicPortals) {
  if (window.METAWIKI_DATA.triadicPortals.faiths) {
    window.METAWIKI_DATA.triadicPortals.faiths.forEach(f => {
      if (f.id.includes('christianity')) f.imagePath = getAuthenticWikiImage('logos', f.imagePath);
      else if (f.id.includes('judaism')) f.imagePath = getAuthenticWikiImage('sefirot', f.imagePath);
      else if (f.id.includes('islam')) f.imagePath = getAuthenticWikiImage('sufism', f.imagePath);
      else if (f.id.includes('buddhism')) f.imagePath = getAuthenticWikiImage('gautama-buddha', getAuthenticWikiImage('buddhism', f.imagePath));
      else if (f.id.includes('hinduism')) f.imagePath = getAuthenticWikiImage('adi-shankara', f.imagePath);
    });
  }

  if (window.METAWIKI_DATA.triadicPortals.concepts) {
    window.METAWIKI_DATA.triadicPortals.concepts.forEach(c => {
      if (c.id.includes('yoga')) c.imagePath = getAuthenticWikiImage('patanjali', c.imagePath);
      else if (c.id.includes('hermetic')) c.imagePath = getAuthenticWikiImage('kybalion', c.imagePath);
    });
  }

  if (window.METAWIKI_DATA.triadicPortals.avatars) {
    window.METAWIKI_DATA.triadicPortals.avatars.forEach(a => {
      if (a.id.includes('depth')) a.imagePath = getAuthenticWikiImage('carl-jung', a.imagePath);
    });
  }
}

// 3. Write back cleanly
const updatedJs = `/**
 * MetaWiki - Metaphysical Knowledge Repository
 * Master Dataset with Authentic Wikipedia Extracts & Infobox Images
 */

window.METAWIKI_DATA = ${JSON.stringify(window.METAWIKI_DATA, null, 2)};
`;

fs.writeFileSync('data/articles.js', updatedJs, 'utf-8');
console.log('Successfully synced ALL thumbnails to their authentic Wikipedia lead images!');
