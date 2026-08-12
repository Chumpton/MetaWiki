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
            <div style="display: flex; align-items: flex-start; gap: 0.9rem;">
              <img id="profileModalAvatar" src="https://cdn.discordapp.com/embed/avatars/0.png" style="width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255, 255, 255, 0.22); box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.25), 0 8px 24px rgba(0, 0, 0, 0.75);" alt="Discord Profile Picture">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                  <h3 id="profileModalUsername" style="color: #ffffff; font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; margin: 0; letter-spacing: -0.01em;">Discord Member</h3>
                  <!-- DISCORD ROLE & COLOR BADGE TO RIGHT OF NAME -->
                  <span id="profileModalRoleBadge" style="font-size: 0.72rem; color: #a855f7; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.5); padding: 0.15rem 0.55rem; border-radius: 6px; font-weight: 700; display: inline-flex; align-items: center; gap: 0.25rem;">
                    Luminary
                  </span>
                </div>
                <div id="profileModalHandle" style="color: #94a3b8; font-size: 0.85rem; margin-top: 0.2rem; font-weight: 500;">@discord</div>
                <!-- SAVED BIO DISPLAYED BELOW @NAME HANDLE -->
                <div id="profileModalSavedBioDisplay" style="color: #e2e8f0; font-size: 0.82rem; margin-top: 0.5rem; line-height: 1.4; background: rgba(255, 255, 255, 0.05); padding: 0.45rem 0.65rem; border-radius: 6px; border-left: 2px solid #fbbf24; word-break: break-word;">
                  No bio saved yet.
                </div>
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
            <label style="font-size: 0.85rem; font-weight: 700; color: #fbbf24; display: block; margin-bottom: 0.45rem;">Bio</label>
            <textarea id="profileModalBioInput" style="width: 100%; height: 85px; padding: 0.7rem 0.8rem; background: #000000; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: #ffffff; font-size: 0.88rem; line-height: 1.5; font-family: var(--font-sans-wiki); resize: vertical; outline: none;" placeholder="Share your bio..."></textarea>
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

    const roleBadgeEl = document.getElementById('profileModalRoleBadge');
    const savedBioDisplay = document.getElementById('profileModalSavedBioDisplay');

    function getRoleColorStyles(roleName) {
      const name = (roleName || '').toLowerCase();
      if (name.includes('admin')) {
        return { color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.45)' };
      } else if (name.includes('luminary')) {
        return { color: '#c084fc', bg: 'rgba(168, 85, 247, 0.18)', border: 'rgba(168, 85, 247, 0.5)' };
      } else if (name.includes('observer')) {
        return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.45)' };
      } else if (name.includes('adept')) {
        return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.45)' };
      } else {
        return { color: '#818cf8', bg: 'rgba(88, 101, 242, 0.18)', border: 'rgba(88, 101, 242, 0.45)' };
      }
    }

    function populateProfileData() {
      const auth = window.METAWIKI_AUTH;
      const session = auth ? auth.getSession() : null;
      if (!session) return;

      if (avatarImg) avatarImg.src = session.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
      if (usernameEl) usernameEl.textContent = session.username || 'Discord Member';
      if (handleEl) handleEl.textContent = session.fullHandle || '@discord';
      
      const bioText = (session.bio && session.bio.trim()) ? session.bio.trim() : 'No bio saved yet.';
      if (bioInput) bioInput.value = session.bio || '';
      if (savedBioDisplay) savedBioDisplay.textContent = bioText;

      const roleTitle = session.discordRole || session.role || 'Guild Seeker';
      if (roleBadgeEl) {
        const styles = getRoleColorStyles(roleTitle);
        roleBadgeEl.textContent = roleTitle;
        roleBadgeEl.style.color = styles.color;
        roleBadgeEl.style.backgroundColor = styles.bg;
        roleBadgeEl.style.borderColor = styles.border;
      }
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
          const newBio = bioInput.value.trim();
          session.bio = newBio;
          auth.setSession(session);
          if (savedBioDisplay) {
            savedBioDisplay.textContent = newBio || 'No bio saved yet.';
          }
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

  window.openMemberProfileModal = function () {
    initMemberProfileModal();
    if (typeof window.openMemberProfileModal === 'function') {
      window.openMemberProfileModal();
    }
  };

})(window);
