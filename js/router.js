/**
 * MetaWiki - View Router & Navigation Controller
 * Handles view switching, navigation active states, article loading, and instant top-scroll restoration.
 */

(function(window) {
  'use strict';

  function updateNavActiveState(activeId) {
    document.querySelectorAll('.mw-nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const activeEl = document.getElementById(activeId);
    if (activeEl) activeEl.classList.add('active');
  }

  function showGlobalNav(visible) {
    const nav = document.getElementById('mwGlobalNav');
    if (nav) nav.style.display = visible ? '' : 'none';
    document.body.classList.toggle('article-view-active', !visible);
  }

  function forceScrollTop() {
    if (document.documentElement && document.documentElement.style) {
      document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
    }
    if (document.body && document.body.style) {
      document.body.style.setProperty('scroll-behavior', 'auto', 'important');
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });

    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      if (document.documentElement && document.documentElement.style) document.documentElement.style.removeProperty('scroll-behavior');
      if (document.body && document.body.style) document.body.style.removeProperty('scroll-behavior');
    }, 80);
  }

  function switchView(targetView) {
    if (!window.state) window.state = {};
    window.state.view = targetView;

    // Reset scroll BEFORE visibility toggle to prevent scroll displacement
    forceScrollTop();

    const portalView = document.getElementById('initiatoryPortalView');
    const articleView = document.getElementById('articleReaderView');
    const forumsView = document.getElementById('forumsView');

    if (portalView) portalView.style.display = targetView === 'portal' ? 'block' : 'none';
    if (forumsView) forumsView.style.display = targetView === 'forums' ? 'block' : 'none';
    if (articleView) articleView.style.display = targetView === 'article' ? 'block' : 'none';

    if (document.body && document.body.classList) {
      document.body.classList.toggle('article-view-active', targetView === 'article');
    }

    const globalNav = document.getElementById('mwGlobalNav');
    if (globalNav) {
      globalNav.style.display = 'flex';
      globalNav.classList.remove('nav-hidden');
    }

    if (targetView === 'portal') {
      updateNavActiveState('navHomeBtn');
      document.title = 'MetaWiki — The Free Metaphysical Encyclopedia';
    } else if (targetView === 'forums') {
      updateNavActiveState('navForumsBtn');
      if (typeof window.renderForums === 'function') window.renderForums();
      document.title = 'Community Forums — MetaWiki';
    } else if (targetView === 'article') {
      const currentNav = document.querySelector('.mw-nav-item.active');
      if (currentNav) currentNav.classList.remove('active');
    }

    // Force top scroll after DOM layout update
    forceScrollTop();
  }

  function showPortalView() {
    switchView('portal');
  }

  function showForumsView() {
    switchView('forums');
  }

  function getArticleViewsFormatted(articleId) {
    if (!articleId) return '0';
    try {
      const storedMap = JSON.parse(localStorage.getItem('metawiki_article_views_map') || '{}');
      let currentNum = storedMap[articleId];
      if (currentNum === undefined) {
        currentNum = 0;
      }
      return currentNum.toLocaleString();
    } catch (e) {
      return '0';
    }
  }

  function incrementAndGetArticleViews(articleId) {
    if (!articleId) return '0';
    try {
      const storedMap = JSON.parse(localStorage.getItem('metawiki_article_views_map') || '{}');
      let currentNum = storedMap[articleId] || 0;
      currentNum += 1;
      storedMap[articleId] = currentNum;
      localStorage.setItem('metawiki_article_views_map', JSON.stringify(storedMap));

      // Asynchronously record authentic click view to backend if connected
      if (window.METAWIKI_AUTH && window.METAWIKI_AUTH.supabaseClient) {
        try {
          window.METAWIKI_AUTH.supabaseClient
            .rpc('increment_article_views', { article_slug: articleId })
            .catch(() => {});
        } catch (err) {}
      }

      return currentNum.toLocaleString();
    } catch (e) {
      return '0';
    }
  }

  window.getArticleViewsFormatted = getArticleViewsFormatted;
  window.incrementAndGetArticleViews = incrementAndGetArticleViews;

  function loadArticle(articleId) {
    if (!window.METAWIKI_DATA || !window.METAWIKI_DATA.articles || window.METAWIKI_DATA.articles.length === 0) return;

    let article = null;
    if (articleId && typeof articleId === 'string') {
      const clean = articleId.toLowerCase().trim();
      article = window.METAWIKI_DATA.articles.find(a => a.id.toLowerCase() === clean);
      if (!article) {
        article = window.METAWIKI_DATA.articles.find(a => a.title.toLowerCase() === clean);
      }
      if (!article) {
        const cleanKey = clean.split('-facet')[0].split('-')[0];
        if (cleanKey.length >= 3) {
          article = window.METAWIKI_DATA.articles.find(a => a.id.toLowerCase().includes(cleanKey) || a.title.toLowerCase().includes(cleanKey));
        }
      }
    }

    if (!article) {
      article = window.METAWIKI_DATA.articles[0];
    }
    if (!article) return;

    // Increment article view count on load
    const newViewsStr = incrementAndGetArticleViews(article.id, article.views);

    if (window.state) window.state.currentArticleId = article.id;

    switchView('article');

    const titleEl = document.getElementById('articleMainTitle');
    if (titleEl) titleEl.textContent = article.title;

    const subEl = document.getElementById('articleMainSubtitle');
    if (subEl) subEl.textContent = article.shortDescription;

    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = article.title;

    if (typeof window.renderInfobox === 'function') {
      window.renderInfobox(article.infobox);
    }

    const mainText = document.getElementById('articleMainText');
    if (mainText) {
      const interp = article.metaphysicalInterpretation || {};
      const hawkinsMeta = window.HawkinsCalculator
        ? window.HawkinsCalculator.getHawkinsLevelMetadata(article.hawkinsCalibration || 500)
        : null;
      const locLabel = article.hawkinsCalibration || 'LoC 500';

      let html = '';

      // Lead paragraph
      html += '<p class="mw-wiki-lead">';
      html += '<strong>' + article.title + '</strong> is a concept in <em>' + (article.category || 'metaphysics') + '</em> ';
      html += 'that has shaped metaphysical inquiry and comparative philosophy across traditions. ';
      html += (interp.synthesis || (article.title + ' articulates fundamental metaphysical mechanics, bridging esoteric wisdom, archetypal philosophy, and transpersonal psychology.'));
      html += ' It is calibrated at <strong>' + locLabel + '</strong> on Dr.\u00a0David\u00a0R.\u00a0Hawkins\' Map of Consciousness.<sup>[1]</sup>';
      html += '</p>';

      // Section: Metaphysical Interpretation
      html += '<h2 id="sec-metaphysical" class="mw-wiki-section-heading">Metaphysical &amp; Ontological Interpretation</h2>';
      html += '<hr class="mw-wiki-hr">';
      html += '<blockquote class="mw-wiki-blockquote">';
      html += (interp.maxim || '\u201cIn ' + article.title + ', form and essence converge to express the non-dual truth of universal consciousness.\u201d');
      html += '</blockquote>';
      html += '<p>' + (interp.title || ('Metaphysical &amp; Ontological Interpretation of ' + article.title));
      html += ' explores the deeper transpersonal significance of this concept within the framework of perennial philosophy. ';
      html += (interp.hawkinsContext || ('Calibrated at ' + locLabel + ' on Dr. David R. Hawkins\' Map of Consciousness.')) + '</p>';
      html += '<p>Through a transpersonal hermeneutic lens, ' + article.title + ' reveals patterns that recur across ';
      html += 'Hermetic philosophy, Neoplatonism, Vedantic non-dualism, and Jungian depth psychology. Each tradition ';
      html += 'approaches the same underlying ontological structure from a different vantage point, yet converges ';
      html += 'on the recognition that manifest reality participates in, and is sustained by, a non-dual ground of Being.</p>';

      // Section: Hawkins Calibration
      html += '<h2 id="sec-hawkins" class="mw-wiki-section-heading">Hawkins Map of Consciousness Calibration</h2>';
      html += '<hr class="mw-wiki-hr">';

      if (hawkinsMeta) {
        html += '<table class="mw-wiki-table">';
        html += '<caption>Calibrated Level of Consciousness \u2014 Dr. David R. Hawkins, M.D., Ph.D.</caption>';
        html += '<tbody>';
        html += '<tr><th>Level of Consciousness</th><td><strong>LoC ' + hawkinsMeta.locNum + '</strong> \u2014 ' + hawkinsMeta.name + '</td></tr>';
        html += '<tr><th>Emotional Correlate</th><td>' + hawkinsMeta.emotion + '</td></tr>';
        html += '<tr><th>Life-View Perception</th><td>' + hawkinsMeta.view + '</td></tr>';
        html += '<tr><th>Spiritual Process</th><td>' + hawkinsMeta.process + '</td></tr>';
        html += '<tr><th>Energy Field Domain</th><td>' + hawkinsMeta.levelGroup + '</td></tr>';
        html += '</tbody></table>';
      }

      html += '<p>According to the calibration methodology presented in <em>Power vs. Force</em> (1995), ';
      html += article.title + ' registers at <strong>' + locLabel + '</strong>. This places the concept within the ';
      html += (hawkinsMeta ? hawkinsMeta.levelGroup : 'Power') + ' domain of the Map of Consciousness, indicating ';
      if (hawkinsMeta && hawkinsMeta.locNum >= 200) {
        html += 'a constructive, life-affirming attractor field that supports spiritual development and expanded awareness.</p>';
      } else {
        html += 'an attractor field associated with contracted states of awareness. Understanding this calibration contextualizes the concept\'s role within the broader spectrum of consciousness evolution.</p>';
      }

      // Section: Overview
      html += '<h2 id="sec-overview" class="mw-wiki-section-heading">Overview &amp; Context</h2>';
      html += '<hr class="mw-wiki-hr">';
      html += '<p><strong>' + article.title + '</strong> is a foundational concept in <em>' + (article.category || 'Metaphysics') + '</em> ';
      html += 'that has shaped metaphysical inquiry and comparative philosophy. Its exploration spans ';
      html += 'multiple traditions including Western esotericism, Eastern contemplative paths, and modern transpersonal psychology.</p>';
      html += '<p>Within the MetaWiki ontological framework, this concept intersects with themes of consciousness ';
      html += 'evolution, archetypal symbolism, and the perennial philosophy\'s assertion that a single ';
      html += 'transcendent Reality underlies the multiplicity of phenomenal experience.</p>';

      // Section: Archetypal
      html += '<h2 id="sec-archetypal" class="mw-wiki-section-heading">Archetypal &amp; Cross-Traditional Significance</h2>';
      html += '<hr class="mw-wiki-hr">';
      html += '<p>The archetypal resonance of ' + article.title + ' can be traced across several major philosophical and spiritual traditions:</p>';
      html += '<ul class="mw-wiki-list">';
      html += '<li><strong>Neoplatonism</strong> \u2014 Corresponding to the emanation of the One through Nous and Psyche into material manifestation.</li>';
      html += '<li><strong>Vedanta</strong> \u2014 Relating to the distinction between <em>Brahman</em> (absolute reality) and <em>Maya</em> (phenomenal appearance).</li>';
      html += '<li><strong>Hermeticism</strong> \u2014 Reflecting the axiom \u201cAs above, so below,\u201d where macrocosmic principles mirror microcosmic experience.</li>';
      html += '<li><strong>Jungian Psychology</strong> \u2014 Mapping onto the process of individuation, where unconscious archetypal content is integrated into conscious awareness.</li>';
      html += '<li><strong>Buddhist Philosophy</strong> \u2014 Paralleling the teaching of <em>\u015a\u016bnyat\u0101</em> (emptiness) as the ground from which dependent origination arises.</li>';
      html += '</ul>';

      // Section: Phenomenological
      html += '<h2 id="sec-phenomenological" class="mw-wiki-section-heading">Phenomenological Analysis</h2>';
      html += '<hr class="mw-wiki-hr">';
      html += '<p>From a phenomenological standpoint, ' + article.title + ' invites a shift in the mode of intentional ';
      html += 'consciousness from <em>natural attitude</em> (naive realism) toward <em>transcendental reduction</em> ';
      html += '(epoch\u00e9). This shift reveals the constitutive role of consciousness in structuring the field of ';
      html += 'experience, aligning with Husserl\'s insight that all objectivity is constituted through subjective acts.</p>';
      html += '<p>The contemplative traditions associated with this concept prescribe specific practices \u2014 meditation, ';
      html += 'self-inquiry, devotional absorption \u2014 as means of effecting this phenomenological shift. These ';
      html += 'practices systematically deconstruct habitual cognitive frameworks, allowing awareness to recognize ';
      html += 'its own nature as the prior condition of all experience.</p>';

      // Section: See Also
      html += '<h2 id="sec-seealso" class="mw-wiki-section-heading">See also</h2>';
      html += '<hr class="mw-wiki-hr">';
      html += '<ul class="mw-wiki-list mw-wiki-seealso">';
      html += '<li>Map of Consciousness (Hawkins)</li>';
      html += '<li>Perennial Philosophy</li>';
      html += '<li>Neoplatonism</li>';
      html += '<li>Transpersonal Psychology</li>';
      html += '<li>Archetypal Psychology</li>';
      html += '</ul>';

      // Section: References
      html += '<h2 id="sec-references" class="mw-wiki-section-heading">References</h2>';
      html += '<hr class="mw-wiki-hr">';
      html += '<ol class="mw-wiki-references">';
      html += '<li id="ref1">Hawkins, David R. <em>Power vs. Force: The Hidden Determinants of Human Behavior.</em> Hay House, 1995.</li>';
      html += '<li>Hawkins, David R. <em>The Eye of the I: From Which Nothing is Hidden.</em> Veritas Publishing, 2001.</li>';
      html += '<li>Huxley, Aldous. <em>The Perennial Philosophy.</em> Harper &amp; Brothers, 1945.</li>';
      html += '<li>Jung, C.G. <em>The Archetypes and the Collective Unconscious.</em> Princeton University Press, 1969.</li>';
      html += '<li>Wilber, Ken. <em>A Brief History of Everything.</em> Shambhala Publications, 1996.</li>';
      html += '</ol>';

      // Suggest Edit
      html += '<div style="margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.15); text-align: center;">';
      html += '<button id="bottomSuggestEditBtn" class="suggest-edit-bubble-btn">';
      html += '<i class="ph ph-pencil-simple-line" style="font-size: 1.2rem;"></i> <span>Suggest an Edit</span>';
      html += '</button></div>';

      mainText.innerHTML = html;

      var bottomBtn = document.getElementById('bottomSuggestEditBtn');
      if (bottomBtn) {
        bottomBtn.addEventListener('click', function() {
          var modal = document.getElementById('suggestEditModal');
          if (modal) {
            modal.style.display = 'flex';
            var topicInput = modal.querySelector('input[type="text"]');
            if (topicInput) topicInput.value = article.title;
          }
        });
      }
    }

    // 5. Populate Dynamic Table of Contents (TOC) Sidebar
    var tocList = document.getElementById('articleTOCList');
    if (tocList && mainText) {
      var headings = mainText.querySelectorAll('h2.mw-wiki-section-heading');
      tocList.innerHTML = Array.from(headings).map(function(h, i) {
        var hId = h.id || 'heading-' + i;
        h.id = hId;
        return '<li class="toc-sidebar-item" data-target="' + hId + '">' + h.textContent.trim() + '</li>';
      }).join('');

      tocList.querySelectorAll('.toc-sidebar-item').forEach(function(item) {
        item.addEventListener('click', function() {
          var targetId = item.getAttribute('data-target');
          var targetEl = document.getElementById(targetId);
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }

    document.title = article.title + ' \u2014 MetaWiki';
    forceScrollTop();
  }

  function loadRandomArticle() {
    if (!window.METAWIKI_DATA || !window.METAWIKI_DATA.articles || window.METAWIKI_DATA.articles.length === 0) return;
    const randomIndex = Math.floor(Math.random() * window.METAWIKI_DATA.articles.length);
    const randomArticle = window.METAWIKI_DATA.articles[randomIndex];
    if (randomArticle) {
      loadArticle(randomArticle.id);
    }
  }

  function showSpatialMapView() {
    loadArticle('spatial-map');
  }

  function bindUniversalClickDelegation() {
    if (typeof document === 'undefined' || !document.addEventListener) return;
    document.addEventListener('click', (e) => {
      // 1. Global Navigation Bar Items
      const navItem = e.target.closest('.mw-nav-item, #mwGlobalNav a, [data-view]');
      if (navItem) {
        const id = navItem.id;
        const viewAttr = navItem.getAttribute('data-view');
        
        if (id === 'navHomeBtn' || viewAttr === 'portal' || viewAttr === 'home') {
          e.preventDefault();
          showPortalView();
          updateNavActiveState('navHomeBtn');
          return;
        }
        
        if (id === 'navGuidesBtn' || viewAttr === 'guides') {
          e.preventDefault();
          showPortalView();
          updateNavActiveState('navGuidesBtn');
          setTimeout(() => {
            const guidesEl = document.getElementById('hawkinsGuideSection') || document.getElementById('guidesSection');
            if (guidesEl) guidesEl.scrollIntoView({ behavior: 'smooth' });
          }, 80);
          return;
        }
        
        if (id === 'navForumsBtn' || viewAttr === 'forums') {
          e.preventDefault();
          showForumsView();
          updateNavActiveState('navForumsBtn');
          return;
        }
        
        if (id === 'heroRandomBtn' || viewAttr === 'random') {
          e.preventDefault();
          loadRandomArticle();
          return;
        }

        if (id === 'navDiscordBtn') {
          e.preventDefault();
          const auth = window.METAWIKI_AUTH;
          const session = auth ? auth.getSession() : null;
          if (session) {
            if (typeof window.openMemberProfileModal === 'function') window.openMemberProfileModal();
          } else {
            if (window.METAWIKI_DISCORD_BACKEND) window.METAWIKI_DISCORD_BACKEND.openModal();
          }
          return;
        }
      }

      // 2. Reply button click inside forum topic card
      const replyBtn = e.target.closest('[data-action="reply"]');
      if (replyBtn) {
        e.preventDefault();
        const forumCard = replyBtn.closest('.forum-topic-card');
        if (forumCard) {
          const topicId = forumCard.getAttribute('data-id');
          if (topicId && typeof window.openForumThreadModal === 'function') {
            window.openForumThreadModal(topicId);
          }
        }
        return;
      }

      // 3. Article Card or Thumbnail Click
      const card = e.target.closest('[data-wiki]');
      if (card) {
        if (card.classList.contains('forum-topic-card')) return;
        const wikiId = card.getAttribute('data-wiki');
        if (wikiId) {
          e.preventDefault();
          loadArticle(wikiId);
        }
      }
    });
  }

  function bindHeroEvents() {
    const heroFoolCard = document.getElementById('heroFoolCard');
    const heroHermeticCard = document.getElementById('heroHermeticCard');
    const heroJungCard = document.getElementById('heroJungCard');
    const heroRandomBtn = document.getElementById('heroRandomBtn');
    const articleRandomBtn = document.getElementById('articleRandomBtn');
    const heroSpatialMapBtn = document.getElementById('heroSpatialMapBtn');
    const closeSpatialMapBtn = document.getElementById('closeSpatialMapBtn');

    if (heroFoolCard) heroFoolCard.addEventListener('click', () => loadArticle('fool-archetype'));
    if (heroHermeticCard) heroHermeticCard.addEventListener('click', () => loadArticle('kybalion-seven-principles'));
    if (heroJungCard) heroJungCard.addEventListener('click', () => loadArticle('jungian-archetypes-shadow'));

    if (heroRandomBtn) heroRandomBtn.addEventListener('click', loadRandomArticle);
    if (articleRandomBtn) articleRandomBtn.addEventListener('click', loadRandomArticle);

    if (heroSpatialMapBtn) heroSpatialMapBtn.addEventListener('click', showSpatialMapView);
    if (closeSpatialMapBtn) closeSpatialMapBtn.addEventListener('click', showPortalView);

    const articleHomeLink = document.getElementById('articleHomeLink');
    if (articleHomeLink) articleHomeLink.addEventListener('click', (e) => { e.preventDefault(); showPortalView(); });

    const articleGuidesLink = document.getElementById('articleGuidesLink');
    if (articleGuidesLink) articleGuidesLink.addEventListener('click', (e) => { e.preventDefault(); showPortalView(); });

    const articleForumsLink = document.getElementById('articleForumsLink');
    if (articleForumsLink) articleForumsLink.addEventListener('click', (e) => { e.preventDefault(); showForumsView(); });

    if (heroFoolCard) heroFoolCard.addEventListener('click', () => loadArticle('fool-archetype'));
    if (heroHermeticCard) heroHermeticCard.addEventListener('click', () => loadArticle('kybalion-seven-principles'));
    if (heroJungCard) heroJungCard.addEventListener('click', () => loadArticle('jungian-archetypes-shadow'));

    if (heroRandomBtn) heroRandomBtn.addEventListener('click', loadRandomArticle);
    if (articleRandomBtn) articleRandomBtn.addEventListener('click', loadRandomArticle);

    if (heroSpatialMapBtn) heroSpatialMapBtn.addEventListener('click', showSpatialMapView);
    if (closeSpatialMapBtn) closeSpatialMapBtn.addEventListener('click', showPortalView);

    const brandLogo = document.getElementById('mwBrandLogo');
    if (brandLogo) {
      brandLogo.addEventListener('click', (e) => {
        e.preventDefault();
        showPortalView();
      });
    }

    const navHomeBtn = document.getElementById('navHomeBtn');
    if (navHomeBtn) {
      navHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPortalView();
        updateNavActiveState('navHomeBtn');
      });
    }

    const navGuidesBtn = document.getElementById('navGuidesBtn');
    if (navGuidesBtn) {
      navGuidesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPortalView();
        updateNavActiveState('navGuidesBtn');
        setTimeout(() => {
          const guidesEl = document.getElementById('hawkinsGuideSection') || document.getElementById('guidesSection');
          if (guidesEl) guidesEl.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
    }

    const navForumsBtn = document.getElementById('navForumsBtn');
    if (navForumsBtn) {
      navForumsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showForumsView();
        updateNavActiveState('navForumsBtn');
      });
    }

    const breadcrumbHome = document.getElementById('breadcrumbHome');
    if (breadcrumbHome) {
      breadcrumbHome.addEventListener('click', (e) => {
        e.preventDefault();
        showPortalView();
      });
    }
  }

  // Automatically bind universal click delegation on load
  bindUniversalClickDelegation();

  // Export Router API
  window.updateNavActiveState = updateNavActiveState;
  window.showGlobalNav = showGlobalNav;
  window.forceScrollTop = forceScrollTop;
  window.switchView = switchView;
  window.showPortalView = showPortalView;
  window.showForumsView = showForumsView;
  window.loadArticle = loadArticle;
  window.loadRandomArticle = loadRandomArticle;
  window.showSpatialMapView = showSpatialMapView;
  window.bindUniversalClickDelegation = bindUniversalClickDelegation;
  window.bindHeroEvents = bindHeroEvents;

})(window);
