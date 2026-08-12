/**
 * MetaWiki - Community Forums View Controller Adapter
 * Proxies view initialization and thread reader modals directly to the unified ForumsEngine in js/forums.js.
 */

(function(window) {
  'use strict';

  function initForumView() {
    if (typeof window.initForums === 'function') {
      window.initForums();
    }
  }

  function openForumThreadModal(topicId) {
    if (window.ForumsEngine && typeof window.ForumsEngine.openForumThreadModal === 'function') {
      window.ForumsEngine.openForumThreadModal(topicId);
    }
  }

  function renderForums() {
    if (window.ForumsEngine && typeof window.ForumsEngine.renderForums === 'function') {
      window.ForumsEngine.renderForums();
    }
  }

  window.ForumsView = {
    openForumThreadModal,
    renderForums,
    initForumView
  };

  window.openForumThreadModal = openForumThreadModal;
  window.renderForums = renderForums;
  window.initForumEngine = initForumView;

})(window);
