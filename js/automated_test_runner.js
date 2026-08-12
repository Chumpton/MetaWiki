/**
 * MetaWiki Automated Diagnostic Test Runner (In-Browser Edition)
 * Allows users to run real-time automated diagnostics in the browser.
 * Generates a formatted JSON data report that the user can copy and paste back to AI assistant.
 */

(function(window) {
  'use strict';

  async function runMetaWikiDiagnostics() {
    console.log('%c=================================================================', 'color: #a855f7; font-weight: bold;');
    console.log('%c🧪 METAWIKI IN-BROWSER AUTOMATED DIAGNOSTIC TEST SUITE', 'color: #fbbf24; font-weight: bold; font-size: 1.1rem;');
    console.log('%c=================================================================\n', 'color: #a855f7; font-weight: bold;');

    let passCount = 0;
    let failCount = 0;
    const results = [];

    function assert(condition, message) {
      if (condition) {
        passCount++;
        console.log(`%c  ✔ PASS: %c${message}`, 'color: #4ade80; font-weight: bold;', 'color: #e2e8f0;');
        results.push({ name: message, status: 'PASS' });
      } else {
        failCount++;
        console.log(`%c  ❌ FAIL: %c${message}`, 'color: #ef4444; font-weight: bold;', 'color: #f87171;');
        results.push({ name: message, status: 'FAIL' });
      }
    }

    // Preserve initial view state
    const initialView = (window.state && window.state.view) || 'portal';

    try {
      // 1. Navigation Test
      console.log('%c1️⃣ Testing Navigation Router & View Container Visibility...', 'color: #38bdf8; font-weight: bold;');
      if (typeof window.switchView === 'function') {
        window.switchView('portal');
        assert(window.state && window.state.view === 'portal', 'Router set state.view = "portal"');
        const portalEl = document.getElementById('initiatoryPortalView');
        assert(portalEl && portalEl.style.display !== 'none', 'Portal view container visible');

        window.switchView('forums');
        assert(window.state && window.state.view === 'forums', 'Router set state.view = "forums"');
        const forumsEl = document.getElementById('forumsView');
        assert(forumsEl && forumsEl.style.display !== 'none', 'Forums view container visible');

        window.switchView('article');
        assert(window.state && window.state.view === 'article', 'Router set state.view = "article"');
        const articleEl = document.getElementById('articleReaderView');
        assert(articleEl && articleEl.style.display !== 'none', 'Article reader view container visible');
      } else {
        assert(false, 'window.switchView function is defined');
      }
      console.log('\n');

      // 2. Article Loading Test
      console.log('%c2️⃣ Testing Article Reader Engine & Infobox Population...', 'color: #38bdf8; font-weight: bold;');
      if (typeof window.loadArticle === 'function') {
        window.loadArticle('platos-theory-of-forms');
        assert(window.state && window.state.currentArticleId === 'platos-theory-of-forms', 'Article ID set to "platos-theory-of-forms"');
        
        const titleEl = document.getElementById('articleMainTitle') || document.getElementById('articleTitle');
        assert(titleEl && titleEl.textContent === "Plato's Theory of Forms", `Article Title rendered correctly: "${titleEl ? titleEl.textContent : ''}"`);

        const bodyEl = document.getElementById('articleMainText') || document.getElementById('articleBodyContainer');
        assert(bodyEl && bodyEl.innerHTML.length > 50, 'Article Body HTML content populated');

        const infoboxEl = document.getElementById('mwInfoboxContainer');
        assert(infoboxEl && infoboxEl.innerHTML.includes('infobox'), 'Infobox container table rendered');
      } else {
        assert(false, 'window.loadArticle function is defined');
      }
      console.log('\n');

      // 3. Forum Engine Test
      console.log('%c3️⃣ Testing Forum Engine & Data Store CRUD Operations...', 'color: #38bdf8; font-weight: bold;');
      const store = window.METAWIKI_FORUM_STORE;
      assert(store !== undefined, 'METAWIKI_FORUM_STORE is active on window');

      if (store) {
        const posts = store.getPosts();
        assert(Array.isArray(posts) && posts.length > 0, `Forum posts array active (${posts ? posts.length : 0} topics)`);

        const testTopic = store.addPost("Automated In-Browser Test Topic", "Metaphysical Debate", "Testing topic creation via automated diagnostic suite.");
        assert(testTopic && testTopic.id, 'Created new discussion topic via ForumStore');

        const reply = store.addComment(testTopic.id, "Testing automated reply submission.");
        assert(reply && reply.body.includes('automated reply'), 'Submitted comment to topic via ForumStore');

        const userVote = store.toggleVote(testTopic.id);
        assert(userVote === 1, 'Upvoted topic successfully');

        if (window.ForumsEngine && typeof window.ForumsEngine.renderForums === 'function') {
          window.ForumsEngine.renderForums();
          assert(true, 'ForumsEngine.renderForums executed without error');
        }
      }
      console.log('\n');

      // Restore initial view
      if (typeof window.switchView === 'function') {
        window.switchView(initialView);
      }

    } catch (err) {
      assert(false, `Unexpected exception caught: ${err.message}`);
    }

    const report = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      status: failCount === 0 ? 'HEALTHY' : 'UNHEALTHY',
      passCount: passCount,
      failCount: failCount,
      results: results
    };

    console.log('%c=================================================================', 'color: #a855f7; font-weight: bold;');
    console.log(`%c📊 DIAGNOSTIC SUMMARY: ${passCount} PASSED, ${failCount} FAILED out of ${passCount + failCount} Tests`, failCount === 0 ? 'color: #4ade80; font-weight: bold; font-size: 1.1rem;' : 'color: #ef4444; font-weight: bold; font-size: 1.1rem;');
    console.log('%c=================================================================\n', 'color: #a855f7; font-weight: bold;');

    console.log('%c📋 COPY-PASTE DIAGNOSTIC DATA REPORT FOR AI ASSISTANT:', 'color: #fbbf24; font-weight: bold;');
    console.log(JSON.stringify(report, null, 2));

    return report;
  }

  window.runMetaWikiDiagnostics = runMetaWikiDiagnostics;

  console.log('⚡ MetaWiki In-Browser Diagnostic Suite Loaded! Run window.runMetaWikiDiagnostics() in browser console to execute test suite.');

})(window);
