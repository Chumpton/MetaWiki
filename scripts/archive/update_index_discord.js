const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add js/discord_backend.js before </body>
if (!html.includes('js/discord_backend.js')) {
  html = html.replace('</body>', '  <script src="js/discord_backend.js"></script>\n</body>');
}

// 2. Add Floating Discord Bubble inside nav#mwGlobalNav
const oldNav = `<a class="mw-nav-item" id="navDiscordBtn" style="cursor:pointer;">
      <i class="ph ph-discord-logo" style="color: #5865F2;"></i> <span id="discordNavLabel">Discord</span>
    </a>`;

const newNav = `<div class="discord-bubble-wrapper" id="discordHeaderBubbleWrapper" style="position: relative;">
      <button class="discord-bubble-btn" id="discordHeaderBubble">
        <i class="ph ph-discord-logo" style="font-size: 1.1rem; color: #5865F2;"></i>
        <span id="discordBubbleText">🎮 Sign Up / Login with Discord</span>
      </button>

      <div class="discord-profile-popover" id="discordProfilePopover" style="display: none; position: absolute; top: 120%; right: 0; background: rgba(18, 18, 26, 0.98); backdrop-filter: blur(25px); border: 1px solid var(--mw-border-gold); border-radius: 14px; padding: 1rem; width: 280px; box-shadow: 0 15px 40px rgba(0,0,0,0.9); z-index: 99999;">
        <div class="discord-popover-header" style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.8rem;">
          <img src="" id="discordUserAvatar" class="discord-avatar-img" alt="Discord Avatar" style="width: 42px; height: 42px; border-radius: 50%; border: 2px solid #5865F2; object-fit: cover;">
          <div>
            <div id="discordUserHandle" style="font-weight: 800; color: #fff; font-size: 0.9rem;">GnosticSeeker#1008</div>
            <div id="discordUserRole" style="font-size: 0.75rem; color: var(--mw-gold);">Ascended Luminary (LoC 700+)</div>
          </div>
        </div>
        <div style="padding-top: 0.6rem; border-top: 1px solid var(--mw-border);">
          <div style="font-size: 0.72rem; color: var(--mw-text-muted); margin-bottom: 0.4rem;">Synced Permissions:</div>
          <div style="font-size: 0.78rem; color: #4ade80; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.3rem;"><i class="ph ph-check-circle"></i> Live Chat Handle Verified</div>
          <div style="font-size: 0.78rem; color: #4ade80; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.8rem;"><i class="ph ph-check-circle"></i> Edit Proposals Attributed</div>
          <button id="discordLogoutBtn" style="width: 100%; padding: 0.45rem; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 8px; cursor: pointer; font-size: 0.8rem; font-weight: bold;">Logout of Discord</button>
        </div>
      </div>
    </div>`;

if (html.includes(oldNav)) {
  html = html.replace(oldNav, newNav);
}

// 3. Add Discord Auth Modal before </body>
const discordModalHTML = `
  <!-- DISCORD OAUTH AUTHORIZATION MODAL -->
  <div id="discordAuthModal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 99999; justify-content: center; align-items: center;">
    <div class="modal-card" style="background: #2b2d31; border: 1px solid rgba(88, 101, 242, 0.4); border-radius: 16px; padding: 2rem; max-width: 480px; width: 92%; box-shadow: 0 25px 60px rgba(0,0,0,0.9); font-family: 'Inter', sans-serif;">
      
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="width: 64px; height: 64px; background: #5865F2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.8rem; box-shadow: 0 0 20px rgba(88, 101, 242, 0.6);">
          <i class="ph ph-discord-logo" style="font-size: 2.2rem; color: #fff;"></i>
        </div>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0;">Authorize MetaWiki</h3>
        <p style="font-size: 0.85rem; color: #b5bac1; margin-top: 0.4rem;">MetaWiki wants to connect with your Discord Account.</p>
      </div>

      <div style="background: #1e1f22; border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem; color: #dbdee1;">
        <div style="font-weight: bold; color: #949ba4; text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.5px; margin-bottom: 0.6rem;">This will allow MetaWiki to:</div>
        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;"><i class="ph ph-check" style="color: #23a55a;"></i> Access your Discord Username & Avatar</div>
        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;"><i class="ph ph-check" style="color: #23a55a;"></i> Sync Seeker Roles based on Hawkins LoC</div>
        <div style="display: flex; align-items: center; gap: 0.6rem;"><i class="ph ph-check" style="color: #23a55a;"></i> Attribute edit proposals to your handle</div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label for="discordInputUsername" style="font-size: 0.8rem; color: #b5bac1; font-weight: bold; display: block; margin-bottom: 0.4rem;">Enter your Discord Username:</label>
        <input type="text" id="discordInputUsername" value="GnosticSeeker" placeholder="e.g. GnosticSeeker" style="width: 100%; padding: 0.65rem 0.9rem; background: #1e1f22; border: 1px solid #383a40; border-radius: 8px; color: #fff; outline: none; font-size: 0.9rem;">
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.8rem;">
        <button id="cancelDiscordAuthBtn" style="padding: 0.65rem 1.4rem; background: transparent; border: none; color: #b5bac1; border-radius: 8px; cursor: pointer; font-size: 0.88rem; font-weight: 600;">Cancel</button>
        <button id="authorizeDiscordAuthBtn" style="padding: 0.65rem 1.8rem; background: #5865F2; color: #fff; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; font-size: 0.88rem; box-shadow: 0 4px 15px rgba(88, 101, 242, 0.4);">Authorize & Connect ➔</button>
      </div>

    </div>
  </div>
`;

if (!html.includes('id="discordAuthModal"')) {
  html = html.replace('</body>', discordModalHTML + '\n</body>');
}

fs.writeFileSync('index.html', html, 'utf-8');
console.log('Successfully updated index.html with Discord floating bubble & authorization modal!');
