const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

// 1. Call initDiscordController in DOMContentLoaded inside app.js
if (!appCode.includes('initDiscordController();')) {
  appCode = appCode.replace('initPixelStarsCanvas();', 'initPixelStarsCanvas();\n  initDiscordController();');
}

// 2. Add full Discord Controller logic to app.js
const discordControllerCode = `
  // =========================================================================
  // DISCORD AUTHENTICATION & SESSION CONTROLLER
  // =========================================================================
  function initDiscordController() {
    const bubbleBtn = document.getElementById('discordHeaderBubble');
    const bubbleText = document.getElementById('discordBubbleText');
    const authModal = document.getElementById('discordAuthModal');
    const authorizeBtn = document.getElementById('authorizeDiscordAuthBtn');
    const cancelBtn = document.getElementById('cancelDiscordAuthBtn');
    const popover = document.getElementById('discordProfilePopover');
    const logoutBtn = document.getElementById('discordLogoutBtn');
    const userAvatar = document.getElementById('discordUserAvatar');
    const userHandle = document.getElementById('discordUserHandle');
    const userRole = document.getElementById('discordUserRole');
    const usernameInput = document.getElementById('discordInputUsername');

    function updateUI() {
      const session = window.METAWIKI_DISCORD_BACKEND ? window.METAWIKI_DISCORD_BACKEND.getSession() : null;
      if (session) {
        if (bubbleBtn) bubbleBtn.classList.add('logged-in');
        if (bubbleText) bubbleText.innerHTML = \`<span style="color: #4ade80;">🟢 \${session.username}</span>\`;
        if (userAvatar) userAvatar.src = session.avatar;
        if (userHandle) userHandle.textContent = session.fullHandle;
        if (userRole) userRole.textContent = session.role;
      } else {
        if (bubbleBtn) bubbleBtn.classList.remove('logged-in');
        if (bubbleText) bubbleText.innerHTML = '🎮 Sign Up / Login with Discord';
        if (popover) popover.style.display = 'none';
      }
    }

    if (bubbleBtn) {
      bubbleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const session = window.METAWIKI_DISCORD_BACKEND ? window.METAWIKI_DISCORD_BACKEND.getSession() : null;
        if (session) {
          if (popover) popover.style.display = popover.style.display === 'none' ? 'block' : 'none';
        } else {
          if (authModal) authModal.style.display = 'flex';
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (popover && !e.target.closest('#discordHeaderBubbleWrapper')) {
        popover.style.display = 'none';
      }
    });

    if (authorizeBtn) {
      authorizeBtn.addEventListener('click', () => {
        const name = usernameInput ? usernameInput.value.trim() : 'GnosticSeeker';
        if (window.METAWIKI_DISCORD_BACKEND) {
          window.METAWIKI_DISCORD_BACKEND.login(name);
        }
        if (authModal) authModal.style.display = 'none';
        updateUI();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (authModal) authModal.style.display = 'none';
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (window.METAWIKI_DISCORD_BACKEND) {
          window.METAWIKI_DISCORD_BACKEND.logout();
        }
        updateUI();
      });
    }

    window.addEventListener('metawiki_discord_auth_changed', updateUI);
    updateUI();
  }
`;

// Append Discord Controller function to app.js
appCode = appCode.replace('function initPixelStarsCanvas() {', discordControllerCode + '\n  function initPixelStarsCanvas() {');

// 3. Connect Discord Session to Live Community Chat message sending
const oldChatSend = `const text = input.value.trim();
      if (!text) return;

      const userMsg = {
        user: 'You',
        text: text,
        time: 'Just now',
        isSelf: true
      };`;

const newChatSend = `const text = input.value.trim();
      if (!text) return;

      const session = window.METAWIKI_DISCORD_BACKEND ? window.METAWIKI_DISCORD_BACKEND.getSession() : null;
      const userHandle = session ? session.fullHandle : 'Seeker (Guest)';

      const userMsg = {
        user: userHandle,
        text: text,
        time: 'Just now',
        isSelf: true
      };`;

if (appCode.includes(oldChatSend)) {
  appCode = appCode.replace(oldChatSend, newChatSend);
}

fs.writeFileSync('app.js', appCode, 'utf-8');
console.log('Successfully updated app.js with Discord Controller and feature integration!');
