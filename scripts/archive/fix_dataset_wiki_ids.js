const fs = require('fs');

let articlesJS = fs.readFileSync('data/articles.js', 'utf8');

const forumWikiIdMap = {
  'forum-1': 'logos',
  'forum-2': 'active-imagination',
  'forum-3': 'hesychasm',
  'forum-4': 'tree-of-life-kabbalah',
  'forum-5': 'advaita-vedanta',
  'forum-6': 'kybalion',
  'forum-7': 'logos',
  'forum-8': 'chakra',
  'forum-9': 'baruch-spinoza',
  'forum-10': 'heart-sutra',
  'forum-11': 'wahdat-al-wujud',
  'forum-12': 'jungian-archetypes',
  'forum-13': 'tree-of-life-kabbalah',
  'forum-14': 'kybalion',
  'forum-15': 'advaita-vedanta',
  'forum-16': 'hesychasm'
};

Object.keys(forumWikiIdMap).forEach(id => {
  const targetId = forumWikiIdMap[id];
  const searchStr = `"id": "${id}",`;
  const replaceStr = `"id": "${id}",\n      "wikiId": "${targetId}",`;
  if (articlesJS.includes(searchStr)) {
    articlesJS = articlesJS.replace(searchStr, replaceStr);
  }
});

// Fix spinoza and tao-te-ching in guides
articlesJS = articlesJS.replace('"wikiId": "spinoza"', '"wikiId": "baruch-spinoza"');
articlesJS = articlesJS.replace('"wikiId": "tao-te-ching"', '"wikiId": "zen"');

fs.writeFileSync('data/articles.js', articlesJS, 'utf-8');
console.log('Successfully updated data/articles.js with exact wikiId mappings for forumTopics and guides!');
