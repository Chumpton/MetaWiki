/**
 * MetaWiki - Discord Authentication & Account Services
 * Manages Discord OAuth2 mock flow, user sessions, verified status, and custom avatars.
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'metawiki_discord_session';

  const DEFAULT_ACCOUNTS = [
    {
      username: 'HermeticSeeker',
      discriminator: '7777',
      fullHandle: 'HermeticSeeker#7777',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      badge: 'Hermetic Initiate (LoC 600)',
      joinedDate: 'Initiated 2024'
    },
    {
      username: 'GnosticAlchemist',
      discriminator: '3301',
      fullHandle: 'GnosticAlchemist#3301',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      badge: 'Alchemical Scholar (LoC 540)',
      joinedDate: 'Initiated 2023'
    },
    {
      username: 'QuantumVedantin',
      discriminator: '1008',
      fullHandle: 'QuantumVedantin#1008',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      badge: 'Non-Dual Master (LoC 700)',
      joinedDate: 'Initiated 2025'
    }
  ];

  function getSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return null;
  }

  function setSession(userObj) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
    } catch (e) {}
    updateUIForSession();
  }

  function clearSession() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    updateUIForSession();
  }

  function loginMockUser(username, discriminator, customAvatar) {
    const handle = `${username}#${discriminator || '1008'}`;
    const avatarUrl = customAvatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`;
    
    const userSession = {
      username: username,
      discriminator: discriminator || '1008',
      fullHandle: handle,
      avatar: avatarUrl,
      badge: 'Verified Gnostic Initiate',
      joinedDate: 'Just Now',
      loggedInAt: new Date().toISOString()
    };

    setSession(userSession);
    return userSession;
  }

  function updateUIForSession() {
    const session = getSession();
    const discordNavBtn = document.getElementById('navDiscordLoginBtn');
    const modal = document.getElementById('discordAuthModal');

    if (discordNavBtn) {
      if (session) {
        discordNavBtn.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="${session.avatar}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1px solid var(--mw-gold);" alt="Avatar">
            <span style="color: var(--mw-gold); font-weight: 800;">${session.username}</span>
            <i class="ph ph-check-circle" style="color: #10b981; font-size: 0.9rem;" title="Verified Discord Initiate"></i>
          </div>
        `;
        discordNavBtn.title = `Logged in as ${session.fullHandle}`;
      } else {
        discordNavBtn.innerHTML = `
          <i class="ph ph-discord-logo" style="color: #5865F2; font-size: 1.2rem;"></i>
          <span>Sign In / Sign Up with Discord</span>
        `;
        discordNavBtn.title = `Sign In or Sign Up with Discord`;
      }
    }

    const chatUserBanner = document.getElementById('chatUserBanner');
    if (chatUserBanner) {
      if (session) {
        chatUserBanner.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.8rem; background: rgba(88, 101, 242, 0.15); border: 1px solid var(--mw-border-violet); border-radius: 10px; margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <img src="${session.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" alt="User">
              <div>
                <div style="font-weight: 800; font-size: 0.82rem; color: #fff;">${session.fullHandle}</div>
                <div style="font-size: 0.7rem; color: var(--mw-gold);">${session.badge}</div>
              </div>
            </div>
            <button id="discordLogoutBtn" style="background: none; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: var(--mw-text-muted); font-size: 0.72rem; padding: 0.2rem 0.5rem; cursor: pointer;">Logout</button>
          </div>
        `;
        const logoutBtn = document.getElementById('discordLogoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', clearSession);
      } else {
        chatUserBanner.innerHTML = `
          <div style="text-align: center; padding: 0.6rem; background: rgba(255, 255, 255, 0.04); border: 1px dashed var(--mw-border); border-radius: 10px; margin-bottom: 0.75rem; font-size: 0.78rem; color: var(--mw-text-muted);">
            Browsing as Guest. <a id="chatPromptLoginLink" style="color: var(--mw-gold); text-decoration: underline; cursor: pointer;">Connect Discord</a> to post live.
          </div>
        `;
        const promptLink = document.getElementById('chatPromptLoginLink');
        if (promptLink) promptLink.addEventListener('click', openDiscordModal);
      }
    }
  }

  function openDiscordModal() {
    const modal = document.getElementById('discordAuthModal');
    if (modal) modal.style.display = 'flex';
  }

  function closeDiscordModal() {
    const modal = document.getElementById('discordAuthModal');
    if (modal) modal.style.display = 'none';
  }

  function setupDiscordAuth() {
    const discordNavBtn = document.getElementById('navDiscordLoginBtn');
    const modal = document.getElementById('discordAuthModal');
    const closeBtn = document.getElementById('closeDiscordAuthModalBtn');
    const confirmBtn = document.getElementById('confirmDiscordAuthBtn');

    const usernameInput = document.getElementById('discordUsernameInput');
    const discriminatorInput = document.getElementById('discordDiscriminatorInput');

    if (discordNavBtn) {
      discordNavBtn.addEventListener('click', () => {
        const session = getSession();
        if (session) {
          if (confirm(`Logged in as ${session.fullHandle}.\nWould you like to sign out?`)) {
            clearSession();
          }
        } else {
          openDiscordModal();
        }
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDiscordModal);

    let selectedAvatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
    if (modal) {
      modal.querySelectorAll('.discord-avatar-option').forEach(img => {
        img.addEventListener('click', () => {
          modal.querySelectorAll('.discord-avatar-option').forEach(i => i.style.borderColor = 'transparent');
          img.style.borderColor = 'var(--mw-gold)';
          selectedAvatarUrl = img.src;
        });
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const username = (usernameInput && usernameInput.value.trim()) || 'HermeticSeeker';
        const discriminator = (discriminatorInput && discriminatorInput.value.trim()) || '7777';

        loginMockUser(username, discriminator, selectedAvatarUrl);
        closeDiscordModal();
      });
    }

    updateUIForSession();
  }

  window.METAWIKI_DISCORD_BACKEND = {
    getSession,
    setSession,
    clearSession,
    loginMockUser,
    updateUIForSession,
    openDiscordModal,
    closeDiscordModal,
    setupDiscordAuth
  };

  window.setupDiscordAuth = setupDiscordAuth;

})(window);
