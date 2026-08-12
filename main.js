/**
 * MetaWiki - Primary Application Entry Point (main.js)
 * Initializes Router, Views, Components, Services, Utilities, and Global Event Delegation.
 */

document.addEventListener('DOMContentLoaded', () => {
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
      forumVisibleCount: 15
    };
  }

  // 2. Set Active Theme Attribute
  document.documentElement.setAttribute('data-theme', window.state.theme);

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

  // 4. Initialize Forum View Engine
  if (window.ForumsView && typeof window.ForumsView.initForumView === 'function') {
    window.ForumsView.initForumView();
  } else if (typeof window.initForumEngine === 'function') {
    window.initForumEngine();
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
});
