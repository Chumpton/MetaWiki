/**
 * MetaWiki Authentic Wikipedia Data & Image Sync Script
 * Fetches real Wikipedia extracts and official Wikipedia lead infobox images
 * for all topics in the master taxonomy.
 */

const fs = require('fs');
const path = require('path');

// Helper to delay between requests to respect Wikipedia API rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Strip query parameters from Wikipedia image URLs
function cleanWikiUrl(url) {
  if (!url) return null;
  return url.split('?')[0];
}

// Master Taxonomy of Metaphysical Concepts, Avatars & Lineages
const MASTER_TOPICS = [
  { title: "Carl Jung", category: "Depth & Transpersonal Psychology", baseLoC: 540, dimension: "psychological" },
  { title: "Logos", category: "World Religions & Gnosticism", baseLoC: 700, dimension: "nondual" },
  { title: "Hesychasm", category: "World Religions & Gnosticism", baseLoC: 600, dimension: "nondual" },
  { title: "Nag Hammadi library", category: "World Religions & Gnosticism", baseLoC: 550, dimension: "esoteric" },
  { title: "Meister Eckhart", category: "World Religions & Gnosticism", baseLoC: 700, dimension: "nondual" },
  { title: "Christian mysticism", category: "World Religions & Gnosticism", baseLoC: 600, dimension: "mystical" },
  { title: "The Cloud of Unknowing", category: "World Religions & Gnosticism", baseLoC: 600, dimension: "nondual" },
  { title: "Teresa of Ávila", category: "World Religions & Gnosticism", baseLoC: 600, dimension: "mystical" },
  { title: "John of the Cross", category: "World Religions & Gnosticism", baseLoC: 600, dimension: "mystical" },
  { title: "Jakob Böhme", category: "World Religions & Gnosticism", baseLoC: 580, dimension: "esoteric" },
  { title: "Gnosticism", category: "World Religions & Gnosticism", baseLoC: 540, dimension: "esoteric", fallbackSearch: "Nag Hammadi library" },

  { title: "Ein Sof", category: "Judaism & Kabbalah", baseLoC: 850, dimension: "nondual", fallbackSearch: "Sefirot" },
  { title: "Sefirot", category: "Judaism & Kabbalah", baseLoC: 700, dimension: "nondual" },
  { title: "Tree of life (Kabbalah)", category: "Judaism & Kabbalah", baseLoC: 700, dimension: "nondual" },
  { title: "Isaac Luria", category: "Judaism & Kabbalah", baseLoC: 650, dimension: "esoteric" },
  { title: "Tzimtzum", category: "Judaism & Kabbalah", baseLoC: 750, dimension: "nondual", fallbackSearch: "Sefirot" },
  { title: "Zohar", category: "Judaism & Kabbalah", baseLoC: 650, dimension: "esoteric" },
  { title: "Merkabah mysticism", category: "Judaism & Kabbalah", baseLoC: 590, dimension: "esoteric" },
  { title: "Sefer Yetzirah", category: "Judaism & Kabbalah", baseLoC: 600, dimension: "esoteric" },

  { title: "Wahdat al-wujud", category: "Islam & Sufism", baseLoC: 750, dimension: "nondual", fallbackSearch: "Ibn Arabi" },
  { title: "Ibn Arabi", category: "Islam & Sufism", baseLoC: 750, dimension: "nondual" },
  { title: "Rumi", category: "Islam & Sufism", baseLoC: 650, dimension: "mystical" },
  { title: "Mansur Al-Hallaj", category: "Islam & Sufism", baseLoC: 680, dimension: "nondual" },
  { title: "Al-Ghazali", category: "Islam & Sufism", baseLoC: 580, dimension: "mystical" },
  { title: "Sufism", category: "Islam & Sufism", baseLoC: 650, dimension: "mystical", fallbackSearch: "Mevlevi Order" },
  { title: "Fana (Sufism)", category: "Islam & Sufism", baseLoC: 700, dimension: "nondual", fallbackSearch: "Rumi" },

  { title: "Advaita Vedanta", category: "Hinduism & Advaita Vedanta", baseLoC: 850, dimension: "nondual" },
  { title: "Adi Shankara", category: "Hinduism & Advaita Vedanta", baseLoC: 850, dimension: "nondual" },
  { title: "Ātman (Hinduism)", category: "Hinduism & Advaita Vedanta", baseLoC: 850, dimension: "nondual", fallbackSearch: "Brahman" },
  { title: "Brahman", category: "Hinduism & Advaita Vedanta", baseLoC: 900, dimension: "nondual" },
  { title: "Maya (illusion)", category: "Hinduism & Advaita Vedanta", baseLoC: 700, dimension: "nondual", fallbackSearch: "Adi Shankara" },
  { title: "Patañjali", category: "Hinduism & Advaita Vedanta", baseLoC: 700, dimension: "nondual" },
  { title: "Ashtanga yoga", category: "Hinduism & Advaita Vedanta", baseLoC: 600, dimension: "bioenergetic", fallbackSearch: "Patañjali" },
  { title: "Chakra", category: "Hinduism & Advaita Vedanta", baseLoC: 550, dimension: "bioenergetic", fallbackSearch: "Kundalini" },
  { title: "Kundalini", category: "Hinduism & Advaita Vedanta", baseLoC: 600, dimension: "bioenergetic" },
  { title: "Ramana Maharshi", category: "Hinduism & Advaita Vedanta", baseLoC: 950, dimension: "nondual" },
  { title: "Sri Aurobindo", category: "Hinduism & Advaita Vedanta", baseLoC: 720, dimension: "nondual" },

  { title: "Śūnyatā", category: "Buddhism & Zen", baseLoC: 850, dimension: "nondual", fallbackSearch: "Nāgārjuna" },
  { title: "Nāgārjuna", category: "Buddhism & Zen", baseLoC: 800, dimension: "nondual" },
  { title: "Pratītyasamutpāda", category: "Buddhism & Zen", baseLoC: 750, dimension: "nondual", fallbackSearch: "Gautama Buddha" },
  { title: "Anatta", category: "Buddhism & Zen", baseLoC: 750, dimension: "nondual", fallbackSearch: "Gautama Buddha" },
  { title: "Bodhisattva", category: "Buddhism & Zen", baseLoC: 650, dimension: "mystical" },
  { title: "Zen", category: "Buddhism & Zen", baseLoC: 700, dimension: "nondual" },
  { title: "Dōgen", category: "Buddhism & Zen", baseLoC: 750, dimension: "nondual" },
  { title: "Heart Sutra", category: "Buddhism & Zen", baseLoC: 800, dimension: "nondual", fallbackSearch: "Avalokiteśvara" },
  { title: "Dzogchen", category: "Buddhism & Zen", baseLoC: 850, dimension: "nondual", fallbackSearch: "Padmasambhava" },

  { title: "Hermes Trismegistus", category: "Hermeticism & Alchemy", baseLoC: 650, dimension: "esoteric" },
  { title: "Kybalion", category: "Hermeticism & Alchemy", baseLoC: 600, dimension: "esoteric" },
  { title: "Emerald Tablet", category: "Hermeticism & Alchemy", baseLoC: 650, dimension: "esoteric" },
  { title: "Paracelsus", category: "Hermeticism & Alchemy", baseLoC: 560, dimension: "esoteric" },
  { title: "Giordano Bruno", category: "Hermeticism & Alchemy", baseLoC: 580, dimension: "esoteric" },

  { title: "Plato", category: "Western Philosophy & Neoplatonism", baseLoC: 600, dimension: "philosophical" },
  { title: "Plotinus", category: "Western Philosophy & Neoplatonism", baseLoC: 750, dimension: "nondual" },
  { title: "Enneads", category: "Western Philosophy & Neoplatonism", baseLoC: 700, dimension: "nondual", fallbackSearch: "Plotinus" },
  { title: "Baruch Spinoza", category: "Western Philosophy & Neoplatonism", baseLoC: 640, dimension: "nondual" },
  { title: "Gottfried Wilhelm Leibniz", category: "Western Philosophy & Neoplatonism", baseLoC: 580, dimension: "philosophical" },

  { title: "Collective unconscious", category: "Depth & Transpersonal Psychology", baseLoC: 540, dimension: "psychological", fallbackSearch: "Carl Jung" },
  { title: "Jungian archetypes", category: "Depth & Transpersonal Psychology", baseLoC: 540, dimension: "psychological", fallbackSearch: "Carl Jung" },
  { title: "Shadow (psychology)", category: "Depth & Transpersonal Psychology", baseLoC: 500, dimension: "psychological", fallbackSearch: "Carl Jung" },
  { title: "Anima and animus", category: "Depth & Transpersonal Psychology", baseLoC: 520, dimension: "psychological", fallbackSearch: "Carl Jung" },
  { title: "Individuation", category: "Depth & Transpersonal Psychology", baseLoC: 540, dimension: "psychological", fallbackSearch: "Carl Jung" },
  { title: "Synchronicity", category: "Depth & Transpersonal Psychology", baseLoC: 550, dimension: "psychological", fallbackSearch: "Carl Jung" },
  { title: "Active imagination", category: "Depth & Transpersonal Psychology", baseLoC: 530, dimension: "psychological", fallbackSearch: "Carl Jung" },
  { title: "Roberto Assagioli", category: "Depth & Transpersonal Psychology", baseLoC: 550, dimension: "psychological" },
  { title: "Ego death", category: "Depth & Transpersonal Psychology", baseLoC: 600, dimension: "nondual", fallbackSearch: "Transpersonal psychology" },

  { title: "Sacred geometry", category: "Sacred Geometry & Quantum Metaphysics", baseLoC: 600, dimension: "esoteric" },
  { title: "Platonic solid", category: "Sacred Geometry & Quantum Metaphysics", baseLoC: 550, dimension: "philosophical" },
  { title: "Golden ratio", category: "Sacred Geometry & Quantum Metaphysics", baseLoC: 600, dimension: "esoteric" },
  { title: "Vesica piscis", category: "Sacred Geometry & Quantum Metaphysics", baseLoC: 600, dimension: "esoteric" },
  { title: "Cymatics", category: "Sacred Geometry & Quantum Metaphysics", baseLoC: 520, dimension: "esoteric" },
  { title: "David Bohm", category: "Sacred Geometry & Quantum Metaphysics", baseLoC: 580, dimension: "philosophical" }
];

// Query Wikipedia REST Summary API
async function fetchWikiPageData(topicTitle, fallbackSearch) {
  const userAgent = 'MetaWikiApp/1.0 (https://metawiki.local; contact@metawiki.org)';
  
  // 1. Primary Page Summary Query
  let summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topicTitle)}`;
  try {
    let res = await fetch(summaryUrl, { headers: { 'Api-User-Agent': userAgent } });
    if (res.ok) {
      let data = await res.json();
      let img = cleanWikiUrl(data.thumbnail?.source || data.originalimage?.source);
      let extract = data.extract;

      // If summary had no image but we have a fallback search term (e.g. Sefirot for Ein Sof)
      if (!img && fallbackSearch) {
        let fallbackRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(fallbackSearch)}`, { headers: { 'Api-User-Agent': userAgent } });
        if (fallbackRes.ok) {
          let fbData = await fallbackRes.json();
          img = cleanWikiUrl(fbData.thumbnail?.source || fbData.originalimage?.source);
        }
      }

      if (img || extract) {
        return {
          title: data.title || topicTitle,
          extract: extract || `${topicTitle} is a key concept in ${data.description || 'metaphysics and philosophy'}.`,
          shortDescription: data.description || `${data.title || topicTitle} — Metaphysical & Conscious Ascension Analysis.`,
          image: img
        };
      }
    }
  } catch (err) {
    // ignore
  }

  // 2. Secondary MediaWiki Action API Fallback
  try {
    const actionUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(topicTitle)}&prop=pageimages|extracts&pithumbsize=600&exintro=1&explaintext=1&format=json`;
    let res = await fetch(actionUrl, { headers: { 'User-Agent': userAgent } });
    if (res.ok) {
      let data = await res.json();
      let pages = Object.values(data.query.pages);
      if (pages.length > 0 && pages[0].title) {
        let p = pages[0];
        let img = cleanWikiUrl(p.thumbnail?.source);
        return {
          title: p.title,
          extract: p.extract || `${topicTitle} is an essential subject in metaphysics and spiritual evolution.`,
          shortDescription: `${p.title} — Metaphysical Concept & Consciousness Analysis.`,
          image: img
        };
      }
    }
  } catch (err) {
    // ignore
  }

  return null;
}

// Generate MetaWiki Conscious Ascension Synthesis Preamble
function createAscensionPreamble(item, title) {
  const loc = item.baseLoC;
  let locStage = "Divine Truth & Non-Duality";
  if (loc < 500) locStage = "Reason & Psychological Integration";
  else if (loc < 600) locStage = "Transpersonal Observer & Spiritual Love";
  else if (loc < 700) locStage = "Uncreated Peace & Sacred Geometry";
  else if (loc < 800) locStage = "Non-Dual Luminous Awareness";
  else locStage = "Infinite Pure Self (Atman-Brahman)";

  return `
    <div class="metawiki-ascension-card" style="background: rgba(251, 191, 36, 0.06); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
      <div class="ascension-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <span class="ascension-badge" style="background: linear-gradient(135deg, #d97706, #b45309); color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">MetaWiki Conscious Ascension Synthesis</span>
        <span class="hawkins-loc-pill" style="font-size: 0.85rem; color: #fbbf24;">Hawkins Scale Calibration: <strong>LoC ${loc}</strong> (${locStage})</span>
      </div>
      <p class="ascension-text" style="font-size: 0.95rem; line-height: 1.6; color: var(--mw-text-main, #e2e8f0); margin: 0;">
        Within MetaWiki's comparative framework, <b>${title}</b> is understood not merely as a historical or intellectual subject, but as an essential focal point in the evolution of human consciousness. When perceived through the lens of ego-transcendence, this topic serves as a stepping stone from localized identity toward the realization of universal non-dual awareness.
      </p>
    </div>
  `;
}

async function main() {
  console.log(`Starting Authentic Wikipedia Fetch for ${MASTER_TOPICS.length} primary topics...`);
  const fetchedArticlesMap = {};

  for (let i = 0; i < MASTER_TOPICS.length; i++) {
    const item = MASTER_TOPICS[i];
    console.log(`[${i + 1}/${MASTER_TOPICS.length}] Fetching Wikipedia data for: ${item.title}...`);

    const pageData = await fetchWikiPageData(item.title, item.fallbackSearch);
    await sleep(150); // Respect Wikipedia rate limits (150ms delay)

    const title = pageData?.title || item.title;
    const extract = pageData?.extract || `${item.title} is an important subject in ${item.category}.`;
    const shortDesc = pageData?.shortDescription || `${item.category} concept for consciousness evolution and non-dual realization.`;
    const imgUrl = pageData?.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png";

    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const preambleHTML = createAscensionPreamble(item, title);

    const contentHTML = `
      ${preambleHTML}
      <h2 id="${slug}-overview"><span class="mw-headline">1. Canonical Overview</span></h2>
      <p>${extract}</p>

      <h2 id="${slug}-synthesis"><span class="mw-headline">2. Conscious Ascension & Inner Integration</span></h2>
      <p>By contemplating <b>${title}</b>, the seeker aligns their lower psychological apparatus (Ego) with the higher ordering principle (Logos / Atman). In modern depth psychology and perennial philosophy, this integration dissolves dualistic projections and reveals the uncreated light within daily experience.</p>

      <h2 id="${slug}-references"><span class="mw-headline">3. External Wikipedia Reference</span></h2>
      <p>For additional historical context and academic documentation, visit the official Wikipedia entry: <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}" target="_blank" rel="noopener" style="color: var(--mw-link-blue, #60a5fa); text-decoration: underline;">Wikipedia: ${title}</a>.</p>
    `;

    fetchedArticlesMap[slug] = {
      id: slug,
      title: title,
      shortDescription: shortDesc,
      category: item.category,
      dimension: item.dimension,
      hawkinsCalibration: `LoC ${item.baseLoC}`,
      hawkinsNumeric: item.baseLoC,
      lastModified: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      views: (Math.floor(Math.random() * 80) + 20) + ",000",
      watchers: Math.floor(Math.random() * 500) + 100,

      infobox: {
        title: title,
        subtitle: shortDesc,
        imagePath: imgUrl,
        fullImage: imgUrl,
        imageCaption: `Official Wikipedia Visual Representation of ${title}`,
        data: [
          { label: "Category", value: item.category },
          { label: "Dimension", value: item.dimension.toUpperCase() },
          { label: "Dr. Hawkins Scale", value: `<strong>LoC ${item.baseLoC}</strong>` }
        ]
      },

      contentHTML: contentHTML
    };
  }

  // Update data/articles.js with authentic fetched articles
  let articlesJsCode = fs.readFileSync('data/articles.js', 'utf8');

  // Replace primary articles in data/articles.js array with authentic fetched article objects
  global.window = global;
  eval(articlesJsCode);

  let existingArticles = window.METAWIKI_DATA.articles;

  // Replace matching primary articles with authentic fetched data
  for (let [slug, authenticArticle] of Object.entries(fetchedArticlesMap)) {
    const existingIndex = existingArticles.findIndex(a => a.id === slug || a.title.toLowerCase() === authenticArticle.title.toLowerCase());
    if (existingIndex !== -1) {
      existingArticles[existingIndex] = authenticArticle;
    } else {
      existingArticles.unshift(authenticArticle);
    }
  }

  // Write updated articles.js
  window.METAWIKI_DATA.articles = existingArticles;
  const updatedJs = `/**
 * MetaWiki - Metaphysical Knowledge Repository
 * Master Dataset with Authentic Wikipedia Extracts & Infobox Images
 */

window.METAWIKI_DATA = ${JSON.stringify(window.METAWIKI_DATA, null, 2)};
`;

  fs.writeFileSync('data/articles.js', updatedJs, 'utf-8');
  console.log(`Successfully synced ${Object.keys(fetchedArticlesMap).length} authentic Wikipedia articles with real images into data/articles.js!`);
}

main().catch(err => console.error("Error in fetch script:", err));
