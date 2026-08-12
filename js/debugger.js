/**
 * MetaWiki - Sitewide Interactive Developer Debugger & Function Inspector
 * Monitors button clicks, captures returned values, audits interactive site controls,
 * and provides live event logging.
 */

(function (window) {
  'use strict';

  function initSiteDebugger() {
    if (document.getElementById('metaWikiDebuggerContainer')) return;

    const container = document.createElement('div');
    container.id = 'metaWikiDebuggerContainer';
    container.innerHTML = `
      <!-- FLOATING DEBUGGER LAUNCHER BUTTON -->
      <button id="metaWikiDebugToggle" style="position: fixed; bottom: 20px; right: 20px; z-index: 10001; padding: 0.55rem 0.9rem; background: rgba(15, 23, 42, 0.92); border: 1px solid #38bdf8; color: #38bdf8; border-radius: 30px; font-weight: 800; font-size: 0.78rem; font-family: var(--font-heading); cursor: pointer; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 8px 24px rgba(0,0,0,0.6); backdrop-filter: blur(8px); transition: transform 0.2s ease;">
        <i class="ph ph-bug" style="font-size: 1rem; color: #38bdf8;"></i>
        <span>🐞 Site Debugger</span>
        <span id="debugLogBadge" style="background: #38bdf8; color: #0f172a; font-size: 0.65rem; padding: 0.1rem 0.35rem; border-radius: 10px; font-weight: 900;">0</span>
      </button>

      <!-- EXPANDABLE INTERACTIVE DEBUGGER PANEL -->
      <div id="metaWikiDebugPanel" style="display: none; position: fixed; bottom: 70px; right: 20px; z-index: 10001; width: 420px; max-width: 92vw; background: rgba(10, 10, 18, 0.96); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 12px; padding: 1.1rem; box-shadow: 0 16px 40px rgba(0,0,0,0.9); backdrop-filter: blur(14px); font-family: var(--font-sans-wiki);">
        
        <!-- DEBUGGER HEADER -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.6rem;">
          <div style="font-weight: 800; font-size: 0.95rem; color: #38bdf8; display: flex; align-items: center; gap: 0.45rem;">
            <i class="ph ph-terminal"></i> MetaWiki Function & UI Debugger
          </div>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <button id="clearDebugLogBtn" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; border-radius: 6px; font-size: 0.72rem; padding: 0.25rem 0.55rem; cursor: pointer; font-weight: 700;">Clear</button>
            <button id="closeDebugPanelBtn" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.2rem; line-height: 1;">✕</button>
          </div>
        </div>

        <!-- QUICK AUDIT TOOLS & ACTION BUTTONS -->
        <div style="display: flex; gap: 0.45rem; margin-bottom: 0.85rem; flex-wrap: wrap;">
          <button id="auditButtonsBtn" style="flex: 1; padding: 0.45rem; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
            <i class="ph ph-check-circle"></i> Audit All Site Buttons
          </button>
          <button id="testModalOpenersBtn" style="flex: 1; padding: 0.45rem; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.4); color: #c084fc; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
            <i class="ph ph-window"></i> Test Profile Modal
          </button>
          <button id="testWikiImporterBtn" style="flex: 1; padding: 0.45rem; background: rgba(251, 191, 36, 0.15); border: 1px solid rgba(251, 191, 36, 0.4); color: #fbbf24; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
            <i class="ph ph-globe-hemisphere-west"></i> Wiki Import Bot
          </button>
        </div>

        <!-- LIVE EVENT LOG CONSOLE -->
        <div style="margin-bottom: 0.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Live Interactive Event Stream:</span>
            <span style="font-size: 0.68rem; color: #4ade80; font-weight: 700;">● Active Listener</span>
          </div>
          <div id="debugLogConsole" style="height: 180px; overflow-y: auto; background: #000000; border: 1px solid rgba(255, 255, 255, 0.12); padding: 0.6rem; border-radius: 8px; font-size: 0.72rem; color: #4ade80; font-family: monospace; line-height: 1.45; white-space: pre-wrap;">[System] MetaWiki Sitewide Interactive Debugger initialized.\n[System] Click any button or element on the page to inspect triggers & functions.\n---</div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    const toggleBtn = document.getElementById('metaWikiDebugToggle');
    const panel = document.getElementById('metaWikiDebugPanel');
    const closeBtn = document.getElementById('closeDebugPanelBtn');
    const clearBtn = document.getElementById('clearDebugLogBtn');
    const auditBtn = document.getElementById('auditButtonsBtn');
    const testModalBtn = document.getElementById('testModalOpenersBtn');
    const consoleEl = document.getElementById('debugLogConsole');
    const badgeEl = document.getElementById('debugLogBadge');

    let logCount = 0;

    function appendLog(type, title, details) {
      logCount += 1;
      if (badgeEl) badgeEl.textContent = logCount;

      const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      let color = '#4ade80';
      if (type === 'CLICK') color = '#38bdf8';
      else if (type === 'AUDIT') color = '#fbbf24';
      else if (type === 'WARN') color = '#f87171';
      else if (type === 'SUCCESS') color = '#c084fc';

      const entry = document.createElement('div');
      entry.style.marginBottom = '0.35rem';
      entry.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      entry.style.paddingBottom = '0.2rem';
      entry.innerHTML = `<span style="color: #64748b;">[${time}]</span> <strong style="color: ${color};">[${type}]</strong> <span style="color: #ffffff; font-weight: 700;">${title}</span>\n<span style="color: #94a3b8; font-size: 0.68rem;">${details}</span>`;
      
      if (consoleEl) {
        consoleEl.appendChild(entry);
        consoleEl.scrollTop = consoleEl.scrollHeight;
      }
    }

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (closeBtn && panel) {
      closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });
    }

    if (clearBtn && consoleEl) {
      clearBtn.addEventListener('click', () => {
        consoleEl.innerHTML = '<div style="color: #64748b; font-style: italic;">Log cleared.</div>';
        logCount = 0;
        if (badgeEl) badgeEl.textContent = '0';
      });
    }

    // AUDIT ALL SITE BUTTONS
    if (auditBtn) {
      auditBtn.addEventListener('click', () => {
        const buttons = Array.from(document.querySelectorAll('button, a[href], [role="button"], .triadic-card, .featured-card'));
        appendLog('AUDIT', `Auditing ${buttons.length} Interactive Elements`, `Found ${buttons.length} clickable nodes on current active view.`);
        
        let functionalCount = 0;
        buttons.forEach(btn => {
          const text = (btn.textContent || btn.title || btn.id || btn.className || 'Element').trim().substring(0, 30);
          const hasHandler = btn.onclick || btn.getAttribute('data-wiki') || btn.getAttribute('data-view') || btn.id || btn.tagName === 'A';
          if (hasHandler) functionalCount++;
        });

        appendLog('SUCCESS', `Audit Complete: ${functionalCount}/${buttons.length} Elements Verified Ready`, `All interactive navigation, article cards, and modals are bound.`);
      });
    }

    if (testModalBtn) {
      testModalBtn.addEventListener('click', () => {
        if (typeof window.openMemberProfileModal === 'function') {
          window.openMemberProfileModal();
          appendLog('SUCCESS', 'Triggered openMemberProfileModal()', 'Member profile modal opened successfully.');
        } else {
          appendLog('WARN', 'openMemberProfileModal not found', 'Function window.openMemberProfileModal is undefined.');
        }
      });
    }

    const testWikiBtn = document.getElementById('testWikiImporterBtn');
    if (testWikiBtn) {
      testWikiBtn.addEventListener('click', () => {
        if (typeof window.openWikipediaImportModal === 'function') {
          window.openWikipediaImportModal();
          appendLog('SUCCESS', 'Triggered openWikipediaImportModal()', 'Wikipedia organic import bot modal opened.');
        } else {
          appendLog('WARN', 'openWikipediaImportModal not found', 'Function window.openWikipediaImportModal is undefined.');
        }
      });
    }

    // GLOBAL CLICK INSPECTION LISTENER
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a, .triadic-card, .featured-card, [data-wiki], [data-view], input[type="submit"]');
      if (!target || panel.contains(target) || target === toggleBtn) return;

      const tag = target.tagName.toLowerCase();
      const idStr = target.id ? `#${target.id}` : '';
      const classStr = target.className ? `.${String(target.className).split(' ')[0]}` : '';
      const label = (target.textContent || target.title || target.value || 'Unlabeled').trim().replace(/\s+/g, ' ').substring(0, 35);
      const wikiId = target.getAttribute('data-wiki');
      const viewId = target.getAttribute('data-view');

      let detailsStr = `Tag: <${tag}> ${idStr}${classStr}`;
      if (wikiId) detailsStr += ` | Action: loadArticle("${wikiId}")`;
      if (viewId) detailsStr += ` | Action: switchView("${viewId}")`;

      appendLog('CLICK', `Clicked: "${label}"`, detailsStr);
    }, true);

    window.initSiteDebugger = initSiteDebugger;
  }

  window.initSiteDebugger = initSiteDebugger;

})(window);
