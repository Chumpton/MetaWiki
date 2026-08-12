/**
 * MetaWiki - Article Reader Component
 * Renders metadata infoboxes, dynamically populates Table of Contents sidebars, and manages edit proposals.
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

    const expandedImg = window.getWikiImgUrl ? window.getWikiImgUrl(data.imagePath, 400) : (data.imagePath || '');
    let imgHeader = expandedImg ? `<div style="text-align: center; padding: 0.5rem;"><img src="${expandedImg}" alt="${data.title || 'Infobox Picture'}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png';" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: 6px;"></div>` : '';

    container.innerHTML = `
      <table class="infobox">
        <tr><th colspan="2" class="infobox-title">${data.title}</th></tr>
        <tr><td colspan="2">${imgHeader}<div style="font-size: 0.75rem; color: var(--mw-text-muted); margin-top: 4px; text-align: center;">${data.imageCaption || ''}</div></td></tr>
        ${rows}
      </table>
    `;
  }

  function setupSuggestEditsModal() {
    const modal = document.getElementById('suggestEditModal');
    const openHeaderBtn = document.getElementById('suggestEditHeaderBtn');
    const openTopbarLink = document.getElementById('suggestEditTopbarLink');
    const closeBtn = document.getElementById('closeSuggestEditBtn');
    const cancelBtn = document.getElementById('cancelSuggestEditBtn');
    const submitBtn = document.getElementById('submitSuggestEditBtn');
    const summaryInput = document.getElementById('suggestEditSummary');
    const textInput = document.getElementById('suggestEditText');

    function openModal(articleTitle) {
      if (modal) {
        modal.style.display = 'flex';
        if (summaryInput && articleTitle) {
          summaryInput.value = `Revision proposal for: ${articleTitle}`;
        }
      }
    }

    function closeModal() {
      if (modal) modal.style.display = 'none';
    }

    if (openHeaderBtn) openHeaderBtn.addEventListener('click', () => openModal(document.title));
    if (openTopbarLink) openTopbarLink.addEventListener('click', () => openModal(document.title));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const summary = summaryInput ? summaryInput.value.trim() : '';
        const text = textInput ? textInput.value.trim() : '';

        if (!summary || !text) {
          alert('Please provide an edit summary and proposed text before submitting.');
          return;
        }

        const proposal = {
          id: 'edit_' + Date.now(),
          articleTitle: document.getElementById('articleMainTitle') ? document.getElementById('articleMainTitle').textContent : 'General Article',
          summary: summary,
          text: text,
          timestamp: new Date().toISOString(),
          status: 'Pending Peer Review'
        };

        try {
          const existing = JSON.parse(localStorage.getItem('metawiki_suggested_edits') || '[]');
          existing.push(proposal);
          localStorage.setItem('metawiki_suggested_edits', JSON.stringify(existing));
        } catch (e) {
          console.warn('Could not save suggest edit to localStorage', e);
        }

        // Show feedback modal/toast
        alert(`✨ Thank you! Your edit proposal for "${proposal.articleTitle}" has been submitted for community peer review.`);

        if (summaryInput) summaryInput.value = '';
        if (textInput) textInput.value = '';
        closeModal();
      });
    }

    window.openSuggestEditModal = openModal;
  }

  // Export Article Reader API
  window.renderInfobox = renderInfobox;
  window.setupSuggestEditsModal = setupSuggestEditsModal;

})(window);

