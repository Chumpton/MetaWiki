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
    if (document.documentElement && document.documentElement.style && typeof document.documentElement.style.setProperty === 'function') {
      document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
    }
    if (document.body && document.body.style && typeof document.body.style.setProperty === 'function') {
      document.body.style.setProperty('scroll-behavior', 'auto', 'important');
    }

    if (typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    requestAnimationFrame(() => {
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });

    setTimeout(() => {
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      if (document.documentElement && document.documentElement.style && typeof document.documentElement.style.removeProperty === 'function') {
        document.documentElement.style.removeProperty('scroll-behavior');
      }
      if (document.body && document.body.style && typeof document.body.style.removeProperty === 'function') {
        document.body.style.removeProperty('scroll-behavior');
      }
    }, 80);
  }

  function switchView(targetView) {
    window.state = window.state || {};
    window.state.view = targetView;

    const portalView = document.getElementById('initiatoryPortalView');
    const forumsView = document.getElementById('forumsView') || document.getElementById('metaphysicalForumsView');
    const articleView = document.getElementById('articleReaderView');
    const spatialView = document.getElementById('spatialMapView');

    if (portalView) portalView.style.display = targetView === 'portal' ? 'block' : 'none';
    if (forumsView) forumsView.style.display = targetView === 'forums' ? 'block' : 'none';
    if (articleView) articleView.style.display = targetView === 'article' ? 'block' : 'none';
    if (spatialView) spatialView.style.display = targetView === 'spatial' ? 'block' : 'none';

    if (targetView === 'portal') {
      showGlobalNav(true);
      updateNavActiveState('navHomeBtn');
    } else if (targetView === 'forums') {
      showGlobalNav(true);
      updateNavActiveState('navForumsBtn');
      if (window.ForumsEngine && typeof window.ForumsEngine.renderForums === 'function') {
        window.ForumsEngine.renderForums();
      } else if (typeof window.renderForums === 'function') {
        window.renderForums();
      }
    } else if (targetView === 'article' || targetView === 'spatial') {
      showGlobalNav(true);
    }

    forceScrollTop();
  }

  function showPortalView() {
    switchView('portal');
  }

  function showForumsView() {
    switchView('forums');
  }

  function loadArticle(wikiId) {
    if (!wikiId) return;

    if (!window.METAWIKI_DATA || !window.METAWIKI_DATA.articles) {
      console.warn('Articles dataset not available');
      return;
    }

    const article = window.METAWIKI_DATA.articles.find(a => a.id === wikiId || a.slug === wikiId);
    if (!article) {
      console.warn('Article not found for ID:', wikiId);
      return;
    }

    window.state = window.state || {};
    window.state.currentArticleId = article.id;
    switchView('article');

    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = article.title;

    const titleEl = document.getElementById('articleMainTitle') || document.getElementById('articleTitle');
    if (titleEl) titleEl.textContent = article.title;

    const categoryEl = document.getElementById('articleCategoryPill');
    if (categoryEl) categoryEl.textContent = article.category || 'Metaphysics';

    const subheaderEl = document.getElementById('articleMainSubtitle') || document.getElementById('articleSubheader');
    if (subheaderEl) subheaderEl.textContent = article.subtitle || article.shortDescription || article.excerpt || '';

    const viewsCountEl = document.getElementById('articleViewsCount');
    if (viewsCountEl) viewsCountEl.textContent = article.views || '185,000';

    const hawkinsFill = document.getElementById('articleHawkinsFill');
    const hawkinsLabel = document.getElementById('articleHawkinsLabel');
    if (hawkinsFill && hawkinsLabel) {
      const loc = article.hawkinsNumeric || article.hawkinsScale || 500;
      const percent = Math.round(((Math.max(200, Math.min(1000, loc)) - 200) / 800) * 100);
      hawkinsFill.style.width = percent + '%';
      hawkinsLabel.textContent = `LoC ${loc} — ${article.hawkinsLabel || 'Reason'}`;
    }

    const heroImg = document.getElementById('articleHeroImg');
    if (heroImg) {
      heroImg.src = article.image || article.imagePath || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/The_Fool_Tarot_Card.pas/300px-The_Fool_Tarot_Card.jpg';
      heroImg.alt = article.title;
      heroImg.onerror = () => {
        heroImg.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
      };
    }

    const captionEl = document.getElementById('articleHeroCaption');
    if (captionEl) captionEl.textContent = article.imageCaption || article.title;

    function updateArticleContentAndTOC(art) {
      const bodyContainer = document.getElementById('articleMainText') || document.getElementById('articleBodyContainer');
      if (bodyContainer) {
        const interp = typeof window.getMetaphysicalInterpretationHtml === 'function' ? window.getMetaphysicalInterpretationHtml(art) : '';
        const rawContent = art.contentHTML || art.fullContentHtml || art.content || `<p>${art.shortDescription || art.excerpt || 'Article content loading...'}</p>`;
        bodyContainer.innerHTML = interp + rawContent;

        const tocList = document.getElementById('articleTOCList');
        if (tocList) {
          const headings = bodyContainer.querySelectorAll('h2, h3');
          if (headings.length > 0) {
            tocList.innerHTML = Array.from(headings).map((h, i) => {
              if (!h.id) h.id = 'heading-' + i;
              return `<li><a href="#${h.id}" class="toc-sidebar-link">${h.textContent}</a></li>`;
            }).join('');

            tocList.querySelectorAll('.toc-sidebar-link').forEach(link => {
              link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').replace('#', '');
                const targetEl = document.getElementById(targetId);
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
              });
            });
          }
        }
      }

      if (typeof window.renderInfobox === 'function' && art.infobox) {
        window.renderInfobox(art.infobox);
      }
    }

    updateArticleContentAndTOC(article);

    // Auto-fetch full live Wikipedia article data if content is a stub
    const isStub = !article.contentHTML || article.contentHTML.length < 2500 || (article.contentHTML.match(/<h[23][^>]*>/gi) || []).length <= 1;
    if (isStub && window.WikipediaImporter && typeof window.WikipediaImporter.importWikipediaArticle === 'function') {
      const fetchTitle = article.title || wikiId;
      window.WikipediaImporter.importWikipediaArticle(fetchTitle, article.category)
        .then(imported => {
          if (imported && imported.fullContentHtml) {
            article.contentHTML = imported.fullContentHtml;
            article.fullContentHtml = imported.fullContentHtml;
            article.isWikipediaSynced = true;
            if (imported.imagePath) {
              article.imagePath = imported.imagePath;
              if (article.infobox) {
                article.infobox.imagePath = imported.imagePath;
                article.infobox.fullImage = imported.imagePath;
              }
            }
            updateArticleContentAndTOC(article);
          }
        })
        .catch(() => {});
    }

    document.title = article.title + ' — MetaWiki';
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

  let delegationBound = false;

  function bindUniversalClickDelegation() {
    if (delegationBound || typeof document === 'undefined' || !document.addEventListener) return;
    delegationBound = true;

    document.addEventListener('click', (e) => {
      // 1. Navigation items
      const navItem = e.target.closest('.mw-nav-item, #mwGlobalNav a, [data-view]');
      if (navItem) {
        const id = navItem.id;
        const viewAttr = navItem.getAttribute('data-view');
        
        if (id === 'navHomeBtn' || id === 'breadcrumbHome' || id === 'articleHomeLink' || viewAttr === 'portal' || viewAttr === 'home') {
          e.preventDefault();
          showPortalView();
          updateNavActiveState('navHomeBtn');
          return;
        }
        
        if (id === 'navGuidesBtn' || id === 'articleGuidesLink' || viewAttr === 'guides') {
          e.preventDefault();
          showPortalView();
          updateNavActiveState('navGuidesBtn');
          setTimeout(() => {
            const guidesEl = document.getElementById('hawkinsGuideSection') || document.getElementById('guidesSection');
            if (guidesEl) guidesEl.scrollIntoView({ behavior: 'smooth' });
          }, 80);
          return;
        }
        
        if (id === 'navForumsBtn' || id === 'articleForumsLink' || viewAttr === 'forums') {
          e.preventDefault();
          showForumsView();
          updateNavActiveState('navForumsBtn');
          return;
        }

        if (id === 'heroRandomBtn' || id === 'articleRandomBtn' || viewAttr === 'random') {
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

      // 2. Reply button inside forum topic card
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

      // 3. Article Card or Wiki link (data-wiki)
      const card = e.target.closest('[data-wiki]');
      if (card) {
        if (card.classList.contains('forum-topic-card') || card.closest('#forumThreadModal')) return;
        const wikiId = card.getAttribute('data-wiki');
        if (wikiId) {
          e.preventDefault();
          loadArticle(wikiId);
        }
      }
    });
  }

  function bindHeroEvents() {
    const navHomeBtn = document.getElementById('navHomeBtn');
    const navGuidesBtn = document.getElementById('navGuidesBtn');
    const navForumsBtn = document.getElementById('navForumsBtn');
    const heroRandomBtn = document.getElementById('heroRandomBtn');
    const navDiscordBtn = document.getElementById('navDiscordBtn');

    const heroFoolCard = document.getElementById('heroFoolCard');
    const heroHermeticCard = document.getElementById('heroHermeticCard');
    const heroJungCard = document.getElementById('heroJungCard');
    const articleRandomBtn = document.getElementById('articleRandomBtn');
    const heroSpatialMapBtn = document.getElementById('heroSpatialMapBtn');
    const closeSpatialMapBtn = document.getElementById('closeSpatialMapBtn');
    const brandLogo = document.getElementById('mwBrandLogo');

    if (navHomeBtn) {
      navHomeBtn.onclick = (e) => {
        e.preventDefault();
        showPortalView();
        updateNavActiveState('navHomeBtn');
      };
    }

    if (navGuidesBtn) {
      navGuidesBtn.onclick = (e) => {
        e.preventDefault();
        showPortalView();
        updateNavActiveState('navGuidesBtn');
        setTimeout(() => {
          const guidesEl = document.getElementById('hawkinsGuideSection') || document.getElementById('guidesSection');
          if (guidesEl) guidesEl.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      };
    }

    if (navForumsBtn) {
      navForumsBtn.onclick = (e) => {
        e.preventDefault();
        showForumsView();
        updateNavActiveState('navForumsBtn');
      };
    }

    if (heroRandomBtn) {
      heroRandomBtn.onclick = (e) => {
        e.preventDefault();
        loadRandomArticle();
      };
    }

    if (navDiscordBtn) {
      navDiscordBtn.onclick = (e) => {
        e.preventDefault();
        const auth = window.METAWIKI_AUTH;
        const session = auth ? auth.getSession() : null;
        if (session) {
          if (typeof window.openMemberProfileModal === 'function') window.openMemberProfileModal();
        } else {
          if (window.METAWIKI_DISCORD_BACKEND && typeof window.METAWIKI_DISCORD_BACKEND.openModal === 'function') {
            window.METAWIKI_DISCORD_BACKEND.openModal();
          } else {
            const modal = document.getElementById('discordLoginModal');
            if (modal) modal.style.display = 'flex';
          }
        }
      };
    }

    if (heroFoolCard) heroFoolCard.onclick = (e) => { e.preventDefault(); loadArticle('fool-archetype'); };
    if (heroHermeticCard) heroHermeticCard.onclick = (e) => { e.preventDefault(); loadArticle('kybalion-seven-principles'); };
    if (heroJungCard) heroJungCard.onclick = (e) => { e.preventDefault(); loadArticle('jungian-archetypes-shadow'); };

    if (articleRandomBtn) articleRandomBtn.onclick = (e) => { e.preventDefault(); loadRandomArticle(); };

    if (heroSpatialMapBtn) heroSpatialMapBtn.onclick = (e) => { e.preventDefault(); showSpatialMapView(); };
    if (closeSpatialMapBtn) closeSpatialMapBtn.onclick = (e) => { e.preventDefault(); showPortalView(); };

    if (brandLogo) {
      brandLogo.onclick = (e) => {
        e.preventDefault();
        showPortalView();
      };
    }

    const articleHomeLink = document.getElementById('articleHomeLink');
    if (articleHomeLink) articleHomeLink.onclick = (e) => { e.preventDefault(); showPortalView(); };

    const articleGuidesLink = document.getElementById('articleGuidesLink');
    if (articleGuidesLink) articleGuidesLink.onclick = (e) => { e.preventDefault(); showPortalView(); };

    const articleForumsLink = document.getElementById('articleForumsLink');
    if (articleForumsLink) articleForumsLink.onclick = (e) => { e.preventDefault(); showForumsView(); };
  }

  function initRouterEvents() {
    bindUniversalClickDelegation();
    bindHeroEvents();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initRouterEvents);
    } else {
      initRouterEvents();
    }
  }

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
