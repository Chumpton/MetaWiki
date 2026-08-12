/**
 * MetaWiki - Live Discord Community Chat Drawer Component
 */

(function(window) {
  'use strict';

  const MOCK_CHAT_MESSAGES = [
    { user: 'HermeticSeeker#7777', text: 'Has anyone calibrated the Kybalion Principle of Rhythm against modern chaos theory?', time: '10:42 AM' },
    { user: 'GnosticAlchemist#3301', text: 'Yes! The fractal self-similarity of Mandelbrot sets directly mirrors the Law of Correspondence.', time: '10:45 AM' },
    { user: 'QuantumVedantin#1008', text: 'Advaita Vedanta holds that the observer and observed are one unified field at Hawkins LoC 700.', time: '10:48 AM' },
    { user: 'JungianAnalyst#2024', text: 'Active imagination allows the ego to dialog with the shadow archetype without inflation.', time: '10:52 AM' }
  ];

  function setupLiveCommunityChat() {
    const launcher = document.getElementById('liveChatLauncher');
    const drawer = document.getElementById('liveChatDrawer');
    const closeBtn = document.getElementById('closeLiveChatBtn');
    const messagesContainer = document.getElementById('liveChatMessages');
    const input = document.getElementById('liveChatInput');
    const sendBtn = document.getElementById('liveChatSendBtn');
    const unreadBadge = document.getElementById('chatUnreadBadge');

    function renderMessages() {
      if (!messagesContainer) return;
      messagesContainer.innerHTML = MOCK_CHAT_MESSAGES.map(m => `
        <div class="chat-msg">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="chat-msg-user">${m.user}</span>
            <span style="font-size: 0.68rem; color: var(--mw-text-muted);">${m.time}</span>
          </div>
          <div style="color: #e2e8f0; line-height: 1.4;">${m.text}</div>
        </div>
      `).join('');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    if (launcher && drawer) {
      launcher.addEventListener('click', () => {
        const isHidden = drawer.style.display === 'none' || !drawer.style.display;
        drawer.style.display = isHidden ? 'flex' : 'none';
        if (unreadBadge) unreadBadge.style.display = 'none';
        if (isHidden) renderMessages();
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => {
        drawer.style.display = 'none';
      });
    }

    function handleSend() {
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;

      const session = window.METAWIKI_DISCORD_BACKEND ? window.METAWIKI_DISCORD_BACKEND.getSession() : null;
      const userHandle = session ? session.fullHandle : 'GnosticSeeker#1008';

      MOCK_CHAT_MESSAGES.push({
        user: userHandle,
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      input.value = '';
      renderMessages();
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }

    // Emoji Bar
    document.querySelectorAll('.chat-emoji-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (input) {
          input.value += btn.getAttribute('data-emoji') || btn.textContent;
          input.focus();
        }
      });
    });

    renderMessages();
  }

  window.Drawer = {
    setupLiveCommunityChat
  };

  window.setupLiveCommunityChat = setupLiveCommunityChat;

})(window);
