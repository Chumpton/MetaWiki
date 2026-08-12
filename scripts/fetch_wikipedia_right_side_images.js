/**
 * MetaWiki - High-Speed Parallel Wikipedia Right-Side Picture Fetcher & Minimal Storage Encoder
 * Uses 15 concurrent batch workers to fetch authentic right-side infobox images for 2,000 articles.
 */

const fs = require('fs');
const path = require('path');

const USER_AGENT = 'MetaWikiApp/1.0 (contact@metawiki.org)';
const CONCURRENCY = 15;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function encodeWikiImgPath(fullUrl) {
  if (!fullUrl || typeof fullUrl !== 'string') return null;
  const cleanUrl = fullUrl.split('?')[0];
  const match = cleanUrl.match(/\/commons\/thumb\/([0-9a-f]\/[0-9a-f]{2}\/[^\/]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  const unscaledMatch = cleanUrl.match(/\/commons\/([0-9a-f]\/[0-9a-f]{2}\/[^\/]+)/i);
  if (unscaledMatch && unscaledMatch[1]) {
    return unscaledMatch[1];
  }
  return cleanUrl;
}

async function resolveFileInfo(fileTitle) {
  try {
    const res = await fetch('https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(fileTitle) + '&prop=imageinfo&iiprop=url&iiurlwidth=330&format=json', { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) {
      const d = await res.json();
      const page = Object.values(d.query?.pages || {})[0];
      const url = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;
      return encodeWikiImgPath(url);
    }
  } catch (e) {}
  return null;
}

async function fetchWikiImage(topic) {
  if (!topic) return null;

  // 1. REST Summary API
  try {
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(topic), { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) {
      const d = await res.json();
      const img = d.thumbnail?.source || d.originalimage?.source;
      if (img) return encodeWikiImgPath(img);
    }
  } catch (e) {}

  // 2. Media List API
  try {
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/media-list/' + encodeURIComponent(topic), { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) {
      const d = await res.json();
      const validItem = d.items?.find(i => i.type === 'image' && !i.title.includes('Icon') && !i.title.includes('Symbol') && !i.title.includes('Flag') && !i.title.includes('Logo'));
      if (validItem && validItem.title) {
        const pathStr = await resolveFileInfo(validItem.title);
        if (pathStr) return pathStr;
      }
    }
  } catch (e) {}

  return null;
}

const CATEGORY_TOPIC_MAP = {
  'Ontology & Being': ['Plato', 'Theory of Forms', 'Aristotle', 'Metaphysics', 'Ontology', 'Monadology', 'Substance theory', 'Being'],
  'Epistemology & Mind': ['Epistemology', 'Philosophy of mind', 'Immanuel Kant', 'Critique of Pure Reason', 'René Descartes', 'Cogito, ergo sum', 'Tabula rasa', 'Gottfried Wilhelm Leibniz'],
  'Consciousness & LoC': ['Consciousness', 'Hard problem of consciousness', 'Awareness', 'Mindfulness', 'Introspection', 'Meditation'],
  'Idealism & Non-Duality': ['Advaita Vedanta', 'Adi Shankara', 'Nondualism', 'George Berkeley', 'Idealism', 'Absolute idealism', 'Brahman', 'Ramana Maharshi'],
  'Quantum Metaphysics': ['Quantum mechanics', 'David Bohm', 'Observer effect (physics)', 'Quantum entanglement', 'Wave function collapse', 'Cymatics'],
  'Sacred Geometry & Cosmology': ['Sacred geometry', 'Platonic solid', 'Golden ratio', 'Vesica piscis', 'Flower of Life', 'Cosmology', 'Metatron\'s Cube'],
  'Esoteric & Hermeticism': ['Hermeticism', 'Emerald Tablet', 'Kybalion', 'Hermes Trismegistus', 'Paracelsus', 'Giordano Bruno', 'Rosicrucianism'],
  'Ancient Mysticism & Lineages': ['Hesychasm', 'Zohar', 'Nag Hammadi library', 'Gnosticism', 'Kabbalah', 'Meister Eckhart', 'Sufism', 'Rumi', 'Ibn Arabi', 'Patañjali'],
  'Depth & Transpersonal Psychology': ['Carl Jung', 'Active imagination', 'Archetype', 'Collective unconscious', 'Synchronicity', 'Individuation', 'Shadow (psychology)', 'Roberto Assagioli'],
  'Determinism & Free Will': ['Determinism', 'Free will', 'Compatibilism', 'Baruch Spinoza', 'Fatalism', 'Libertarianism (metaphysics)'],
  'Transpersonal Avatars & Luminaries': ['Gautama Buddha', 'Nagarjuna', 'Ramana Maharshi', 'Paramahansa Yogananda', 'Laozi', 'Plotinus', 'Meister Eckhart', 'Adi Shankara'],
  'Alchemy & Biofield Energy': ['Alchemy', 'Philosopher\'s stone', 'Chakra', 'Kundalini', 'Prana', 'Biofield', 'Paracelsus'],
  'Teleology & Purpose': ['Teleology', 'Four causes', 'Entelechy', 'Final cause', 'Meaning of life'],
  'Existential Metaphysics': ['Existentialism', 'Søren Kierkegaard', 'Friedrich Nietzsche', 'Jean-Paul Sartre', 'Albert Camus', 'Absurdism'],
  'Metaphysical Logic & Axioms': ['Metaphysics', 'Logic', 'Principle of non-contradiction', 'Axiom', 'First principle']
};

async function processArticlesDataset() {
  console.log('Loading dataset from data/articles.js...');
  const filePath = path.join(__dirname, '..', 'data', 'articles.js');
  const code = fs.readFileSync(filePath, 'utf8');

  global.window = global;
  eval(code);

  const dataset = window.METAWIKI_DATA;
  const articles = dataset.articles || [];

  console.log(`Starting High-Speed Concurrent Fetch for ${articles.length} articles...`);

  const imageCache = {};
  let resolvedCount = 0;
  let cacheCount = 0;

  for (let i = 0; i < articles.length; i += CONCURRENCY) {
    const chunk = articles.slice(i, i + CONCURRENCY);

    await Promise.all(chunk.map(async (article, chunkIdx) => {
      const idx = i + chunkIdx;
      const title = article.title;
      const cat = article.category || 'Ontology & Being';

      let searchTopic = title;
      if (title.startsWith('Metaphysical Aspect of')) {
        const topicList = CATEGORY_TOPIC_MAP[cat] || ['Metaphysics', 'Plato', 'Carl Jung', 'Advaita Vedanta'];
        searchTopic = topicList[idx % topicList.length];
      } else {
        searchTopic = title.replace(/\s*\([^\)]+\)/g, '').trim();
      }

      let imgPath = null;
      if (imageCache[searchTopic]) {
        imgPath = imageCache[searchTopic];
        cacheCount++;
      } else {
        imgPath = await fetchWikiImage(searchTopic);
        if (imgPath) {
          imageCache[searchTopic] = imgPath;
          resolvedCount++;
        } else {
          imgPath = '2/21/Plato_Silanion_Musei_Capitolini_MC1377.png';
        }
      }

      article.infobox = article.infobox || {};
      article.infobox.imagePath = imgPath;
      article.infobox.fullImage = imgPath;
    }));

    if ((i + CONCURRENCY) % 150 === 0 || (i + CONCURRENCY) >= articles.length) {
      console.log(`[Progress ${Math.min(i + CONCURRENCY, articles.length)}/${articles.length}] - Unique Fetched: ${resolvedCount}, Cache Hits: ${cacheCount}`);
    }
    await sleep(20);
  }

  // Save updated dataset back to data/articles.js
  const updatedCode = `/**
 * MetaWiki Dataset — ${articles.length} Articles, ${dataset.guides?.length || 0} Practical Guides, and ${dataset.forumTopics?.length || 0} Forum Topics
 * Minimally encoded Wikipedia Right Side Infobox pictures.
 */

window.METAWIKI_DATA = {
  articles: ${JSON.stringify(articles, null, 2)},
  guides: ${JSON.stringify(dataset.guides || [], null, 2)},
  forumTopics: ${JSON.stringify(dataset.forumTopics || [], null, 2)}
};
`;

  fs.writeFileSync(filePath, updatedCode, 'utf8');
  console.log(`Successfully saved updated dataset to ${filePath}`);

  // Sync data/articles.json
  const jsonPath = path.join(__dirname, '..', 'data', 'articles.json');
  if (fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, JSON.stringify(articles, null, 2), 'utf8');
    console.log(`Successfully updated ${jsonPath}`);
  }
}

processArticlesDataset().catch(console.error);
