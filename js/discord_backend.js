/**
 * MetaWiki Minimalist Discord Authentication Controller
 * Controls live Discord OAuth2 redirection, nav button username display with profile avatar,
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
        <span style="display: inline-flex; align-items: center; gap: 0.55rem;">
          <img src="${session.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fbbf24; box-shadow: 0 0 8px rgba(251, 191, 36, 0.3);" alt="Profile Picture">
          <span style="color: #ffffff; font-weight: 800; font-size: 0.9rem;">${session.username}</span>
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
          if (typeof window.openMemberProfileModal === 'function') {
            window.openMemberProfileModal();
          } else {
            window.METAWIKI_DISCORD_BACKEND.logout();
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
