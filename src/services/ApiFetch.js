/**
 * MetaWiki - API Services & Wikipedia Image Fallback Fetcher
 */

(function(window) {
  'use strict';

  function fetchWikipediaThumbnail(title) {
    const cleanTitle = encodeURIComponent(title.trim());
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${cleanTitle}`;

    return fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        if (data && data.thumbnail && data.thumbnail.source) {
          return data.thumbnail.source;
        }
        return null;
      })
      .catch(err => {
        console.warn('Wikipedia thumbnail fetch warning:', err);
        return null;
      });
  }

  window.ApiFetch = {
    fetchWikipediaThumbnail
  };

})(window);
