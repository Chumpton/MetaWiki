/**
 * MetaWiki - Modals Component Engine (Suggest Edits, Create Topic, Forum Thread Modal)
 */

(function(window) {
  'use strict';

  function setupSuggestEditsModal() {
    const modal = document.getElementById('suggestEditModal');
    const openHeaderBtn = document.getElementById('suggestEditHeaderBtn');
    const openTopbarLink = document.getElementById('suggestEditTopbarLink');
    const closeBtn = document.getElementById('closeSuggestEditBtn');
    const submitBtn = document.getElementById('submitSuggestEditBtn');

    function openModal() { if (modal) modal.style.display = 'flex'; }
    function closeModal() { if (modal) modal.style.display = 'none'; }

    if (openHeaderBtn) openHeaderBtn.addEventListener('click', openModal);
    if (openTopbarLink) openTopbarLink.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const topic = modal.querySelector('input[type="text"]').value;
        const text = modal.querySelector('textarea').value;

        if (!text.trim()) {
          alert('Please provide your edit proposal or commentary.');
          return;
        }

        const proposal = {
          topic: topic || 'General Metaphysics',
          proposal: text,
          date: new Date().toISOString()
        };

        let existing = [];
        try {
          existing = JSON.parse(localStorage.getItem('metawiki_suggested_edits')) || [];
        } catch(e) {}

        existing.push(proposal);
        localStorage.setItem('metawiki_suggested_edits', JSON.stringify(existing));

        alert('Thank you, Initiate. Your edit proposal has been recorded into peer-review storage.');
        modal.querySelector('textarea').value = '';
        closeModal();
      });
    }
  }

  function openSuggestEditModal(topicTitle) {
    const modal = document.getElementById('suggestEditModal');
    if (modal) {
      modal.style.display = 'flex';
      const topicInput = modal.querySelector('input[type="text"]');
      if (topicInput && topicTitle) topicInput.value = topicTitle;
    }
  }

  window.Modal = {
    setupSuggestEditsModal,
    openSuggestEditModal
  };

  window.setupSuggestEditsModal = setupSuggestEditsModal;
  window.openSuggestEditModal = openSuggestEditModal;

})(window);
