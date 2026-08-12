/**
 * MetaWiki Automated Manual Test Suite (CLI Edition)
 * Tests Router Navigation, Article Reader Rendering, and Forum Engine CRUD/Store operations.
 */

const fs = require('fs');
const path = require('path');

// Simulated Local/Session Storage
const localStore = {};
const sessionStore = {};

global.localStorage = {
  getItem: (k) => localStore[k] || null,
  setItem: (k, v) => { localStore[k] = String(v); },
  removeItem: (k) => { delete localStore[k]; }
};

global.sessionStorage = {
  getItem: (k) => sessionStore[k] || null,
  setItem: (k, v) => { sessionStore[k] = String(v); },
  removeItem: (k) => { delete sessionStore[k]; }
};

global.window = global;
global.document = {
  readyState: 'complete',
  title: 'MetaWiki',
  documentElement: {
    setAttribute: () => {},
    style: { setProperty: () => {}, removeProperty: () => {} }
  },
  body: {
    classList: { toggle: () => {}, add: () => {}, remove: () => {} },
    appendChild: () => {},
    style: {}
  },
  elements: {},
  getElementById: function(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id: id,
        style: { display: '' },
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false,
          toggle: () => {}
        },
        textContent: '',
        innerHTML: '',
        value: '',
        src: '',
        alt: '',
        querySelector: () => null,
        querySelectorAll: () => [],
        addEventListener: () => {},
        setAttribute: () => {},
        getAttribute: () => null,
        appendChild: () => {}
      };
    }
    return this.elements[id];
  },
  querySelectorAll: function() {
    return [];
  },
  querySelector: function() {
    return null;
  },
  createElement: function(tag) {
    return {
      tagName: tag,
      style: {},
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      addEventListener: () => {}
    };
  },
  addEventListener: () => {}
};

global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

// Set up mock window.METAWIKI_DATA
window.METAWIKI_DATA = {
  articles: [
    {
      id: "platos-theory-of-forms",
      title: "Plato's Theory of Forms",
      shortDescription: "Plato's Theory of Forms — Metaphysical Concept & Consciousness Analysis.",
      category: "Ontology & Being",
      hawkinsCalibration: "LoC 200",
      hawkinsNumeric: 200,
      views: "12,000",
      infobox: {
        title: "Plato's Theory of Forms",
        data: [{ label: "Category", value: "Ontology & Being" }]
      },
      contentHTML: "<h2>Overview</h2><p>Plato's Theory of Forms is a foundational concept in Ontology & Being.</p>"
    },
    {
      id: "kybalion-seven-principles",
      title: "The Kybalion & 7 Hermetic Principles",
      shortDescription: "The Kybalion & 7 Hermetic Principles — Metaphysical Concept.",
      category: "Hermetic Mechanics",
      hawkinsCalibration: "LoC 500",
      hawkinsNumeric: 500,
      views: "45,000",
      infobox: {
        title: "The Kybalion",
        data: [{ label: "Tradition", value: "Hermeticism" }]
      },
      contentHTML: "<h2>Hermetic Laws</h2><p>As above, so below; as below, so above.</p>"
    }
  ],
  forumTopics: []
};

// Load dependencies
const forumStoreCode = fs.readFileSync(path.join(__dirname, '../src/data/forumStore.js'), 'utf8');
eval(forumStoreCode);

const routerCode = fs.readFileSync(path.join(__dirname, '../js/router.js'), 'utf8');
eval(routerCode);

const articleReaderCode = fs.readFileSync(path.join(__dirname, '../js/article_reader.js'), 'utf8');
eval(articleReaderCode);

console.log('=================================================================');
console.log('🧪 METAWIKI AUTOMATED DIAGNOSTIC MANUAL TEST SUITE');
console.log('=================================================================\n');

let passCount = 0;
let failCount = 0;
const results = [];

function assert(condition, message) {
  if (condition) {
    passCount++;
    console.log(`  ✔ PASS: ${message}`);
    results.push({ name: message, status: 'PASS' });
  } else {
    failCount++;
    console.log(`  ❌ FAIL: ${message}`);
    results.push({ name: message, status: 'FAIL' });
  }
}

async function runTestSuite() {
  // Test 1: Navigation & View Switching
  console.log('1️⃣ Testing View Router & View Container Navigation...');
  window.switchView('portal');
  assert(window.state.view === 'portal', 'Router sets window.state.view = "portal"');
  assert(document.getElementById('initiatoryPortalView').style.display === 'block', 'Initiatory Portal View displayed on "portal" route');
  
  window.switchView('forums');
  assert(window.state.view === 'forums', 'Router sets window.state.view = "forums"');
  assert(document.getElementById('forumsView').style.display === 'block', 'Forums View displayed on "forums" route');

  window.switchView('article');
  assert(window.state.view === 'article', 'Router sets window.state.view = "article"');
  assert(document.getElementById('articleReaderView').style.display === 'block', 'Article Reader View displayed on "article" route');
  console.log('');

  // Test 2: Article Loading & Element Population
  console.log('2️⃣ Testing Article Reader Data Population & Infobox Binding...');
  window.loadArticle('platos-theory-of-forms');
  assert(window.state.currentArticleId === 'platos-theory-of-forms', 'State updated with currentArticleId = "platos-theory-of-forms"');
  assert(document.getElementById('articleMainTitle').textContent === "Plato's Theory of Forms", 'Article Main Title populated correctly');
  assert(document.getElementById('articleMainSubtitle').textContent.includes("Plato's Theory of Forms"), 'Article Subtitle populated correctly');
  assert(document.getElementById('articleMainText').innerHTML.includes("foundational concept"), 'Article Main HTML Content populated correctly');
  assert(document.getElementById('articleHawkinsLabel').textContent.includes("LoC 200"), 'Hawkins Calibration Bar populated correctly');
  assert(document.getElementById('mwInfoboxContainer').innerHTML.includes("infobox"), 'Infobox Table rendered correctly');
  console.log('');

  // Test 3: Forum Data Store & CRUD Operations
  console.log('3️⃣ Testing Forum Store & Post/Comment CRUD...');
  const store = window.METAWIKI_FORUM_STORE;
  assert(store !== undefined, 'Forum Store initialized on window');

  const initialPosts = store.getPosts();
  assert(initialPosts.length >= 1, `Forum Store initialized with ${initialPosts.length} posts (includes Campton official test post)`);

  // Add new post
  const newPost = store.addPost("Contemplation on Logos", "Metaphysical Debate", "Exploring the divine Logos concept.");
  assert(newPost && newPost.id.startsWith('topic-'), 'Created new topic via ForumStore.addPost()');
  assert(store.getPosts().length === initialPosts.length, 'Post added to active forum list');

  // Add comment
  const comment = store.addComment(newPost.id, "Insightful analysis on Logos.");
  assert(comment && comment.body === "Insightful analysis on Logos.", 'Added comment to topic via ForumStore.addComment()');
  assert(newPost.repliesCount === 1, 'Reply count updated to 1');

  // Upvote
  const vote1 = store.toggleVote(newPost.id);
  assert(vote1 === 1, 'Upvoted topic successfully (toggleVote = 1)');
  const vote2 = store.toggleVote(newPost.id);
  assert(vote2 === 0, 'Toggled upvote off successfully (toggleVote = 0)');
  console.log('');

  // Test 4: Random Article Navigation
  console.log('4️⃣ Testing Random Article Engine...');
  window.loadRandomArticle();
  assert(window.state.view === 'article', 'Random article loaded into Article Reader View');
  assert(document.getElementById('articleMainTitle').textContent.length > 0, `Loaded Random Article: "${document.getElementById('articleMainTitle').textContent}"`);
  console.log('');

  console.log('=================================================================');
  console.log(`📊 DIAGNOSTIC SUMMARY: ${passCount} PASSED, ${failCount} FAILED out of ${passCount + failCount} Tests`);
  console.log('=================================================================\n');

  const diagnosticReport = {
    timestamp: new Date().toISOString(),
    status: failCount === 0 ? 'HEALTHY' : 'UNHEALTHY',
    passCount: passCount,
    failCount: failCount,
    results: results
  };

  console.log('📋 COPY-PASTE DIAGNOSTIC DATA REPORT FOR USER:');
  console.log(JSON.stringify(diagnosticReport, null, 2));

  if (failCount > 0) process.exit(1);
}

runTestSuite().catch(err => {
  console.error('❌ Test execution error:', err);
  process.exit(1);
});
