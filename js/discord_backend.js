/**
 * MetaWiki Minimalist Discord Authentication Controller
 * Controls live Discord OAuth2 redirection, embossed avatar display in menu area,
 * and member profile modal triggers.
 */

(function () {
  'use strict';

  const MOCK_AVATARS = [
    "https://cdn.discordapp.com/embed/avatars/0.png",
    "https://cdn.discordapp.com/embed/avatars/1.png",
    "https://cdn.discordapp.com/embed/avatars/2.png",
    "https://cdn.discordapp.com/embed/avatars/3.png",
    "https://cdn.discordapp.com/embed/avatars/4.png"
  ];

  window.METAWIKI_DISCORD_BACKEND = {
    getSession: function () {
      if (window.METAWIKI_AUTH) return window.METAWIKI_AUTH.getSession();
      try {
        const stored = localStorage.getItem('metawiki_auth_session');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    },

    login: function (customUsername, selectedAvatar, loc = 700) {
      if (window.METAWIKI_AUTH) {
        return window.METAWIKI_AUTH.loginDiscord(customUsername, selectedAvatar, loc);
      }
      return null;
    },

    logout: function () {
      if (window.METAWIKI_AUTH) window.METAWIKI_AUTH.logout();
    },

    openModal: function () {
      const modal = document.getElementById('discordLoginModal');
      if (modal) modal.style.display = 'flex';
    },

    closeModal: function () {
      const modal = document.getElementById('discordLoginModal');
      if (modal) modal.style.display = 'none';
    }
  };

  function updateNavLabel() {
    const session = window.METAWIKI_DISCORD_BACKEND.getSession();
    const navBtn = document.getElementById('navDiscordBtn');
    if (!navBtn) return;

    if (session) {
      navBtn.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 0.6rem;">
          <img src="${session.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255, 255, 255, 0.25); box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.4), inset 0 -2px 3px rgba(0, 0, 0, 0.8), 0 3px 8px rgba(0, 0, 0, 0.7);" alt="Profile Picture">
          <span style="color: #ffffff; font-weight: 800; font-size: 0.92rem; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">${session.username}</span>
        </span>
      `;
      navBtn.title = `Logged in as ${session.fullHandle} — Click to open Member Profile`;
    } else {
      navBtn.innerHTML = `<i class="ph ph-discord-logo" style="color: #5865F2;"></i> <span id="discordNavLabel">Sign In / Sign Up with Discord</span>`;
      navBtn.title = `Sign In or Sign Up with Discord`;
    }
  }

  function setupDiscordAuth() {
    const navBtn = document.getElementById('navDiscordBtn');
    const modal = document.getElementById('discordLoginModal');
    const closeBtn = document.getElementById('closeDiscordModalBtn');
    const confirmBtn = document.getElementById('confirmDiscordLoginBtn');

    updateNavLabel();

    window.addEventListener('metawiki_auth_changed', () => {
      updateNavLabel();
    });

    if (navBtn) {
      navBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const session = window.METAWIKI_DISCORD_BACKEND.getSession();
        if (session) {
          if (typeof window.initMemberProfileModal === 'function') {
            window.initMemberProfileModal();
          }
          if (typeof window.openMemberProfileModal === 'function') {
            window.openMemberProfileModal();
          }
        } else {
          window.METAWIKI_DISCORD_BACKEND.openModal();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => window.METAWIKI_DISCORD_BACKEND.closeModal());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.METAWIKI_DISCORD_BACKEND.closeModal();
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = `<i class="ph ph-spinner spinner" style="animation: spin 1s linear infinite;"></i> Connecting to Discord...`;

        const auth = window.METAWIKI_AUTH;
        if (auth && typeof auth.startRealDiscordOAuth === 'function') {
          auth.startRealDiscordOAuth();
        } else {
          const authUrl = `https://qcqbinlijrzzuvrseyii.supabase.co/auth/v1/authorize?provider=discord&redirect_to=${encodeURIComponent(window.location.origin + window.location.pathname)}`;
          window.location.href = authUrl;
        }
      });
    }
  }

  window.setupDiscordAuth = setupDiscordAuth;

})();
