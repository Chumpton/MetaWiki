/**
 * MetaWiki - Primary Application Entry Point (main.js)
 * Initializes Router, Views, Components, Services, Utilities, and Global Event Delegation.
 */

function initMetaWikiApp() {
  'use strict';

  // 1. Global Application State Initialization
  if (!window.state) {
    window.state = {
      view: 'portal',
      currentArticleId: 'platos-theory-of-forms',
      isHoverPaused: false,
      theme: localStorage.getItem('metawiki_theme') || 'dark',
      forYouCategory: 'all',
      forYouVisibleCount: 15,
      guidesCategory: 'all',
      guidesVisibleCount: 15,
      forumCategory: 'all',
    };
  }

  // 1b. Pre-expand relative image paths to full HTTPS Wikimedia URLs
  if (window.METAWIKI_DATA && Array.isArray(window.METAWIKI_DATA.articles)) {
    window.METAWIKI_DATA.articles.forEach(article => {
      if (article.infobox) {
        if (article.infobox.imagePath && !article.infobox.imagePath.includes('://') && !article.infobox.imagePath.startsWith('data:')) {
          article.infobox.imagePath = window.getWikiImgUrl ? window.getWikiImgUrl(article.infobox.imagePath) : ('https://upload.wikimedia.org/wikipedia/commons/thumb/' + article.infobox.imagePath + '/330px-' + article.infobox.imagePath.split('/').pop());
        }
        if (article.infobox.fullImage && !article.infobox.fullImage.includes('://') && !article.infobox.fullImage.startsWith('data:')) {
          article.infobox.fullImage = window.getWikiImgUrl ? window.getWikiImgUrl(article.infobox.fullImage) : ('https://upload.wikimedia.org/wikipedia/commons/thumb/' + article.infobox.fullImage + '/640px-' + article.infobox.fullImage.split('/').pop());
        }
      }
    });
  }

  // 2. Set Active Theme Attribute
  if (document.documentElement) {
    document.documentElement.setAttribute('data-theme', window.state.theme);
  }

  // 2b. Initialize Dimension Viewer Controls & Preview Engine
  if (typeof window.initDimensionViewer === 'function') {
    window.initDimensionViewer();
  }

  // 3. Initialize Home View & Portal Feeds
  if (window.HomeView && typeof window.HomeView.initHomeView === 'function') {
    window.HomeView.initHomeView();
  } else if (typeof window.initPortalFeedEngine === 'function') {
    window.initPortalFeedEngine();
  }

  // 3b. Initialize Interactive Hawkins Guide Visual Spectrum
  if (typeof window.setupHawkinsGuideInteractive === 'function') {
    window.setupHawkinsGuideInteractive();
  }

  // 4. Initialize Forum Engine
  if (window.ForumsEngine && typeof window.ForumsEngine.initForums === 'function') {
    window.ForumsEngine.initForums();
  } else if (typeof window.initForums === 'function') {
    window.initForums();
  } else if (window.ForumsView && typeof window.ForumsView.initForumView === 'function') {
    window.ForumsView.initForumView();
  }

  // 5. Initialize Modals Component
  if (typeof window.setupSuggestEditsModal === 'function') {
    window.setupSuggestEditsModal();
  }

  // 6. Initialize Live Discord Chat Drawer Component
  if (window.Drawer && typeof window.Drawer.setupLiveCommunityChat === 'function') {
    window.Drawer.setupLiveCommunityChat();
  } else if (typeof window.setupLiveCommunityChat === 'function') {
    window.setupLiveCommunityChat();
  }

  // 7. Initialize Discord OAuth Authentication Service, Member Profile & Test Panel
  if (typeof window.setupDiscordAuth === 'function') {
    window.setupDiscordAuth();
  }
  if (typeof window.initMemberProfileModal === 'function') {
    window.initMemberProfileModal();
  }
  if (typeof window.initSiteDebugger === 'function') {
    window.initSiteDebugger();
  }
  if (window.WikipediaImporter && typeof window.WikipediaImporter.initWikipediaImportBotModal === 'function') {
    window.WikipediaImporter.initWikipediaImportBotModal();
  }

  // 8. Bind Hero Events & Universal Navigation Click Delegation
  if (typeof window.bindHeroEvents === 'function') {
    window.bindHeroEvents();
  }
  if (typeof window.bindUniversalClickDelegation === 'function') {
    window.bindUniversalClickDelegation();
  }

  // 9. Global Search Engine Setup
  if (typeof window.setupSearch === 'function') {
    window.setupSearch('semanticSearchInput', 'semanticSearchDropdown');
  }

  // 10. Hovercard Engine Setup
  if (typeof window.setupHovercardEngine === 'function') {
    window.setupHovercardEngine();
  }

  // 11. Pixel Stars Background Canvas Initialization
  if (typeof window.initPixelStarsCanvas === 'function') {
    window.initPixelStarsCanvas();
  }

  // 12. Interactive Letter Physics & Floating Title
  if (typeof window.initInteractiveTitleLetters === 'function') {
    window.initInteractiveTitleLetters();
  }

  // 13. Dynamic Theme Color Wheel Controller
  if (typeof window.setupThemeColorController === 'function') {
    window.setupThemeColorController();
  }

  console.log('✨ MetaWiki initialized successfully via main.js');
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMetaWikiApp);
  } else {
    initMetaWikiApp();
  }
}
