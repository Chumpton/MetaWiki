const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Move #guidesFeedSection and #forumsFeedSection inside #initiatoryPortalView (before closing </div></div>)
const oldPortalEnd = `      <!-- Load More Button Container -->
      <div style="text-align: center; margin-top: 3rem; margin-bottom: 4rem;" id="loadMoreContainer">
        <button id="loadMoreFeedBtn" class="load-more-feed-btn" style="border: none;">
          <span>Load More Contemplations ➔</span>
        </button>
      </div>

    </div>
  </div>`;

const newPortalEnd = `      <!-- Load More Button Container -->
      <div style="text-align: center; margin-top: 3rem; margin-bottom: 4rem;" id="loadMoreContainer">
        <button id="loadMoreFeedBtn" class="load-more-feed-btn" style="border: none;">
          <span>Load More Contemplations ➔</span>
        </button>
      </div>

      <!-- 2. PRACTICAL GUIDES & INITIATION ROADMAPS FEED -->
      <div class="portal-sections-container" id="guidesFeedSection" style="border: none; margin-top: 3rem;">
        <div class="feed-title-main" style="margin-bottom: 1.5rem;">
          <i class="ph ph-compass-tool" style="color: var(--mw-gold); font-size: 1.8rem;"></i>
          <h2 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: #fff; margin: 0;">Practical Guides & Initiation Roadmaps</h2>
          <span class="feed-count-badge">8 Practical Guides</span>
        </div>

        <div class="triadic-grid" id="guidesFeedGrid" style="margin-top: 1.5rem;">
          <!-- Rendered dynamically -->
        </div>
        <div style="text-align: center; margin-top: 2rem; margin-bottom: 2rem;" id="loadMoreGuidesContainer">
          <button id="loadMoreGuidesBtn" class="load-more-feed-btn" style="border: none;">
            <span>Show More Guides ➔</span>
          </button>
        </div>
      </div>

      <!-- 3. COMMUNITY FORUMS & SEEKER DISCUSSIONS FEED -->
      <div class="portal-sections-container" id="forumsFeedSection" style="border: none; margin-top: 3rem; margin-bottom: 5rem;">
        <div class="feed-title-row" style="margin-bottom: 1.5rem;">
          <div class="feed-title-main">
            <i class="ph ph-chats-circle" style="color: var(--mw-violet); font-size: 1.8rem;"></i>
            <h2 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: #fff; margin: 0;">Community Forums & Seeker Discussions</h2>
            <span class="feed-count-badge" style="background: rgba(168,85,247,0.15); color: var(--mw-violet); border-color: var(--mw-border-violet);">Live Discussions</span>
          </div>

          <button class="customize-interests-btn" id="openCreateForumTopicBtn" style="border: none; background: rgba(99, 102, 241, 0.2); color: #93c5fd;">
            <i class="ph ph-plus-circle"></i> <span>Start New Discussion</span>
          </button>
        </div>

        <div class="forum-topics-grid" id="forumsFeedGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
          <!-- Rendered dynamically -->
        </div>
        <div style="text-align: center; margin-top: 2rem; margin-bottom: 3rem;" id="loadMoreForumsContainer">
          <button id="loadMoreForumsBtn" class="load-more-feed-btn" style="border: none;">
            <span>Show More Discussions ➔</span>
          </button>
        </div>
      </div>

    </div>
  </div>`;

// Remove outer duplicate guidesFeedSection and forumsFeedSection
const outerFeedsPattern = /<!-- 2\. PRACTICAL GUIDES[\s\S]*?<!-- 3\. COMMUNITY FORUMS[\s\S]*?<\/div>\s*<\/div>/g;

if (html.includes(oldPortalEnd)) {
  html = html.replace(oldPortalEnd, newPortalEnd);
  // Remove the old outer duplicate block if present
  html = html.replace(outerFeedsPattern, '');
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully moved Guides and Forums feeds inside #initiatoryPortalView in index.html!');
} else {
  console.log('oldPortalEnd pattern not matched in index.html');
}
