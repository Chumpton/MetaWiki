/**
 * Script to generate 2,000 Articles, 2,000 Practical Guides, and 2,000 Forum Topics
 * with authentic Wikipedia thumbnails, category bubble tags, Hawkins calibrations,
 * and complete interactive feed data.
 */

const fs = require('fs');
const path = require('path');

const CATEGORIES_ARTICLES = [
  'Ontology & Being', 'Epistemology & Mind', 'Consciousness & LoC',
  'Idealism & Non-Duality', 'Quantum Metaphysics', 'Sacred Geometry & Cosmology',
  'Esoteric & Hermeticism', 'Ancient Mysticism & Lineages', 'Depth & Transpersonal Psychology',
  'Determinism & Free Will', 'Transpersonal Avatars & Luminaries', 'Alchemy & Biofield Energy',
  'Teleology & Purpose', 'Existential Metaphysics', 'Metaphysical Logic & Axioms'
];

const CATEGORIES_GUIDES = [
  'Initiation Roadmaps', 'Meditation & Yoga Mechanics', 'Hermetic Practices',
  'Consciousness Calibration', 'Transpersonal Self-Inquiry', 'Sacred Geometry Mechanics',
  'Alchemical Transformation', 'Gnostic Contemplation'
];

const CATEGORIES_FORUMS = [
  'Metaphysical Debate', 'Meditation Practices', 'Depth Psychology',
  'Non-Dual Contemplations', 'Sacred Mechanics', 'Hawkins LoC Debates',
  'Hermetic Scholarship'
];

const WIKI_THUMBNAILS = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-330px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Raja_Ravi_Varma_-_Sankaracharya.jpg/330px-Raja_Ravi_Varma_-_Sankaracharya.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Patanjali.jpg/330px-Patanjali.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Aristotle_Altemps_Inv8575.jpg/330px-Aristotle_Altemps_Inv8575.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Spinoza.jpg/330px-Spinoza.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Gottfried_Wilhelm_von_Leibniz%2C_Bernhard_Christoph_Francke.jpg/330px-Gottfried_Wilhelm_von_Leibniz%2C_Bernhard_Christoph_Francke.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Plotinos.jpg/330px-Plotinos.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Laozi_-_Eremitage.jpg/330px-Laozi_-_Eremitage.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Meister_Eckhart.jpg/330px-Meister_Eckhart.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Immanuel_Kant_%28painted_portrait%29.jpg/330px-Immanuel_Kant_%28painted_portrait%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Hegel_portrait_by_Schlesinger_1831.jpg/330px-Hegel_portrait_by_Schlesinger_1831.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Schopenhauer.jpg/330px-Schopenhauer.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche1882.jpg/330px-Nietzsche1882.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/HermesTrismegistusCtdralSiena.jpg/330px-HermesTrismegistusCtdralSiena.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Pythagoras_in_the_Musei_Capitolini.jpg/330px-Pythagoras_in_the_Musei_Capitolini.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/330px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Nagarjuna.jpg/330px-Nagarjuna.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Sri_Ramana_Maharshi.jpg/330px-Sri_Ramana_Maharshi.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Paramahansa_Yogananda_1920.jpg/330px-Paramahansa_Yogananda_1920.jpg'
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getItem(arr, idx) {
  return arr[(idx * 37) % arr.length];
}

// 1. Generate 2,000 Articles
function generateArticles() {
  const articles = [];
  const usedSlugs = new Set();

  for (let i = 0; i < 2000; i++) {
    const cat = getItem(CATEGORIES_ARTICLES, i);
    const imgUrl = getItem(WIKI_THUMBNAILS, i * 7);
    const locNum = 200 + ((i * 19) % 750);
    const locStr = `LoC ${locNum}`;

    let title = "";
    if (i === 0) title = "Plato's Theory of Forms";
    else if (i === 1) title = "Active Imagination (C.G. Jung)";
    else if (i === 2) title = "Advaita Vedanta Non-Duality (Adi Shankara)";
    else title = `Metaphysical Aspect of ${cat} (Facet ${i + 1})`;

    let slug = slugify(title);
    if (usedSlugs.has(slug)) slug += `-${i}`;
    usedSlugs.add(slug);

    articles.push({
      id: slug,
      title: title,
      shortDescription: `${title} — Metaphysical Concept & Consciousness Analysis.`,
      category: cat,
      dimension: cat.split(' ')[0].toLowerCase(),
      hawkinsCalibration: locStr,
      hawkinsNumeric: locNum,
      lastModified: "11 August 2026",
      views: (12000 + (i * 311) % 95000).toLocaleString(),
      watchers: 150 + (i % 400),
      infobox: {
        title: title,
        subtitle: `${title} — Metaphysical Concept & Consciousness Analysis.`,
        imagePath: imgUrl,
        fullImage: imgUrl,
        imageCaption: `Official Wikipedia Visual Representation of ${title}`,
        data: [
          { label: "Category", value: cat },
          { label: "Hawkins Calibration", value: locStr },
          { label: "Wikipedia Status", value: "Verified Academic Record" }
        ]
      },
      metaphysicalInterpretation: {
        title: `Metaphysical & Ontological Interpretation of ${title}`,
        maxim: `“In ${title}, form and essence converge to express the non-dual truth of universal consciousness.”`,
        hawkinsContext: `Calibrated at ${locStr} on Dr. David R. Hawkins' Map of Consciousness.`,
        synthesis: `${title} illuminates the underlying metaphysical mechanics governing reality.`
      },
      contentHTML: `
        <div class="metaphysical-interpretation-banner" style="margin-bottom: 2.2rem; padding: 1.5rem 1.8rem; background: linear-gradient(135deg, rgba(20, 16, 38, 0.95), rgba(10, 8, 20, 0.95)); border: 1px solid var(--mw-gold); border-radius: 12px; box-shadow: 0 8px 32px rgba(251, 191, 36, 0.15); backdrop-filter: blur(10px);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem; border-bottom: 1px solid rgba(251, 191, 36, 0.25); padding-bottom: 0.6rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem; color: var(--mw-gold); font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800;">
              <i class="ph ph-sparkle" style="font-size: 1.3rem;"></i>
              <span>Metaphysical & Ontological Interpretation</span>
            </div>
            <span class="hawkins-badge-pill" style="padding: 0.3rem 0.8rem; background: rgba(251, 191, 36, 0.15); border: 1px solid var(--mw-gold); border-radius: 20px; color: var(--mw-gold); font-size: 0.82rem; font-weight: 700;">
              <i class="ph ph-lightning"></i> ${locStr} Calibration
            </span>
          </div>
          <div style="font-family: 'Cinzel', Georgia, serif; font-style: italic; font-size: 1.05rem; color: #fff; margin-bottom: 0.9rem; line-height: 1.5; padding-left: 0.8rem; border-left: 3px solid var(--mw-gold);">
            “In ${title}, form and essence converge to express the non-dual truth of universal unconditioned awareness.”
          </div>
          <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.6; margin: 0;">
            <strong>Transpersonal Hermeneutic Synthesis:</strong> ${title} articulates how consciousness structures subjective experience, guiding the initiate from dualistic identification into direct alignment with higher ontological reality.
          </p>
        </div>
        <div class="wiki-content-body">
          <h2 id="overview" class="article-section-title">1. Overview & Historical Context</h2>
          <p><strong>${title}</strong> is a foundational concept in <em>${cat}</em> that has shaped metaphysical inquiry, comparative philosophy, and transpersonal understanding across historical epochs. It provides an essential conceptual bridge between manifest phenomenon and unmanifest essence.</p>

          <h2 id="history" class="article-section-title">2. Historical Development & Perennial Lineage</h2>
          <p>The philosophical evolution of <strong>${title}</strong> can be traced through ancient contemplative traditions into modern metaphysical synthesis. Early thinkers recognized that empirical perception alone could not account for the structural coherence of reality, postulating underlying organizing principles.</p>
          <p>Throughout scholastic and hermetic traditions, scholars preserved these insights, mapping how form, energy, and mind interact across dimensions of existence.</p>

          <h2 id="core-principles" class="article-section-title">3. Core Philosophies, Principles & Dynamics</h2>
          <p>At the center of <strong>${title}</strong> are several primary metaphysical dynamics:</p>
          <ul>
            <li><strong>Ontological Primacy:</strong> Consciousness precedes matter, establishing subjective awareness as the ground of all experience.</li>
            <li><strong>Structural Coherence:</strong> Universal laws govern the manifestation of form, maintaining balance across systemic scales.</li>
            <li><strong>Non-Dual Unity:</strong> Apparent dualities resolve into a singular unconditioned reality when perceived from higher calibrations.</li>
          </ul>

          <h2 id="metaphysical-mechanics" class="article-section-title">4. Metaphysical Mechanics & Ontological Framework</h2>
          <p>In terms of ontological mechanics, <strong>${title}</strong> operates through a triad of intent, resonance, and manifestation. By examining the subtle relationship between observer and observed, initiates gain insight into how mental states project perceived reality.</p>

          <h2 id="consciousness-calibration" class="article-section-title">5. Consciousness Analysis & Hawkins Calibration</h2>
          <p>On Dr. David R. Hawkins' Map of Consciousness, <strong>${title}</strong> is calibrated at <strong>${locStr}</strong>. At this level of awareness, perception shifts from dualistic linear reasoning to non-linear realization, dissolving egoic identification and expanding into transcendent clarity.</p>

          <h2 id="synthesis-references" class="article-section-title">6. Comparative Non-Dual Synthesis & Academic References</h2>
          <p>When aligned with comparative perennial philosophy—including Advaita Vedanta, Hermeticism, and Depth Psychology—<strong>${title}</strong> confirms the universal convergence of ancient wisdom and contemporary consciousness research.</p>
          <p><em>References:</em> Standard Academic MetaWiki Corpus & Live Wikipedia Database Integration.</p>
        </div>
      `
    });
  }
  return articles;
}

// 2. Generate 2,000 Guides
function generateGuides(articles) {
  const guides = [];

  for (let i = 0; i < 2000; i++) {
    const cat = getItem(CATEGORIES_GUIDES, i);
    const imgUrl = getItem(WIKI_THUMBNAILS, i * 11);
    const linkedArticle = articles[i % articles.length];
    const locNum = 350 + ((i * 13) % 450);

    guides.push({
      id: `guide-${i + 1}`,
      title: `Step-by-Step Initiation Guide: ${linkedArticle.title}`,
      subtitle: `Practical execution roadmap for ${cat}`,
      summary: `A structured 7-step contemplative framework to integrate ${linkedArticle.title} into daily awareness and spiritual self-inquiry.`,
      category: cat,
      hawkinsLevel: locNum,
      imagePath: imgUrl,
      views: (8500 + (i * 240) % 78000).toLocaleString(),
      stepsCount: 5 + (i % 6),
      readTime: `${8 + (i % 15)} min read`,
      wikiId: linkedArticle.id
    });
  }
  return guides;
}

// 3. Generate 2,000 Forum Topics
function generateForumTopics() {
  const AUTHORS = [
    'GnosticSeeker#1337', 'Sophia_Lover#404', 'EgoDissolver#99',
    'HermeticScholar#202', 'NonDualObserver#777', 'KriyaPioneer#505',
    'JungianAlchemist#314', 'QuantumMystic#808', 'TaborLight#909'
  ];

  const topics = [];

  for (let i = 0; i < 2000; i++) {
    const cat = getItem(CATEGORIES_FORUMS, i);
    const author = getItem(AUTHORS, i * 3);
    const upvotes = 12 + ((i * 47) % 850);
    const replies = 3 + ((i * 19) % 240);

    topics.push({
      id: `topic-${i + 1}`,
      title: `Contemplation #${i + 1}: How does ${cat} apply to daily non-dual awareness?`,
      category: cat,
      author: author,
      avatarColor: ['#fbbf24', '#a855f7', '#38bdf8', '#4ade80', '#f472b6'][i % 5],
      timestamp: `${(i % 24) + 1} hours ago`,
      body: `I've been meditating on the principles of ${cat}. Has anyone noticed how the Hawkins LoC calibration shifts when transitioning from intellect to direct observation? Would love community insights!`,
      upvotes: upvotes,
      repliesCount: replies
    });
  }
  return topics;
}

console.log('Generating 2,000 Articles, 2,000 Guides, and 2,000 Forum Topics...');
const articles = generateArticles();
const guides = generateGuides(articles);
const forumTopics = generateForumTopics();

console.log(`Generated ${articles.length} Articles, ${guides.length} Guides, ${forumTopics.length} Forum Topics.`);

const fileContent = `/**
 * MetaWiki Dataset — 2,000 Articles, 2,000 Practical Guides, and 2,000 Forum Topics
 */

window.METAWIKI_DATA = {
  articles: ${JSON.stringify(articles, null, 2)},
  guides: ${JSON.stringify(guides, null, 2)},
  forumTopics: ${JSON.stringify(forumTopics, null, 2)}
};
`;

const outputPath = path.join(__dirname, '..', 'data', 'articles.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`Saved full dataset to ${outputPath}`);
