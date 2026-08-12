/**
 * MetaWiki - Data & UI Text Formatters Utility
 */

(function(window) {
  'use strict';

  function formatViews(num) {
    if (!num) return '185,000';
    if (typeof num === 'number') return num.toLocaleString();
    return num;
  }

  function formatTimestamp(ts) {
    if (!ts) return 'Recently';
    return ts;
  }

  function truncateText(str, maxLength = 140) {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength).trim() + '...';
  }

  window.Formatters = {
    formatViews,
    formatTimestamp,
    truncateText
  };

})(window);
