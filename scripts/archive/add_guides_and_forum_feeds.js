const fs = require('fs');

// 1. Populate guides and forumTopics in data/articles.js
let articlesJsCode = fs.readFileSync('data/articles.js', 'utf8');

global.window = global;
eval(articlesJsCode);

window.METAWIKI_DATA.guides = [
  {
    wikiId: "hesychasm",
    title: "Hesychasm & Contemplative Heart Prayer Manual",
    subtitle: "Inner Stillness, Jesus Prayer & Uncreated Tabor Light",
    summary: "A step-by-step practical guide to Orthodox Hesychastic contemplation, rhythmic breath integration, and awakening the uncreated Divine Light.",
    hawkinsLevel: 700,
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jesus-Christ-from-Hagia-Sophia.jpg/640px-Jesus-Christ-from-Hagia-Sophia.jpg"
  },
  {
    wikiId: "tree-of-life-kabbalah",
    title: "Kabbalistic Sephirotic Ascent & Tree of Life Map",
    subtitle: "Ascending the 10 Sephirot from Malkuth to Kether",
    summary: "Comprehensive roadmap through the 10 emanations of Ein Sof, balancing Chesed and Gevurah, and ascending the Middle Pillar of consciousness.",
    hawkinsLevel: 700,
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kabbalah_Tree_of_Life.png/640px-Kabbalah_Tree_of_Life.png"
  },
  {
    wikiId: "wahdat-al-wujud",
    title: "Sufi Ego Annihilation (Fana) & 99 Names Meditation",
    subtitle: "Ibn Arabi's Path of Unity of Being & Heart Purification",
    summary: "Practical Sufi manual on ego dissolution (Fana), contemplation of the 99 Divine Names, and experiencing Wahdat al-Wujud in daily life.",
    hawkinsLevel: 650,
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg/640px-Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg"
  },
  {
    wikiId: "advaita-vedanta",
    title: "Advaita Self-Inquiry (Vichara) & Atman Realization",
    subtitle: "Ramana Maharshi & Adi Shankara Non-Dual Practice",
    summary: "Direct guidance on asking 'Who am I?', turning attention inward toward pure awareness, and dissolving the illusion of individual ego.",
    hawkinsLevel: 850,
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Raja_Ravi_Varma_-_Sankaracharya.jpg/640px-Raja_Ravi_Varma_-_Sankaracharya.jpg"
  },
  {
    wikiId: "sunyata",
    title: "Zen Zazen Sitting & Śūnyatā Contemplation Guide",
    subtitle: "Nāgārjuna's Emptiness & Shikantaza Just-Sitting",
    summary: "Meditative roadmap to investigating dependent origination (Pratītyasamutpāda) and realizing luminous emptiness (Śūnyatā).",
    hawkinsLevel: 800,
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/640px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg"
  },
  {
    wikiId: "patanjali",
    title: "Patanjali 8-Limbs Ashtanga Yoga & Kundalini Practice",
    subtitle: "Pranayama, Dharana, Dhyana & Samadhi Integration",
    summary: "Systematic practical guide through Yama/Niyama ethical foundations, breath control (Pranayama), and single-pointed concentration (Dharana).",
    hawkinsLevel: 600,
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Patanjali.jpg/640px-Patanjali.jpg"
  },
  {
    wikiId: "kybalion",
    title: "Hermetic Seven Principles & Alchemical Mastery Manual",
    subtitle: "Mental Transmutation, Polarity, Rhythm & Vibration",
    summary: "Applied Hermetic guide explaining how to transmute low emotional states into high spiritual awareness using the 7 Cosmic Principles.",
    hawkinsLevel: 600,
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kybalion_1908.jpg/640px-Kybalion_1908.jpg"
  },
  {
    wikiId: "carl-jung",
    title: "Jungian Active Imagination & Shadow Integration Guide",
    subtitle: "Transcending Ego Projections & Archetypal Synthesis",
    summary: "Step-by-step depth psychology guide to engaging subconscious imagery, integrating shadow aspects, and facilitating true Individuation.",
    hawkinsLevel: 540,
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-330px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg"
  }
];

window.METAWIKI_DATA.forumTopics = [
  {
    id: "forum-1",
    title: "Connecting John 1:1 Logos with Advaita Vedanta Brahman",
    category: "Comparative Theology",
    author: "HermeticScholar#1008",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/330px-Logos.svg.png",
    body: "How do you reconcile the Logos (Word) as the creative ordering principle of the universe with Adi Shankara's unmanifest Nirguna Brahman? Are they two sides of the same non-dual realization?",
    replies: 18,
    views: "12,400",
    time: "2 hours ago"
  },
  {
    id: "forum-2",
    title: "Experiencing Ego Death & Transpersonal Observer Consciousness",
    category: "Depth Psychology",
    author: "JungianAnalyst#3321",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-330px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg",
    body: "When the egoic self-referential loop collapses, what remains is uncreated witness consciousness. What practices help stabilize this state during daily life?",
    replies: 24,
    views: "18,900",
    time: "5 hours ago"
  },
  {
    id: "forum-3",
    title: "Practical Hesychasm: The Jesus Prayer & Uncreated Light",
    category: "Gnosticism & Mysticism",
    author: "MysticHesychast#7771",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jesus-Christ-from-Hagia-Sophia.jpg/330px-Jesus-Christ-from-Hagia-Sophia.jpg",
    body: "Share experiences with synchronizing the prayer of the heart with respiratory rhythm. How does Hesychastic practice compare to Pranayama?",
    replies: 15,
    views: "9,600",
    time: "1 day ago"
  },
  {
    id: "forum-4",
    title: "Navigating the 10 Sephirot: Tzimtzum & Vessel Breakdown",
    category: "Kabbalah",
    author: "KabbalisticSeeker#4040",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kabbalah_Tree_of_Life.png/330px-Kabbalah_Tree_of_Life.png",
    body: "Exploring Isaac Luria's doctrine of Shevirat ha-Kelim (Shattering of the Vessels) as a metaphor for psychological breakthrough and spiritual rebirth.",
    replies: 31,
    views: "22,100",
    time: "2 days ago"
  },
  {
    id: "forum-5",
    title: "Non-Dual Realization: Dissolving the Observer-Observed Duality",
    category: "Advaita & Zen",
    author: "ZenMaster#8888",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/330px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg",
    body: "In Shikantaza, sitting is without seeker or goal. When subject and object collapse, form is emptiness and emptiness is form.",
    replies: 42,
    views: "34,500",
    time: "3 days ago"
  },
  {
    id: "forum-6",
    title: "Alchemical Transmutation: Lead to Gold in Daily Awareness",
    category: "Hermeticism & Alchemy",
    author: "AlchemyAdept#1212",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kybalion_1908.jpg/330px-Kybalion_1908.jpg",
    body: "Discussing the Hermetic Principle of Polarity. How do you transmute fear (LoC 100) into courage (LoC 200) using intentional focus?",
    replies: 19,
    views: "14,800",
    time: "4 days ago"
  }
];

const updatedArticlesJs = `/**
 * MetaWiki - Metaphysical Knowledge Repository
 * Master Dataset with Authentic Wikipedia Extracts, Guides & Forum Feeds
 */

window.METAWIKI_DATA = ${JSON.stringify(window.METAWIKI_DATA, null, 2)};
`;

fs.writeFileSync('data/articles.js', updatedArticlesJs, 'utf-8');
console.log('Successfully updated data/articles.js with Guides & Forum feeds data!');

// 2. Insert Guides & Forum Feed sections into index.html
let html = fs.readFileSync('index.html', 'utf8');

const targetIndex = html.indexOf('<!-- CUSTOMIZE USER INTERESTS MODAL -->');

const newFeedsHTML = `
      <!-- 2. PRACTICAL GUIDES & INITIATION ROADMAPS FEED -->
      <div class="portal-sections-container" id="guidesFeedSection" style="border: none; margin-top: 3rem;">
        <div class="feed-header-wrapper" style="border: none;">
          <div class="feed-title-row">
            <div class="feed-title-main">
              <i class="ph ph-compass-tool" style="color: var(--mw-gold); font-size: 1.6rem;"></i>
              <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0;">Practical Guides & Initiation Roadmaps</h2>
              <span class="feed-count-badge">8 Practical Guides</span>
            </div>
          </div>
        </div>

        <div class="triadic-grid" id="guidesFeedGrid" style="margin-top: 1.5rem;">
          <!-- Rendered dynamically -->
        </div>
      </div>

      <!-- 3. COMMUNITY FORUMS & SEEKER DISCUSSIONS FEED -->
      <div class="portal-sections-container" id="forumsFeedSection" style="border: none; margin-top: 3rem; margin-bottom: 5rem;">
        <div class="feed-header-wrapper" style="border: none;">
          <div class="feed-title-row">
            <div class="feed-title-main">
              <i class="ph ph-chats-circle" style="color: var(--mw-violet); font-size: 1.6rem;"></i>
              <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0;">Community Forums & Seeker Discussions</h2>
              <span class="feed-count-badge" style="background: rgba(168,85,247,0.15); color: var(--mw-violet); border-color: var(--mw-border-violet);">Live Discussions</span>
            </div>

            <button class="customize-interests-btn" id="openCreateForumTopicBtn" style="border: none; background: rgba(99, 102, 241, 0.2); color: #93c5fd;">
              <i class="ph ph-plus-circle"></i> <span>Start New Discussion</span>
            </button>
          </div>
        </div>

        <div class="forum-topics-grid" id="forumsFeedGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
          <!-- Rendered dynamically -->
        </div>
      </div>
`;

if (targetIndex !== -1 && !html.includes('id="guidesFeedSection"')) {
  html = html.substring(0, targetIndex) + newFeedsHTML + '\n\n  ' + html.substring(targetIndex);
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully added Guides and Forum Feed sections to index.html!');
}

// 3. Add renderGuidesFeed and renderForumsFeed in app.js
let appCode = fs.readFileSync('app.js', 'utf8');

const feedsRenderCode = `
  function renderGuidesFeed() {
    const grid = document.getElementById('guidesFeedGrid');
    if (!grid || !window.METAWIKI_DATA.guides) return;

    grid.innerHTML = window.METAWIKI_DATA.guides.map(g => \`
      <div class="triadic-card" data-wiki="\${g.wikiId}">
        <div>
          <div class="triadic-thumbnail-pic" style="overflow: hidden;">
            <img src="\${g.imagePath}" alt="\${g.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.style.display='none';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
          </div>
          <div class="triadic-card-title">\${g.title}</div>
          <div class="triadic-card-subtitle">\${g.subtitle}</div>
          <div class="triadic-card-summary">\${g.summary}</div>
        </div>
        <div class="triadic-card-footer">
          \${createHawkinsRainbowBar(g.hawkinsLevel)}
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="card-views-footer"><i class="ph ph-eye"></i> \${getArticleViews(g.wikiId)}</span>
            <span>Open Guide ➔</span>
          </div>
        </div>
      </div>
    \`).join('');

    grid.querySelectorAll('.triadic-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-wiki');
        if (target) loadArticle(target);
      });
    });
  }

  function renderForumsFeed() {
    const grid = document.getElementById('forumsFeedGrid');
    if (!grid || !window.METAWIKI_DATA.forumTopics) return;

    grid.innerHTML = window.METAWIKI_DATA.forumTopics.map(t => \`
      <div class="forum-topic-card" style="background: rgba(18, 18, 26, 0.85); backdrop-filter: blur(20px); border: 1px solid var(--mw-border); border-radius: 16px; padding: 1.4rem; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div class="forum-topic-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span class="forum-category-pill" style="font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 20px; background: rgba(168, 85, 247, 0.15); color: var(--mw-violet); border: 1px solid var(--mw-border-violet);">\${t.category}</span>
            <span style="font-size: 0.75rem; color: var(--mw-text-muted);">\${t.time}</span>
          </div>
          <h3 class="forum-topic-title" style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #fff; margin: 0 0 0.5rem 0;">\${t.title}</h3>
          <p class="forum-topic-body" style="font-size: 0.88rem; color: var(--mw-text-muted); line-height: 1.5; margin: 0 0 1.2rem 0;">\${t.body}</p>
        </div>
        <div class="forum-topic-footer" style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--mw-border); padding-top: 0.8rem; font-size: 0.82rem;">
          <div class="forum-topic-author" style="display: flex; align-items: center; gap: 0.6rem;">
            <img src="\${t.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid var(--mw-border-gold);" alt="Author">
            <span style="font-weight: 700; color: #e2e8f0;">\${t.author}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.8rem; color: var(--mw-gold); font-weight: 700;">
            <span><i class="ph ph-chat-circle-text"></i> \${t.replies} replies</span>
            <span>Join Discussion ➔</span>
          </div>
        </div>
      </div>
    \`).join('');

    const openCreateBtn = document.getElementById('openCreateForumTopicBtn');
    if (openCreateBtn) {
      openCreateBtn.addEventListener('click', () => {
        showForumsView();
      });
    }
  }
`;

if (!appCode.includes('function renderGuidesFeed()')) {
  appCode = appCode.replace('renderPortalFeed();', 'renderPortalFeed();\n    renderGuidesFeed();\n    renderForumsFeed();');
  appCode = appCode.replace('function renderPortalFeed(', feedsRenderCode + '\n  function renderPortalFeed(');
  fs.writeFileSync('app.js', appCode, 'utf-8');
  console.log('Successfully added renderGuidesFeed and renderForumsFeed to app.js!');
}
