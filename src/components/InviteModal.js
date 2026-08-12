/**
 * MetaWiki - Discord Server & Guild Invite Modal Component
 * Manages official Discord guild server invites, custom seeker link generation,
 * copy-to-clipboard actions, and member metrics.
 */

(function (window) {
  'use strict';

  function initInviteModal() {
    const modal = document.getElementById('discordInviteModal');
    const openBtn = document.getElementById('openInviteModalBtn');
    const openNavBtn = document.getElementById('navInviteBtn');
    const openChatBtn = document.getElementById('chatHeaderInviteBtn');
    const closeBtn = document.getElementById('closeInviteModalBtn');
    const generateBtn = document.getElementById('generateInviteBtn');
    const copyBtn = document.getElementById('copyInviteBtn');
    const inviteLinkInput = document.getElementById('inviteLinkInput');
    const joinOfficialBtn = document.getElementById('joinOfficialDiscordBtn');

    function openModal() {
      if (modal) {
        modal.style.display = 'flex';
        updateInviteInput();
      }
    }

    function closeModal() {
      if (modal) modal.style.display = 'none';
    }

    function updateInviteInput() {
      if (!inviteLinkInput) return;
      const auth = window.METAWIKI_AUTH;
      const userInvites = auth ? auth.getUserInvites() : [];
      if (userInvites.length > 0) {
        inviteLinkInput.value = userInvites[0].url;
      } else {
        const session = auth ? auth.getSession() : null;
        const handleSlug = session ? session.username.toLowerCase().replace(/[^\w-]/g, '') : 'seeker';
        inviteLinkInput.value = `https://metawiki.org/invite/${handleSlug}-777`;
      }
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (openNavBtn) openNavBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (openChatBtn) openChatBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        if (window.METAWIKI_AUTH) {
          const newInvite = window.METAWIKI_AUTH.generateInviteLink();
          if (inviteLinkInput) inviteLinkInput.value = newInvite.url;
          
          generateBtn.innerHTML = `<i class="ph ph-check-circle"></i> New Seeker Link Created!`;
          setTimeout(() => {
            generateBtn.innerHTML = `<i class="ph ph-plus-circle"></i> Generate Custom Link`;
          }, 2000);
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (inviteLinkInput && inviteLinkInput.value) {
          navigator.clipboard.writeText(inviteLinkInput.value).then(() => {
            copyBtn.innerHTML = `<i class="ph ph-check" style="color: #10b981;"></i> Copied!`;
            setTimeout(() => {
              copyBtn.innerHTML = `<i class="ph ph-copy"></i> Copy Link`;
            }, 2000);
          }).catch(() => {
            // Fallback select
            inviteLinkInput.select();
            document.execCommand('copy');
            alert('✨ Seeker invite link copied to clipboard!');
          });
        }
      });
    }

    if (joinOfficialBtn) {
      joinOfficialBtn.addEventListener('click', () => {
        window.open('https://discord.gg/metawiki-gnosis', '_blank');
      });
    }

    window.openDiscordInviteModal = openModal;
    window.closeDiscordInviteModal = closeModal;
  }

  window.initInviteModal = initInviteModal;

})(window);
