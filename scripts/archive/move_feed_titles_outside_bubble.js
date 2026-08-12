const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Guides Section Header Update
const oldGuidesHeader = `<div class="feed-header-wrapper" style="border: none;">
          <div class="feed-title-row">
            <div class="feed-title-main">
              <i class="ph ph-compass-tool" style="color: var(--mw-gold); font-size: 1.6rem;"></i>
              <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0;">Practical Guides & Initiation Roadmaps</h2>
              <span class="feed-count-badge">8 Practical Guides</span>
            </div>
          </div>
        </div>`;

const newGuidesHeader = `<div class="feed-title-main" style="margin-bottom: 1.5rem;">
          <i class="ph ph-compass-tool" style="color: var(--mw-gold); font-size: 1.8rem;"></i>
          <h2 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: #fff; margin: 0;">Practical Guides & Initiation Roadmaps</h2>
          <span class="feed-count-badge">8 Practical Guides</span>
        </div>`;

if (html.includes(oldGuidesHeader)) {
  html = html.replace(oldGuidesHeader, newGuidesHeader);
}

// 2. Forums Section Header Update
const oldForumsHeader = `<div class="feed-header-wrapper" style="border: none;">
          <div class="feed-title-row">
            <div class="feed-title-main">
              <i class="ph ph-chats-circle" style="color: var(--mw-violet); font-size: 1.6rem;"></i>
              <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0;">Community Forums & Seeker Discussions</h2>
              <span class="feed-count-badge" style="background: rgba(168,85,247,0.15); color: var(--mw-violet); border-color: var(--mw-border-violet);">Live Discussions</span>
            </div>

            <button class="customize-interests-btn" id="openCreateForumTopicBtn" style="border: none; background: rgba(99, 102, 241, 0.2); color: #93c5fd;">
              <i class="ph ph-plus-circle"></i> <span>Start New Discussion</span>
            </button>
          </div>
        </div>`;

const newForumsHeader = `<div class="feed-title-row" style="margin-bottom: 1.5rem;">
          <div class="feed-title-main">
            <i class="ph ph-chats-circle" style="color: var(--mw-violet); font-size: 1.8rem;"></i>
            <h2 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: #fff; margin: 0;">Community Forums & Seeker Discussions</h2>
            <span class="feed-count-badge" style="background: rgba(168,85,247,0.15); color: var(--mw-violet); border-color: var(--mw-border-violet);">Live Discussions</span>
          </div>

          <button class="customize-interests-btn" id="openCreateForumTopicBtn" style="border: none; background: rgba(99, 102, 241, 0.2); color: #93c5fd;">
            <i class="ph ph-plus-circle"></i> <span>Start New Discussion</span>
          </button>
        </div>`;

if (html.includes(oldForumsHeader)) {
  html = html.replace(oldForumsHeader, newForumsHeader);
}

fs.writeFileSync('index.html', html, 'utf-8');
console.log('Successfully moved section headers outside container bubbles in index.html!');
