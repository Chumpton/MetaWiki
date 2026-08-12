/**
 * MetaWiki - Master Unified Authentication Service & Mock Test Adapter
 * Prepared for Discord OAuth2 backend handshake, Supabase Auth integration,
 * Remember Me session persistence, and Vercel serverless deployment.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'metawiki_auth_session';

  const DEFAULT_AVATARS = [
    "https://cdn.discordapp.com/embed/avatars/0.png",
    "https://cdn.discordapp.com/embed/avatars/1.png",
    "https://cdn.discordapp.com/embed/avatars/2.png",
    "https://cdn.discordapp.com/embed/avatars/3.png",
    "https://cdn.discordapp.com/embed/avatars/4.png"
  ];

  const MOCK_PRESET_ACCOUNTS = [
    {
      id: 'guest',
      label: '⚪ Unauthenticated Guest',
      username: null
    },
    {
      id: 'hermetic_seeker',
      label: '🔮 Hermetic Initiate',
      username: 'HermeticSeeker',
      discriminator: '7777',
      avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
      loc: 540
    },
    {
      id: 'nondual_observer',
      label: '☸️ Non-Dual Observer',
      username: 'NonDualObserver',
      discriminator: '6000',
      avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
      loc: 600
    },
    {
      id: 'ascended_luminary',
      label: '✨ Ascended Luminary',
      username: 'AscendedLuminary',
      discriminator: '9999',
      avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      loc: 700
    }
  ];

  class AuthService {
    constructor() {
      this.provider = 'discord'; // 'discord' | 'supabase'
      this.supabaseClient = null;
      this.listeners = [];
      this.simulateGuildMembershipCheckPass = true;
    }

    getMockPresets() {
      return MOCK_PRESET_ACCOUNTS;
    }

    getHawkinsRole(loc = 700) {
      if (loc >= 700) return 'Ascended Luminary';
      if (loc >= 600) return 'Non-Dual Observer';
      if (loc >= 540) return 'Spiritual Observer';
      if (loc >= 400) return 'Intellectual Adept';
      return 'Initiatory Seeker';
    }

    /**
     * Retrieve Active User Session (Checks localStorage & sessionStorage for Remember Me)
     */
    getSession() {
      try {
        const localData = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (localData) {
          const session = JSON.parse(localData);
          if (session && session.role && session.role.includes('(')) {
            session.role = session.role.split('(')[0].trim();
          }
          return session;
        }
        const sessionData = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null;
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session && session.role && session.role.includes('(')) {
            session.role = session.role.split('(')[0].trim();
          }
          return session;
        }
        return null;
      } catch (e) {
        console.warn('Could not parse auth session:', e);
        return null;
      }
    }

    /**
     * Set Session & Persistence Mode (Remember Me)
     */
    setSession(sessionData, rememberMe = true) {
      try {
        if (sessionData) {
          if (sessionData.role && sessionData.role.includes('(')) {
            sessionData.role = sessionData.role.split('(')[0].trim();
          }
          sessionData.rememberMe = rememberMe;
          if (rememberMe && typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
            if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(STORAGE_KEY);
          } else if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
            if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
          }
        } else {
          if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
          if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.warn('Could not update auth session persistence:', e);
      }
      this.notify(sessionData);
      window.dispatchEvent(new CustomEvent('metawiki_auth_changed', { detail: sessionData }));
    }

    async verifyGuildMembership(discordUserId) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            inGuild: this.simulateGuildMembershipCheckPass,
            guildId: '987654321098765432',
            roles: ['Initiate', 'Seeker', 'Luminary'],
            verifiedAt: new Date().toISOString()
          });
        }, 250);
      });
    }

    async loginDiscordOptimistic(usernameInput, selectedAvatar, loc = 700, rememberMe = true, onProgress) {
      const username = usernameInput && usernameInput.trim() ? usernameInput.trim() : 'GnosticSeeker';
      const avatar = selectedAvatar || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
      const discriminator = String(Math.floor(1000 + Math.random() * 9000));
      const id = 'disc_' + Math.floor(1000000000000000 + Math.random() * 9000000000000000);

      if (typeof onProgress === 'function') {
        onProgress(1, 'Stage 1/2: Authorizing Discord Identity...');
      }
      await new Promise(r => setTimeout(r, 200));

      if (typeof onProgress === 'function') {
        onProgress(2, 'Stage 2/2: Verifying MetaWiki Discord Guild Membership...');
      }
      const guildCheck = await this.verifyGuildMembership(id);

      if (!guildCheck.inGuild) {
        throw new Error('GUILD_MEMBERSHIP_REQUIRED');
      }

      const level = loc;
      const currentExp = Math.floor(level * 20.35);
      const targetExp = Math.floor((level + 1) * 20.35);

      const session = {
        provider: 'discord',
        id: id,
        username: username,
        discriminator: discriminator,
        fullHandle: `${username}#${discriminator}`,
        avatar: avatar,
        hawkinsLoC: level,
        level: level,
        exp: currentExp,
        nextLevelExp: targetExp,
        role: this.getHawkinsRole(level),
        isVerified: true,
        inDiscordGuild: true,
        token: 'mock_discord_oauth_token_' + Math.random().toString(36).substring(2),
        loggedInAt: new Date().toISOString()
      };

      this.setSession(session, rememberMe);
      return session;
    }

    loginDiscord(usernameInput, selectedAvatar, loc = 700, rememberMe = true) {
      const username = usernameInput && usernameInput.trim() ? usernameInput.trim() : 'GnosticSeeker';
      const avatar = selectedAvatar || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
      const discriminator = String(Math.floor(1000 + Math.random() * 9000));
      const id = 'disc_' + Math.floor(1000000000000000 + Math.random() * 9000000000000000);

      const level = loc;
      const currentExp = Math.floor(level * 20.35);
      const targetExp = Math.floor((level + 1) * 20.35);

      const session = {
        provider: 'discord',
        id: id,
        username: username,
        discriminator: discriminator,
        fullHandle: `${username}#${discriminator}`,
        avatar: avatar,
        hawkinsLoC: level,
        level: level,
        exp: currentExp,
        nextLevelExp: targetExp,
        role: this.getHawkinsRole(level),
        isVerified: true,
        inDiscordGuild: true,
        token: 'mock_discord_oauth_token_' + Math.random().toString(36).substring(2),
        loggedInAt: new Date().toISOString()
      };

      this.setSession(session, rememberMe);
      return session;
    }

    loginMockPreset(presetId) {
      if (presetId === 'guest' || !presetId) {
        this.logout();
        return null;
      }
      const found = MOCK_PRESET_ACCOUNTS.find(p => p.id === presetId);
      if (found && found.username) {
        return this.loginDiscord(found.username, found.avatar, found.loc, true);
      }
      return null;
    }

    logout() {
      this.setSession(null);
    }

    onAuthChange(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
    }

    notify(session) {
      this.listeners.forEach(cb => {
        try { cb(session); } catch (e) {}
      });
    }

    /* =========================================================================
       SUPABASE & VERCEL BACKEND INTEGRATION ADAPTER
       ========================================================================= */

    initSupabase(supabaseUrl, supabaseKey) {
      this.provider = 'supabase';
      console.log('⚡ MetaWiki Auth: Supabase Client Initialized.', { url: supabaseUrl });
      return {
        url: supabaseUrl,
        key: supabaseKey,
        isConfigured: true
      };
    }
  }

  window.METAWIKI_AUTH = new AuthService();

})(window);
