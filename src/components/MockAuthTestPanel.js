/**
 * MetaWiki - Mock Login Test Environment & Developer Panel
 * Provides a floating test widget to switch mock accounts, test guest vs authenticated states,
 * inspect session tokens, and view Supabase integration readiness.
 */

(function (window) {
  'use strict';

  function initMockAuthTestPanel() {
    // Disabled as requested: Remove bottom left mock auth test lab
    return;

    const container = document.createElement('div');
    container.id = 'mockAuthTestWidgetContainer';
    container.innerHTML = `
      <!-- FLOATING TEST LAB LAUNCHER BUTTON (BOTTOM-LEFT) -->
      <button id="mockAuthTestToggle" style="position: fixed; bottom: 20px; left: 20px; z-index: 9999; padding: 0.55rem 0.9rem; background: rgba(15, 23, 42, 0.9); border: 1px solid var(--mw-gold); color: var(--mw-gold); border-radius: 30px; font-weight: 800; font-size: 0.78rem; font-family: var(--font-heading); cursor: pointer; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 8px 24px rgba(0,0,0,0.5); backdrop-filter: blur(8px);">
        <span>🧪 Mock Auth Test Lab</span>
        <span id="mockAuthStatusDot" style="width: 8px; height: 8px; border-radius: 50%; background: #94a3b8; display: inline-block;"></span>
      </button>

      <!-- EXPANDABLE MOCK AUTH TEST PANEL -->
      <div id="mockAuthTestPanel" style="display: none; position: fixed; bottom: 70px; left: 20px; z-index: 9999; width: 340px; background: rgba(10, 10, 15, 0.95); border: 1px solid var(--mw-border-gold); border-radius: 12px; padding: 1.1rem; box-shadow: 0 12px 32px rgba(0,0,0,0.8); backdrop-filter: blur(12px); font-family: var(--font-sans-wiki);">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; border-bottom: 1px solid var(--mw-border); padding-bottom: 0.5rem;">
          <div style="font-weight: 800; font-size: 0.9rem; color: var(--mw-gold); display: flex; align-items: center; gap: 0.4rem;">
            <i class="ph ph-flask"></i> Mock Auth Test Environment
          </div>
          <button id="closeMockAuthPanelBtn" style="background: none; border: none; color: var(--mw-text-muted); cursor: pointer; font-size: 1.1rem;">✕</button>
        </div>

        <div style="margin-bottom: 0.85rem;">
          <label style="font-size: 0.75rem; color: var(--mw-text-muted); display: block; margin-bottom: 0.3rem;">Switch Active Mock Account:</label>
          <select id="mockAccountPresetSelect" style="width: 100%; padding: 0.55rem; background: rgba(0,0,0,0.6); border: 1px solid var(--mw-border); border-radius: 6px; color: #fff; font-size: 0.82rem; cursor: pointer;">
            <option value="guest">⚪ Unauthenticated Guest (Sign Out)</option>
            <option value="hermetic_seeker">🔮 Hermetic Initiate (LoC 540)</option>
            <option value="nondual_observer">☸️ Non-Dual Observer (LoC 600)</option>
            <option value="ascended_luminary">✨ Ascended Luminary (LoC 700)</option>
          </select>
        </div>

        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.85rem;">
          <button id="mockLoginModalBtn" style="flex: 1; padding: 0.45rem; background: #5865F2; color: #fff; border: none; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
            <i class="ph ph-discord-logo"></i> Open Discord Modal
          </button>
          <button id="mockSignOutBtn" style="padding: 0.45rem 0.8rem; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer;">
            Sign Out
          </button>
        </div>

        <!-- ACTIVE SESSION JSON PAYLOAD INSPECTOR -->
        <div style="margin-bottom: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--mw-text-muted);">Active Session Payload:</span>
            <span id="mockProviderBadge" style="font-size: 0.68rem; font-weight: 800; background: rgba(88, 101, 242, 0.2); color: #818cf8; padding: 0.1rem 0.4rem; border-radius: 4px;">Provider: Discord</span>
          </div>
          <pre id="mockSessionJson" style="max-height: 110px; overflow-y: auto; background: #000; border: 1px solid var(--mw-border); padding: 0.5rem; border-radius: 6px; font-size: 0.7rem; color: #4ade80; margin: 0; font-family: monospace; white-space: pre-wrap;">No active session (Guest)</pre>
        </div>

        <!-- SUPABASE INTEGRATION READINESS BADGE -->
        <div style="padding: 0.5rem; background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 6px; font-size: 0.72rem; color: #4ade80; display: flex; align-items: center; gap: 0.4rem;">
          <i class="ph ph-lightning"></i> Supabase Auth Adapter Ready (Extensible)
        </div>
      </div>
    `;

    document.body.appendChild(container);

    const toggleBtn = document.getElementById('mockAuthTestToggle');
    const panel = document.getElementById('mockAuthTestPanel');
    const closeBtn = document.getElementById('closeMockAuthPanelBtn');
    const presetSelect = document.getElementById('mockAccountPresetSelect');
    const openModalBtn = document.getElementById('mockLoginModalBtn');
    const signOutBtn = document.getElementById('mockSignOutBtn');
    const statusDot = document.getElementById('mockAuthStatusDot');
    const sessionJson = document.getElementById('mockSessionJson');

    function updatePanelUI() {
      const auth = window.METAWIKI_AUTH;
      const session = auth ? auth.getSession() : null;

      if (session) {
        if (statusDot) statusDot.style.background = '#4ade80';
        if (sessionJson) sessionJson.textContent = JSON.stringify(session, null, 2);

        if (presetSelect) {
          if (session.username === 'HermeticSeeker') presetSelect.value = 'hermetic_seeker';
          else if (session.username === 'NonDualObserver') presetSelect.value = 'nondual_observer';
          else if (session.username === 'AscendedLuminary') presetSelect.value = 'ascended_luminary';
          else presetSelect.value = 'ascended_luminary';
        }
      } else {
        if (statusDot) statusDot.style.background = '#94a3b8';
        if (sessionJson) sessionJson.textContent = 'No active session (Guest)';
        if (presetSelect) presetSelect.value = 'guest';
      }
    }

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        updatePanelUI();
      });
    }

    if (closeBtn && panel) {
      closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });
    }

    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (window.METAWIKI_AUTH) {
          window.METAWIKI_AUTH.loginMockPreset(val);
          updatePanelUI();
        }
      });
    }

    if (openModalBtn && window.METAWIKI_DISCORD_BACKEND) {
      openModalBtn.addEventListener('click', () => {
        window.METAWIKI_DISCORD_BACKEND.openModal();
      });
    }

    if (signOutBtn && window.METAWIKI_AUTH) {
      signOutBtn.addEventListener('click', () => {
        window.METAWIKI_AUTH.logout();
        updatePanelUI();
      });
    }

    window.addEventListener('metawiki_auth_changed', updatePanelUI);
    updatePanelUI();
  }

  window.initMockAuthTestPanel = initMockAuthTestPanel;

})(window);
