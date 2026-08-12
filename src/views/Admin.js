/**
 * MetaWiki - Admin & Peer-Review Moderation Controller
 */

(function(window) {
  'use strict';

  function getSuggestedEdits() {
    try {
      return JSON.parse(localStorage.getItem('metawiki_suggested_edits')) || [];
    } catch(e) {
      return [];
    }
  }

  function clearSuggestedEdits() {
    try {
      localStorage.removeItem('metawiki_suggested_edits');
    } catch(e) {}
  }

  window.AdminView = {
    getSuggestedEdits,
    clearSuggestedEdits
  };

})(window);
