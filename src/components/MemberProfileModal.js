/**
 * MetaWiki - Clean Member Profile Modal Component
 * Displays authentic Discord user details, embossed profile avatar (yellow ring removed, larger 68px size),
 * 1-click Discord Guild server join link, and high-visibility bio editor.
 */

(function (window) {
  'use strict';

  function initMemberProfileModal() {
    if (document.getElementById('memberProfileModalContainer')) return;

    const container = document.createElement('div');
    container.id = 'memberProfileModalContainer';
    container.innerHTML = `
      <!-- MEMBER PROFILE MODAL OVERLAY -->
      <div class="discord-modal-overlay" id="memberProfileModal" style="display: none; z-index: 10000;">
        <div class="discord-modal-card" style="max-width: 440px; width: 92%; padding: 1.6rem; background: #0f111a; border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 14px; box-shadow: 0 16px 40px rgba(0,0,0,0.85); font-family: var(--font-sans-wiki);">
          
          <!-- MODAL HEADER -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.3rem;">
            <div style="display: flex; align-items: center; gap: 0.9rem;">
              <img id="profileModalAvatar" src="https://cdn.discordapp.com/embed/avatars/0.png" style="width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255, 255, 255, 0.22); box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.25), 0 8px 24px rgba(0, 0, 0, 0.75);" alt="Discord Profile Picture">
              <div>
                <div style="display: flex; align-items: center; gap: 0.45rem;">
                  <h3 id="profileModalUsername" style="color: #ffffff; font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; margin: 0; letter-spacing: -0.01em;">Discord Member</h3>
                  <span style="font-size: 0.72rem; color: #4ade80; background: rgba(74, 222, 128, 0.12); border: 1px solid rgba(74, 222, 128, 0.35); padding: 0.15rem 0.55rem; border-radius: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 0.2rem;"><i class="ph ph-check-circle"></i> Verified</span>
                </div>
                <div id="profileModalHandle" style="color: #94a3b8; font-size: 0.85rem; margin-top: 0.2rem; font-weight: 500;">@discord</div>
              </div>
            </div>
            <button id="closeProfileModalBtn" style="background: none; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer; padding: 0.2rem; line-height: 1;">✕</button>
          </div>

          <!-- JOIN OFFICIAL DISCORD SERVER CTA BUTTON -->
          <a href="https://discord.gg/sZwwXgR5vf" target="_blank" id="joinGuildBtn" style="padding: 0.75rem; background: #5865F2; color: #ffffff; text-decoration: none; border-radius: 9px; font-weight: 800; font-size: 0.88rem; display: flex; align-items: center; justify-content: center; gap: 0.45rem; margin-bottom: 1.3rem; transition: background 0.2s ease; box-shadow: 0 4px 14px rgba(88, 101, 242, 0.3);">
            <i class="ph ph-discord-logo" style="font-size: 1.25rem;"></i> Join 🌌 Meta Wiki Discord Guild
          </a>

          <!-- MEMBER BIO EDIT AREA -->
          <div style="margin-bottom: 1.3rem;">
            <label style="font-size: 0.85rem; font-weight: 700; color: #fbbf24; display: block; margin-bottom: 0.45rem;">Member Contemplative Bio</label>
            <textarea id="profileModalBioInput" style="width: 100%; height: 95px; padding: 0.7rem 0.8rem; background: #000000; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: #ffffff; font-size: 0.88rem; line-height: 1.5; font-family: var(--font-sans-wiki); resize: vertical; outline: none;" placeholder="Share your metaphysical contemplations or favorite lineages..."></textarea>
          </div>

          <!-- ACTION BUTTONS -->
          <div style="display: flex; gap: 0.75rem;">
            <button id="saveProfileBioBtn" style="flex: 1; padding: 0.7rem; background: #a855f7; color: #ffffff; border: none; border-radius: 8px; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: background 0.2s ease;">
              <i class="ph ph-floppy-disk"></i> Save Bio
            </button>
            <button id="profileSignOutBtn" style="padding: 0.7rem 1.1rem; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); color: #f87171; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
              <i class="ph ph-sign-out"></i> Sign Out
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(container);

    const modal = document.getElementById('memberProfileModal');
    const closeBtn = document.getElementById('closeProfileModalBtn');
    const avatarImg = document.getElementById('profileModalAvatar');
    const usernameEl = document.getElementById('profileModalUsername');
    const handleEl = document.getElementById('profileModalHandle');
    const bioInput = document.getElementById('profileModalBioInput');
    const saveBioBtn = document.getElementById('saveProfileBioBtn');
    const signOutBtn = document.getElementById('profileSignOutBtn');

    function populateProfileData() {
      const auth = window.METAWIKI_AUTH;
      const session = auth ? auth.getSession() : null;
      if (!session) return;

      if (avatarImg) avatarImg.src = session.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
      if (usernameEl) usernameEl.textContent = session.username || 'Discord Member';
      if (handleEl) handleEl.textContent = session.fullHandle || '@discord';
      if (bioInput) bioInput.value = session.bio || '';
    }

    function openModal() {
      if (modal) {
        populateProfileData();
        modal.style.display = 'flex';
      }
    }

    function closeModal() {
      if (modal) modal.style.display = 'none';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (saveBioBtn) {
      saveBioBtn.addEventListener('click', () => {
        const auth = window.METAWIKI_AUTH;
        const session = auth ? auth.getSession() : null;
        if (session && bioInput) {
          session.bio = bioInput.value.trim();
          auth.setSession(session);
          saveBioBtn.innerHTML = `<i class="ph ph-check"></i> Bio Saved!`;
          setTimeout(() => {
            saveBioBtn.innerHTML = `<i class="ph ph-floppy-disk"></i> Save Bio`;
            closeModal();
          }, 900);
        }
      });
    }

    if (signOutBtn) {
      signOutBtn.addEventListener('click', () => {
        if (window.METAWIKI_AUTH) {
          window.METAWIKI_AUTH.logout();
          closeModal();
        }
      });
    }

    window.openMemberProfileModal = openModal;
    window.closeMemberProfileModal = closeModal;
  }

  window.initMemberProfileModal = initMemberProfileModal;

})(window);
