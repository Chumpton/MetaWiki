const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const modalsHTML = `
  <!-- FORUM THREAD READER & LIVE REPLY MODAL -->
  <div id="forumThreadModal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 99999; justify-content: center; align-items: center; padding: 1.5rem;">
    <div class="modal-card" style="background: rgba(18, 18, 26, 0.98); border: 1px solid var(--mw-border-gold); border-radius: 18px; max-width: 720px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 30px 70px rgba(0,0,0,0.95);">
      
      <!-- Thread Header -->
      <div style="padding: 1.5rem 1.8rem; background: rgba(10, 10, 14, 0.6); border-bottom: 1px solid var(--mw-border); display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
            <span class="forum-category-pill" id="threadCategoryPill" style="font-size: 0.72rem; font-weight: 800; padding: 0.25rem 0.65rem; border-radius: 20px; background: rgba(168, 85, 247, 0.15); color: var(--mw-violet); border: 1px solid var(--mw-border-violet);">Category</span>
            <span style="font-size: 0.75rem; color: var(--mw-text-muted);" id="threadTime">2 hours ago</span>
          </div>
          <h2 id="threadTitle" style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: #fff; margin: 0; line-height: 1.3;">Topic Title</h2>
        </div>
        <i class="ph ph-x" id="closeForumThreadModalBtn" style="cursor: pointer; font-size: 1.5rem; color: var(--mw-text-muted); flex-shrink: 0; margin-left: 1rem;"></i>
      </div>

      <!-- Thread Content Body & Replies (Scrollable) -->
      <div style="flex: 1; padding: 1.8rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Original Post (OP) -->
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--mw-border); border-radius: 14px; padding: 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <img src="" id="threadAuthorAvatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--mw-border-gold);" alt="Author">
              <span id="threadAuthorName" style="font-weight: 700; color: #e2e8f0; font-size: 0.9rem;">AuthorHandle</span>
            </div>
            <button id="upvoteThreadBtn" class="upvote-btn" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.8rem; background: rgba(251, 191, 36, 0.15); border: 1px solid var(--mw-border-gold); color: var(--mw-gold); border-radius: 20px; cursor: pointer; font-size: 0.8rem; font-weight: 800;">
              <i class="ph ph-thumbs-up"></i> <span id="threadUpvoteCount">24</span> Upvotes
            </button>
          </div>
          <p id="threadBody" style="font-size: 0.95rem; line-height: 1.65; color: #cbd5e1; margin: 0;">Original post body text...</p>
        </div>

        <!-- Replies Section Heading -->
        <div style="font-family: var(--font-heading); font-size: 1rem; font-weight: 800; color: var(--mw-gold); display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--mw-border); padding-bottom: 0.4rem;">
          <i class="ph ph-chat-circle-text"></i> <span id="threadRepliesHeaderCount">Replies (0)</span>
        </div>

        <!-- Replies Container -->
        <div id="threadRepliesContainer" style="display: flex; flex-direction: column; gap: 1rem;">
          <!-- Rendered dynamically -->
        </div>

      </div>

      <!-- Live Reply Input Box Footer -->
      <div style="padding: 1.25rem 1.8rem; background: rgba(10, 10, 14, 0.9); border-top: 1px solid var(--mw-border); display: flex; gap: 0.8rem; align-items: center;">
        <textarea id="threadReplyInput" placeholder="Write your contemplative response or insight..." rows="2" style="flex: 1; padding: 0.75rem 1rem; background: rgba(18, 18, 26, 0.9); border: 1px solid var(--mw-border); border-radius: 10px; color: #fff; font-family: var(--font-sans-wiki); outline: none; font-size: 0.9rem; resize: none;"></textarea>
        <button id="submitThreadReplyBtn" style="padding: 0.75rem 1.4rem; background: var(--mw-gold); color: #000; font-weight: 800; border: none; border-radius: 10px; cursor: pointer; font-family: var(--font-heading); font-size: 0.88rem; flex-shrink: 0;">Post Reply ➔</button>
      </div>

    </div>
  </div>

  <!-- START NEW FORUM DISCUSSION MODAL -->
  <div id="createForumModal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 99999; justify-content: center; align-items: center;">
    <div class="modal-card" style="background: rgba(18, 18, 24, 0.98); border: 1px solid var(--mw-border-gold); border-radius: 16px; padding: 2rem; max-width: 580px; width: 92%; box-shadow: 0 25px 60px rgba(0,0,0,0.9);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
        <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: #fff; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
          <i class="ph ph-chats-circle" style="color: var(--mw-violet);"></i> Start New Seeker Discussion
        </h3>
        <i class="ph ph-x" id="closeCreateForumModalBtn" style="cursor: pointer; font-size: 1.4rem; color: var(--mw-text-muted);"></i>
      </div>

      <div style="margin-bottom: 1.2rem;">
        <label for="newTopicCategory" style="font-size: 0.8rem; color: var(--mw-text-muted); font-weight: 700; display: block; margin-bottom: 0.4rem;">Select Discussion Category:</label>
        <select id="newTopicCategory" style="width: 100%; padding: 0.65rem 0.9rem; background: rgba(10, 8, 20, 0.9); border: 1px solid var(--mw-border); border-radius: 8px; color: #fff; font-family: var(--font-heading); outline: none; font-size: 0.9rem;">
          <option value="Comparative Theology">⛩️ Comparative Theology</option>
          <option value="Gnosticism & Mysticism">✝️ Gnosticism & Mysticism</option>
          <option value="Kabbalah">✡️ Kabbalah</option>
          <option value="Advaita & Zen">☸️ Advaita & Zen</option>
          <option value="Hermeticism & Alchemy">🪶 Hermeticism & Alchemy</option>
          <option value="Depth Psychology">🧠 Depth Psychology</option>
        </select>
      </div>

      <div style="margin-bottom: 1.2rem;">
        <label for="newTopicTitle" style="font-size: 0.8rem; color: var(--mw-text-muted); font-weight: 700; display: block; margin-bottom: 0.4rem;">Discussion Title:</label>
        <input type="text" id="newTopicTitle" placeholder="e.g. Realizing the Uncreated Light in Daily Life" style="width: 100%; padding: 0.75rem 1rem; background: rgba(10, 8, 20, 0.9); border: 1px solid var(--mw-border); border-radius: 8px; color: #fff; outline: none; font-size: 0.95rem;">
      </div>

      <div style="margin-bottom: 1.8rem;">
        <label for="newTopicBody" style="font-size: 0.8rem; color: var(--mw-text-muted); font-weight: 700; display: block; margin-bottom: 0.4rem;">Discussion Post Body:</label>
        <textarea id="newTopicBody" rows="5" placeholder="Share your metaphysical inquiry, contemplative experience, or philosophical question..." style="width: 100%; padding: 0.75rem 1rem; background: rgba(10, 8, 20, 0.9); border: 1px solid var(--mw-border); border-radius: 8px; color: #fff; font-family: var(--font-sans-wiki); outline: none; font-size: 0.9rem; resize: vertical;"></textarea>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.8rem;">
        <button id="cancelCreateTopicBtn" style="padding: 0.65rem 1.4rem; background: transparent; border: 1px solid var(--mw-border); color: #fff; border-radius: 8px; cursor: pointer; font-size: 0.85rem;">Cancel</button>
        <button id="publishNewTopicBtn" style="padding: 0.65rem 1.8rem; background: var(--mw-gold); color: #000; font-weight: 800; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-family: var(--font-heading);">Publish Discussion ➔</button>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="forumThreadModal"')) {
  html = html.replace('</body>', modalsHTML + '\n</body>');
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully added Forum Modals to index.html!');
}
