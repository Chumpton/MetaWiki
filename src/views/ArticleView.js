/**
 * MetaWiki - Standalone Article Reader View Controller
 */

(function(window) {
  'use strict';

  function renderInfobox(data) {
    const container = document.getElementById('mwInfoboxContainer');
    if (!container || !data) {
      if (container) container.innerHTML = '';
      return;
    }

    let rows = data.data ? data.data.map(d => `
      <tr><th>${d.label}</th><td>${d.value}</td></tr>
    `).join('') : '';

    const infoboxImgUrl = window.getWikiImgUrl ? window.getWikiImgUrl(data.imagePath, 400) : (data.imagePath || '');
    let imgHeader = infoboxImgUrl ? `<div style="text-align: center; padding: 0.5rem;"><img src="${infoboxImgUrl}" alt="${data.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';" style="width: 100%; max-height: 180px; object-fit: cover; border-radius: 6px;"></div>` : '';

    container.innerHTML = `
      <table class="infobox">
        <tr><th colspan="2" class="infobox-title">${data.title}</th></tr>
        <tr><td colspan="2">${imgHeader}<div style="font-size: 0.75rem; color: var(--mw-text-muted); margin-top: 4px; text-align: center;">${data.imageCaption || ''}</div></td></tr>
        ${rows}
      </table>
    `;
  }

  window.ArticleView = {
    renderInfobox
  };

  window.renderInfobox = renderInfobox;

})(window);
