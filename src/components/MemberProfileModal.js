/**
 * MetaWiki - High-Contrast Member Profile Modal Component
 * Displays authentic Discord user details, profile avatar, Level counter & EXP progress bar,
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
        <div class="discord-modal-card" style="max-width: 460px; width: 92%; padding: 1.6rem; background: #0f111a; border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 14px; box-shadow: 0 16px 40px rgba(0,0,0,0.85); font-family: var(--font-sans-wiki);">
          
          <!-- MODAL HEADER -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.3rem;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <img id="profileModalAvatar" src="https://cdn.discordapp.com/embed/avatars/0.png" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid #fbbf24; box-shadow: 0 0 14px rgba(251, 191, 36, 0.35);" alt="Discord Profile Picture">
              <div>
                <div style="display: flex; align-items: center; gap: 0.45rem;">
                  <h3 id="profileModalUsername" style="color: #ffffff; font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; margin: 0; letter-spacing: -0.01em;">Discord Member</h3>
                  <span style="font-size: 0.72rem; color: #4ade80; background: rgba(74, 222, 128, 0.12); border: 1px solid rgba(74, 222, 128, 0.35); padding: 0.15rem 0.55rem; border-radius: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 0.2rem;"><i class="ph ph-check-circle"></i> Verified</span>
                </div>
                <div id="profileModalHandle" style="color: #94a3b8; font-size: 0.85rem; margin-top: 0.2rem; font-weight: 500;">@discord</div>
              </div>
            </div>
            <button id="closeProfileModalBtn" style="background: none; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer; padding: 0.2rem; line-height: 1;">✕</button>
          </div>

          <!-- MEMBER LEVEL & EXP PROGRESS CARD -->
          <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(251, 191, 36, 0.35); border-radius: 12px; padding: 0.9rem 1.1rem; margin-bottom: 1.2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span id="profileModalLevelBadge" style="font-size: 0.78rem; font-weight: 800; color: #fbbf24; background: rgba(251, 191, 36, 0.15); border: 1px solid rgba(251, 191, 36, 0.35); padding: 0.15rem 0.6rem; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Level 700</span>
                <span id="profileModalRoleTitle" style="font-size: 0.92rem; font-weight: 700; color: #ffffff;">Ascended Luminary</span>
              </div>
              <span id="profileModalExpRatio" style="font-size: 0.78rem; font-weight: 700; color: #94a3b8;">14,250 / 15,000 EXP</span>
            </div>

            <!-- EXP PROGRESS BAR -->
            <div style="width: 100%; height: 10px; background: rgba(0, 0, 0, 0.6); border-radius: 10px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); margin-top: 0.4rem;">
              <div id="profileModalExpFill" style="width: 95%; height: 100%; background: linear-gradient(90deg, #a855f7 0%, #fbbf24 100%); border-radius: 10px; box-shadow: 0 0 10px rgba(251, 191, 36, 0.5); transition: width 0.4s ease;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.35rem; font-size: 0.72rem; color: #94a3b8;">
              <span>Initiate Knowledge Mastery</span>
              <span id="profileModalExpNext">750 EXP to Level 701</span>
            </div>
          </div>

          <!-- JOIN OFFICIAL DISCORD SERVER CTA BUTTON -->
          <a href="https://discord.gg/metawiki" target="_blank" id="joinGuildBtn" style="padding: 0.65rem; background: #5865F2; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.45rem; margin-bottom: 1.2rem; transition: background 0.2s ease;">
            <i class="ph ph-discord-logo" style="font-size: 1.15rem;"></i> Join MetaWiki Discord Guild
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
    const levelBadgeEl = document.getElementById('profileModalLevelBadge');
    const roleTitleEl = document.getElementById('profileModalRoleTitle');
    const expRatioEl = document.getElementById('profileModalExpRatio');
    const expFillEl = document.getElementById('profileModalExpFill');
    const expNextEl = document.getElementById('profileModalExpNext');
    const bioInput = document.getElementById('profileModalBioInput');
    const saveBioBtn = document.getElementById('saveProfileBioBtn');
    const signOutBtn = document.getElementById('profileSignOutBtn');

    function populateProfileData() {
      const auth = window.METAWIKI_AUTH;
      const session = auth ? auth.getSession() : null;
      if (!session) return;

      const level = session.level || session.hawkinsLoC || 700;
      let cleanRole = session.role || 'Ascended Luminary';
      if (cleanRole.includes('(')) cleanRole = cleanRole.split('(')[0].trim();

      const currentExp = session.exp || Math.floor(level * 20.35);
      const targetExp = session.nextLevelExp || Math.floor((level + 1) * 20.35);
      const pct = Math.min(100, Math.max(10, Math.round((currentExp / targetExp) * 100)));
      const nextExpNeeded = targetExp - currentExp;

      if (avatarImg) avatarImg.src = session.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
      if (usernameEl) usernameEl.textContent = session.username || 'Discord Member';
      if (handleEl) handleEl.textContent = session.fullHandle || '@discord';
      if (levelBadgeEl) levelBadgeEl.textContent = `Level ${level}`;
      if (roleTitleEl) roleTitleEl.textContent = cleanRole;
      if (expRatioEl) expRatioEl.textContent = `${currentExp.toLocaleString()} / ${targetExp.toLocaleString()} EXP`;
      if (expFillEl) expFillEl.style.width = `${pct}%`;
      if (expNextEl) expNextEl.textContent = `${nextExpNeeded.toLocaleString()} EXP to Level ${level + 1}`;
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
