const fs = require('fs');

// =========================================================================
// 1. UPDATE DATA/ARTICLES.JS (Expand Guides & Forum Topics datasets to 16 items each)
// =========================================================================
let articlesJsCode = fs.readFileSync('data/articles.js', 'utf8');

global.window = global;
eval(articlesJsCode);

window.METAWIKI_DATA.guides = [
  { wikiId: "hesychasm", title: "Hesychasm & Contemplative Heart Prayer Manual", subtitle: "Inner Stillness, Jesus Prayer & Uncreated Tabor Light", summary: "A step-by-step practical guide to Orthodox Hesychastic contemplation, rhythmic breath integration, and awakening the uncreated Divine Light.", hawkinsLevel: 700, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jesus-Christ-from-Hagia-Sophia.jpg/640px-Jesus-Christ-from-Hagia-Sophia.jpg" },
  { wikiId: "tree-of-life-kabbalah", title: "Kabbalistic Sephirotic Ascent & Tree of Life Map", subtitle: "Ascending the 10 Sephirot from Malkuth to Kether", summary: "Comprehensive roadmap through the 10 emanations of Ein Sof, balancing Chesed and Gevurah, and ascending the Middle Pillar of consciousness.", hawkinsLevel: 700, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kabbalah_Tree_of_Life.png/640px-Kabbalah_Tree_of_Life.png" },
  { wikiId: "wahdat-al-wujud", title: "Sufi Ego Annihilation (Fana) & 99 Names Meditation", subtitle: "Ibn Arabi's Path of Unity of Being & Heart Purification", summary: "Practical Sufi manual on ego dissolution (Fana), contemplation of the 99 Divine Names, and experiencing Wahdat al-Wujud in daily life.", hawkinsLevel: 650, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg/640px-Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg" },
  { wikiId: "advaita-vedanta", title: "Advaita Self-Inquiry (Vichara) & Atman Realization", subtitle: "Ramana Maharshi & Adi Shankara Non-Dual Practice", summary: "Direct guidance on asking 'Who am I?', turning attention inward toward pure awareness, and dissolving the illusion of individual ego.", hawkinsLevel: 850, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Raja_Ravi_Varma_-_Sankaracharya.jpg/640px-Raja_Ravi_Varma_-_Sankaracharya.jpg" },
  { wikiId: "zen", title: "Zen Zazen Sitting & Śūnyatā Contemplation Guide", subtitle: "Nāgārjuna's Emptiness & Shikantaza Just-Sitting", summary: "Meditative roadmap to investigating dependent origination (Pratītyasamutpāda) and realizing luminous emptiness (Śūnyatā).", hawkinsLevel: 800, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/640px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg" },
  { wikiId: "ashtanga-yoga", title: "Patanjali 8-Limbs Ashtanga Yoga & Kundalini Practice", subtitle: "Pranayama, Dharana, Dhyana & Samadhi Integration", summary: "Systematic practical guide through Yama/Niyama ethical foundations, breath control (Pranayama), and single-pointed concentration (Dharana).", hawkinsLevel: 600, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Patanjali.jpg/640px-Patanjali.jpg" },
  { wikiId: "kybalion", title: "Hermetic Seven Principles & Alchemical Mastery Manual", subtitle: "Mental Transmutation, Polarity, Rhythm & Vibration", summary: "Applied Hermetic guide explaining how to transmute low emotional states into high spiritual awareness using the 7 Cosmic Principles.", hawkinsLevel: 600, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kybalion_1908.jpg/640px-Kybalion_1908.jpg" },
  { wikiId: "carl-jung", title: "Jungian Active Imagination & Shadow Integration Guide", subtitle: "Transcending Ego Projections & Archetypal Synthesis", summary: "Step-by-step depth psychology guide to engaging subconscious imagery, integrating shadow aspects, and facilitating true Individuation.", hawkinsLevel: 540, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-330px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg" },
  { wikiId: "gnosticism", title: "Gnostic Gospel of Thomas & Divine Spark Awakening", subtitle: "Direct Knowledge (Gnosis) & Inner Light Realization", summary: "Contemplative initiation into Gnostic sayings of Jesus, uncovering the uncreated spark within, and transcending Demiurgic ignorance.", hawkinsLevel: 750, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png" },
  { wikiId: "spinoza", title: "Spinoza's Deus Sive Natura & Intuitive Knowledge Guide", subtitle: "Intellectual Love of God & Sub Specie Aeternitatis", summary: "Systematic guide to contemplating Nature as God (Panentheism) and cultivating third-kind intuitive knowledge beyond linear time.", hawkinsLevel: 720, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Spinoza.jpg/640px-Spinoza.jpg" },
  { wikiId: "sacred-geometry", title: "Sacred Geometry & Flower of Life Integration Manual", subtitle: "Platonic Solids, Metatron's Cube & Vector Equilibrium", summary: "Visual practice guide to contemplating cosmic proportions, golden ratio harmonics, and toroidal field mechanics.", hawkinsLevel: 620, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flower-of-Life-small.svg/640px-Flower-of-Life-small.svg.png" },
  { wikiId: "heart-sutra", title: "Prajñāpāramitā Heart Sutra Contemplation Manual", subtitle: "Form is Emptiness, Emptiness is Form", summary: "Direct guide to reciting and meditating upon Avalokiteśvara's profound realization of the five skandhas as empty of inherent existence.", hawkinsLevel: 880, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/640px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg" },
  { wikiId: "meister-eckhart", title: "Meister Eckhart's Gelassenheit & Birth of Logos in Soul", subtitle: "Detachment, Breakthrough (Durchbruch) & Divine Ground", summary: "Christian mystical roadmap to practicing total letting go (Gelassenheit) and witnessing the eternal birth of the Word in the quiet soul.", hawkinsLevel: 850, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jesus-Christ-from-Hagia-Sophia.jpg/640px-Jesus-Christ-from-Hagia-Sophia.jpg" },
  { wikiId: "tao-te-ching", title: "Tao Te Ching Wu Wei Practice & Water Course Way", subtitle: "Laozi's Non-Action, Harmony & Uncarved Block (Pu)", summary: "Applied Taoist manual on effortless action (Wu Wei), yielding strength like water, and aligning with the unnameable Tao.", hawkinsLevel: 810, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Patanjali.jpg/640px-Patanjali.jpg" },
  { wikiId: "nag-hammadi-library", title: "Nag Hammadi Library & Secret Revelations Roadmap", subtitle: "Codices, Pistis Sophia & Archontic Transcendence", summary: "Historical and spiritual study guide to the ancient Coptic Gnostic manuscripts discovered in Upper Egypt in 1945.", hawkinsLevel: 710, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png" },
  { wikiId: "logos", title: "The Divine Logos Initiation & Universal Reason Manual", subtitle: "Heraclitus, Stoicism, Philo & Johannine Gnosis", summary: "Master guide to identifying the cosmic ordering intelligence that permeates all physical and metaphysical reality.", hawkinsLevel: 750, imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png" }
];

window.METAWIKI_DATA.forumTopics = [
  { id: "forum-1", title: "Connecting John 1:1 Logos with Advaita Vedanta Brahman", category: "Comparative Theology", author: "HermeticScholar#1008", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/330px-Logos.svg.png", body: "How do you reconcile the Logos (Word) as the creative ordering principle of the universe with Adi Shankara's unmanifest Nirguna Brahman? Are they two sides of the same non-dual realization?", replies: 18, views: "12,400", time: "2 hours ago", upvotes: 28, repliesList: [{ author: "AdvaitaSeeker#2048", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Raja_Ravi_Varma_-_Sankaracharya.jpg/330px-Raja_Ravi_Varma_-_Sankaracharya.jpg", time: "1 hour ago", body: "Fascinating perspective! Shankara explicitly speaks of Maya as the creative power (Shakti) of Ishwara, which aligns closely with the active principle of Logos in John 1:1." }] },
  { id: "forum-2", title: "Experiencing Ego Death & Transpersonal Observer Consciousness", category: "Depth Psychology", author: "JungianAnalyst#3321", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-330px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg", body: "When the egoic self-referential loop collapses, what remains is uncreated witness consciousness. What practices help stabilize this state during daily life?", replies: 24, views: "18,900", time: "5 hours ago", upvotes: 35, repliesList: [] },
  { id: "forum-3", title: "Practical Hesychasm: The Jesus Prayer & Uncreated Light", category: "Gnosticism & Mysticism", author: "MysticHesychast#7771", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jesus-Christ-from-Hagia-Sophia.jpg/330px-Jesus-Christ-from-Hagia-Sophia.jpg", body: "Share experiences with synchronizing the prayer of the heart with respiratory rhythm. How does Hesychastic practice compare to Pranayama?", replies: 15, views: "9,600", time: "1 day ago", upvotes: 19, repliesList: [] },
  { id: "forum-4", title: "Navigating the 10 Sephirot: Tzimtzum & Vessel Breakdown", category: "Kabbalah", author: "KabbalisticSeeker#4040", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kabbalah_Tree_of_Life.png/330px-Kabbalah_Tree_of_Life.png", body: "Exploring Isaac Luria's doctrine of Shevirat ha-Kelim (Shattering of the Vessels) as a metaphor for psychological breakthrough and spiritual rebirth.", replies: 31, views: "22,100", time: "2 days ago", upvotes: 42, repliesList: [] },
  { id: "forum-5", title: "Non-Dual Realization: Dissolving the Observer-Observed Duality", category: "Advaita & Zen", author: "ZenMaster#8888", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/330px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg", body: "In Shikantaza, sitting is without seeker or goal. When subject and object collapse, form is emptiness and emptiness is form.", replies: 42, views: "34,500", time: "3 days ago", upvotes: 50, repliesList: [] },
  { id: "forum-6", title: "Alchemical Transmutation: Lead to Gold in Daily Awareness", category: "Hermeticism & Alchemy", author: "AlchemyAdept#1212", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kybalion_1908.jpg/330px-Kybalion_1908.jpg", body: "Discussing the Hermetic Principle of Polarity. How do you transmute fear (LoC 100) into courage (LoC 200) using intentional focus?", replies: 19, views: "14,800", time: "4 days ago", upvotes: 22, repliesList: [] },
  { id: "forum-7", title: "Hawkins Scale LoC Calibrations: Measuring Spiritual Texts", category: "Comparative Theology", author: "CalibrationAnalyst#5555", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/330px-Logos.svg.png", body: "What methodologies do you use when calibrating texts using kinesiological muscle testing? Exploring the transition from Reason (LoC 400) to Love (LoC 500).", replies: 14, views: "11,200", time: "5 days ago", upvotes: 18, repliesList: [] },
  { id: "forum-8", title: "Kundalini Bio-Energetics: Safe Awakening & Chakra Balance", category: "Advaita & Zen", author: "YogaAdept#9999", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Patanjali.jpg/330px-Patanjali.jpg", body: "Discussing the somatic sensations of prana moving through Sushumna Nadi. Grounding techniques for intense energetic awakenings.", replies: 27, views: "19,400", time: "6 days ago", upvotes: 31, repliesList: [] },
  { id: "forum-9", title: "Spinoza's Panentheism vs Gnostic Dualism", category: "Comparative Theology", author: "PhilosophySeeker#1111", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Spinoza.jpg/330px-Spinoza.jpg", body: "Is Nature as Substance (Deus Sive Natura) fundamentally incompatible with Gnostic rejection of the material Demiurge?", replies: 16, views: "8,900", time: "1 week ago", upvotes: 21, repliesList: [] },
  { id: "forum-10", title: "The Heart Sutra Gate Gate Pāragate Realization", category: "Advaita & Zen", author: "PrajnaSeeker#2222", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/330px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg", body: "Gone, gone, gone beyond, gone completely beyond to the other shore. What is the experiential meaning of the mantra?", replies: 33, views: "25,600", time: "1 week ago", upvotes: 40, repliesList: [] },
  { id: "forum-11", title: "Ibn Arabi's Creative Imagination & The World of Images (Alam al-Mithal)", category: "Gnosticism & Mysticism", author: "SufiInitiate#3333", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg/330px-Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg", body: "How the intermediate realm of Alam al-Mithal bridge physical sensations and unmanifest spiritual truths.", replies: 12, views: "7,800", time: "2 weeks ago", upvotes: 17, repliesList: [] },
  { id: "forum-12", title: "Integrating the Shadow: Active Imagination Techniques", category: "Depth Psychology", author: "JungianPractitioner#4444", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-330px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg", body: "Sharing practical journal templates and inner dialogue techniques for engaging active imagination without ego inflation.", replies: 29, views: "21,300", time: "2 weeks ago", upvotes: 36, repliesList: [] },
  { id: "forum-13", title: "The Middle Pillar Ritual: Balancing Energy in Malkuth & Kether", category: "Kabbalah", author: "HermeticKabbalist#5555", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kabbalah_Tree_of_Life.png/330px-Kabbalah_Tree_of_Life.png", body: "Step by step experiences with Regardie's Middle Pillar exercise for aligning the five sphere centers.", replies: 21, views: "16,100", time: "3 weeks ago", upvotes: 25, repliesList: [] },
  { id: "forum-14", title: "The Emerald Tablet of Hermes Trismegistus: As Above, So Below", category: "Hermeticism & Alchemy", author: "EmeraldScholar#6666", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kybalion_1908.jpg/330px-Kybalion_1908.jpg", body: "Deconstructing the 13 maxims of the Emerald Tablet and their application in quantum physics and consciousness research.", replies: 38, views: "29,400", time: "3 weeks ago", upvotes: 44, repliesList: [] },
  { id: "forum-15", title: "Self-Inquiry (Atma-Vichara): Who Am I When Thoughts Rest?", category: "Advaita & Zen", author: "RamanaDevotee#7777", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Raja_Ravi_Varma_-_Sankaracharya.jpg/330px-Raja_Ravi_Varma_-_Sankaracharya.jpg", body: "Trimming the I-thought back to its source in the spiritual Heart (Hridaya).", replies: 45, views: "38,900", time: "1 month ago", upvotes: 52, repliesList: [] },
  { id: "forum-16", title: "Tabor Light & Transfiguration in Hesychastic Prayer", category: "Gnosticism & Mysticism", author: "OrthodoxMystic#8888", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jesus-Christ-from-Hagia-Sophia.jpg/330px-Jesus-Christ-from-Hagia-Sophia.jpg", body: "Gregory Palamas' defense of uncreated grace and physical perception of divine illumination.", replies: 20, views: "15,200", time: "1 month ago", upvotes: 27, repliesList: [] }
];

const updatedArticlesJs = `/**
 * MetaWiki - Master Dataset with Expanded Guides & Forum Feeds
 */

window.METAWIKI_DATA = ${JSON.stringify(window.METAWIKI_DATA, null, 2)};
`;

fs.writeFileSync('data/articles.js', updatedArticlesJs, 'utf-8');
console.log('1. Updated data/articles.js with 16 Guides and 16 Forum Topics!');

// =========================================================================
// 2. UPDATE INDEX.HTML (Add Show More button containers for Guides & Forums)
// =========================================================================
let html = fs.readFileSync('index.html', 'utf8');

// Update Guides feed section HTML with Show More button
const oldGuidesEnd = `<div class="triadic-grid" id="guidesFeedGrid" style="margin-top: 1.5rem;">
          <!-- Rendered dynamically -->
        </div>
      </div>`;

const newGuidesEnd = `<div class="triadic-grid" id="guidesFeedGrid" style="margin-top: 1.5rem;">
          <!-- Rendered dynamically -->
        </div>
        <div style="text-align: center; margin-top: 2rem; margin-bottom: 2rem;" id="loadMoreGuidesContainer">
          <button id="loadMoreGuidesBtn" class="load-more-feed-btn" style="border: none;">
            <span>Show More Guides ➔</span>
          </button>
        </div>
      </div>`;

if (html.includes(oldGuidesEnd)) {
  html = html.replace(oldGuidesEnd, newGuidesEnd);
}

// Update Forums feed section HTML with Show More button
const oldForumsEnd = `<div class="forum-topics-grid" id="forumsFeedGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem;">
          <!-- Rendered dynamically -->
        </div>
      </div>`;

const newForumsEnd = `<div class="forum-topics-grid" id="forumsFeedGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem;">
          <!-- Rendered dynamically -->
        </div>
        <div style="text-align: center; margin-top: 2rem; margin-bottom: 3rem;" id="loadMoreForumsContainer">
          <button id="loadMoreForumsBtn" class="load-more-feed-btn" style="border: none;">
            <span>Show More Discussions ➔</span>
          </button>
        </div>
      </div>`;

if (html.includes(oldForumsEnd)) {
  html = html.replace(oldForumsEnd, newForumsEnd);
}

fs.writeFileSync('index.html', html, 'utf-8');
console.log('2. Updated index.html with Show More buttons for Guides & Forums!');

// =========================================================================
// 3. UPDATE APP.JS (Universal thumbnail click delegation, 5-row batch pagination for all feeds, solid fallback images, scroll header)
// =========================================================================
let appCode = fs.readFileSync('app.js', 'utf8');

// A. Global event listener for ANY [data-wiki] element so clicking thumbnails open articles reliably
const globalClickDelegation = `
  // =========================================================================
  // UNIVERSAL CLICK DELEGATION FOR ALL ARTICLE THUMBNAILS & CARDS
  // =========================================================================
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-wiki]');
    if (card) {
      const wikiId = card.getAttribute('data-wiki');
      if (wikiId) {
        e.preventDefault();
        loadArticle(wikiId);
      }
    }
  });
`;

if (!appCode.includes('UNIVERSAL CLICK DELEGATION FOR ALL ARTICLE THUMBNAILS')) {
  appCode = appCode.replace('function initSmartScrollHeader() {', globalClickDelegation + '\n  function initSmartScrollHeader() {');
}

// B. Implement 5-row batch pagination for Knowledge Feed, Guides Feed, and Forums Feed
const paginationFeedCode = `
  // 5-Row Feed Pagination States (5 rows ~ 15 items per batch)
  let portalFeedLimit = 15;
  let guidesFeedLimit = 15;
  let forumsFeedLimit = 15;

  function renderPortalFeed(append = false) {
    const grid = document.getElementById('portalFeedGrid');
    const badge = document.getElementById('feedCountBadge');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreBtn = document.getElementById('loadMoreFeedBtn');
    if (!grid) return;

    const ranked = getRankedArticles();
    if (badge) badge.textContent = \`\${ranked.length.toLocaleString()} Contemplations\`;

    const visibleItems = ranked.slice(0, portalFeedLimit);

    grid.innerHTML = visibleItems.map(a => \`
      <div class="triadic-card" data-wiki="\${a.id}" style="cursor: pointer;">
        <div>
          <div class="triadic-thumbnail-pic" style="overflow: hidden;">
            <img src="\${getArticleImagePath(a)}" alt="\${a.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png'; this.style.display='block';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
          </div>
          <div class="triadic-card-title">\${a.title}</div>
          <div class="triadic-card-subtitle">\${a.shortDescription}</div>
          <div class="triadic-card-summary" style="font-size: 0.8rem; color: var(--mw-text-muted); margin-top: 0.4rem; line-height: 1.4;">Category: <strong>\${a.category}</strong></div>
        </div>
        <div class="triadic-card-footer">
          \${createHawkinsRainbowBar(a.hawkinsCalibration || a.hawkinsNumeric)}
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="card-views-footer"><i class="ph ph-eye"></i> \${a.views || '45,000'}</span>
            <span style="color: var(--mw-gold); font-weight: 700;">Read Article ➔</span>
          </div>
        </div>
      </div>
    \`).join('');

    if (loadMoreContainer) {
      loadMoreContainer.style.display = portalFeedLimit < ranked.length ? 'block' : 'none';
    }

    if (loadMoreBtn && !loadMoreBtn.dataset.bound) {
      loadMoreBtn.dataset.bound = 'true';
      loadMoreBtn.addEventListener('click', () => {
        portalFeedLimit += 15;
        renderPortalFeed();
      });
    }
  }

  function renderGuidesFeed() {
    const grid = document.getElementById('guidesFeedGrid');
    const loadMoreContainer = document.getElementById('loadMoreGuidesContainer');
    const loadMoreBtn = document.getElementById('loadMoreGuidesBtn');
    if (!grid || !window.METAWIKI_DATA.guides) return;

    const guides = window.METAWIKI_DATA.guides;
    const visibleGuides = guides.slice(0, guidesFeedLimit);

    grid.innerHTML = visibleGuides.map(g => \`
      <div class="triadic-card" data-wiki="\${g.wikiId}" style="cursor: pointer;">
        <div>
          <div class="triadic-thumbnail-pic" style="overflow: hidden;">
            <img src="\${g.imagePath}" alt="\${g.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png'; this.style.display='block';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
          </div>
          <div class="triadic-card-title">\${g.title}</div>
          <div class="triadic-card-subtitle">\${g.subtitle}</div>
          <div class="triadic-card-summary">\${g.summary}</div>
        </div>
        <div class="triadic-card-footer">
          \${createHawkinsRainbowBar(g.hawkinsLevel)}
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="card-views-footer"><i class="ph ph-eye"></i> \${getArticleViews(g.wikiId)}</span>
            <span style="color: var(--mw-gold); font-weight: 700;">Open Guide ➔</span>
          </div>
        </div>
      </div>
    \`).join('');

    if (loadMoreContainer) {
      loadMoreContainer.style.display = guidesFeedLimit < guides.length ? 'block' : 'none';
    }

    if (loadMoreBtn && !loadMoreBtn.dataset.bound) {
      loadMoreBtn.dataset.bound = 'true';
      loadMoreBtn.addEventListener('click', () => {
        guidesFeedLimit += 15;
        renderGuidesFeed();
      });
    }
  }

  function renderForumsFeed() {
    const grid = document.getElementById('forumsFeedGrid');
    const loadMoreContainer = document.getElementById('loadMoreForumsContainer');
    const loadMoreBtn = document.getElementById('loadMoreForumsBtn');
    if (!grid || !window.METAWIKI_DATA.forumTopics) return;

    const topics = window.METAWIKI_DATA.forumTopics;
    const visibleTopics = topics.slice(0, forumsFeedLimit);

    grid.innerHTML = visibleTopics.map(t => \`
      <div class="forum-topic-card" data-id="\${t.id}" style="cursor: pointer; background: rgba(18, 18, 26, 0.85); backdrop-filter: blur(20px); border: 1px solid var(--mw-border); border-radius: 16px; padding: 1.4rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 250px;">
        <div>
          <div class="forum-topic-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; gap: 0.5rem;">
            <span class="forum-category-pill" style="font-size: 0.72rem; font-weight: 800; padding: 0.25rem 0.65rem; border-radius: 20px; background: rgba(168, 85, 247, 0.15); color: var(--mw-violet); border: 1px solid var(--mw-border-violet); flex-shrink: 0;">\${t.category}</span>
            <span style="font-size: 0.75rem; color: var(--mw-text-muted); flex-shrink: 0;">\${t.time}</span>
          </div>
          <h3 class="forum-topic-title" style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: #fff; margin: 0 0 0.6rem 0; line-height: 1.35;">\${t.title}</h3>
          <p class="forum-topic-body" style="font-size: 0.85rem; color: var(--mw-text-muted); line-height: 1.5; margin: 0 0 1.2rem 0;">\${t.body}</p>
        </div>
        <div class="forum-topic-footer" style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--mw-border); padding-top: 0.85rem; font-size: 0.82rem; gap: 0.75rem; flex-wrap: nowrap;">
          <div class="forum-topic-author" style="display: flex; align-items: center; gap: 0.5rem; min-width: 0; flex: 1;">
            <img src="\${t.avatar}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1px solid var(--mw-border-gold); flex-shrink: 0;" alt="Author" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/330px-Logos.svg.png';">
            <span style="font-weight: 700; color: #e2e8f0; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">\${t.author}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.85rem; color: var(--mw-gold); font-weight: 700; flex-shrink: 0; white-space: nowrap;">
            <span style="display: inline-flex; align-items: center; gap: 0.35rem;"><i class="ph ph-chat-circle-text"></i> \${t.replies} replies</span>
            <span style="color: var(--mw-gold); cursor: pointer;">Join ➔</span>
          </div>
        </div>
      </div>
    \`).join('');

    grid.querySelectorAll('.forum-topic-card').forEach(card => {
      card.addEventListener('click', () => {
        const topicId = card.getAttribute('data-id');
        if (topicId) openForumThreadModal(topicId);
      });
    });

    if (loadMoreContainer) {
      loadMoreContainer.style.display = forumsFeedLimit < topics.length ? 'block' : 'none';
    }

    if (loadMoreBtn && !loadMoreBtn.dataset.bound) {
      loadMoreBtn.dataset.bound = 'true';
      loadMoreBtn.addEventListener('click', () => {
        forumsFeedLimit += 15;
        renderForumsFeed();
      });
    }
  }
`;

// Helper getArticleImagePath
const getImagePathHelper = `
  function getArticleImagePath(a) {
    if (!a) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png';
    let path = (a.infobox && a.infobox.imagePath) || a.imagePath || a.leadImage || a.thumbnail;
    if (!path || typeof path !== 'string' || path.length < 5) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png';
    }
    return path.split('?')[0];
  }
`;

if (!appCode.includes('function getArticleImagePath(')) {
  appCode = getImagePathHelper + '\n' + appCode;
}

// Replace renderPortalFeed, renderGuidesFeed, renderForumsFeed in app.js
const oldFeedBlockRegex = /function renderPortalFeed\([\s\S]*?function renderForumsFeed\(\) \{[\s\S]*?\}\n  \}/;

if (oldFeedBlockRegex.test(appCode)) {
  appCode = appCode.replace(oldFeedBlockRegex, paginationFeedCode);
}

fs.writeFileSync('app.js', appCode, 'utf-8');
console.log('3. Updated app.js with universal click delegation, 5-row batch pagination for all feeds, and solid image fallbacks!');
