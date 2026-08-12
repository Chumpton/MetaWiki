const fs = require('fs');

// 1. Update app.js inside loadArticle function
let appCode = fs.readFileSync('app.js', 'utf8');

const oldMainTextCode = `    // Render Main Content HTML
    const mainText = document.getElementById('articleMainText');
    if (mainText) {
      mainText.innerHTML = article.contentHTML;
    }`;

const newMainTextCode = `    // Render Main Content HTML
    const mainText = document.getElementById('articleMainText');
    if (mainText) {
      const suggestEditBubbleHTML = \`
        <div class="article-suggest-edit-container" style="margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.2); text-align: center;">
          <button id="bottomSuggestEditBtn" class="suggest-edit-bubble-btn">
            <i class="ph ph-pencil-simple-line" style="font-size: 1.2rem;"></i> <span>Suggest an Edit or Ascension Revision</span>
          </button>
        </div>
      \`;
      mainText.innerHTML = article.contentHTML + suggestEditBubbleHTML;

      const bottomBtn = document.getElementById('bottomSuggestEditBtn');
      if (bottomBtn) {
        bottomBtn.addEventListener('click', () => {
          const modal = document.getElementById('suggestEditModal');
          if (modal) {
            modal.style.display = 'flex';
            const topicInput = modal.querySelector('input[type="text"]');
            if (topicInput) topicInput.value = article.title;
          }
        });
      }
    }`;

if (appCode.includes(oldMainTextCode)) {
  appCode = appCode.replace(oldMainTextCode, newMainTextCode);
  fs.writeFileSync('app.js', appCode, 'utf-8');
  console.log('Successfully added bottom Suggest Edit bubble button to app.js!');
} else {
  console.error('Target mainText code block not found in app.js');
}

// 2. Append CSS style to styles.css
const bubbleCss = `
/* =========================================================================
   BOTTOM ARTICLE SUGGEST EDIT BUBBLE BUTTON STYLES
   ========================================================================= */

.suggest-edit-bubble-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.18), rgba(168, 85, 247, 0.18));
  backdrop-filter: blur(15px);
  border: 1px solid var(--mw-border-gold);
  border-radius: 40px;
  color: #ffffff;
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.suggest-edit-bubble-btn:hover {
  background: var(--mw-gold);
  color: #000000;
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 12px 35px rgba(251, 191, 36, 0.5);
}
`;

let css = fs.readFileSync('styles.css', 'utf8');
fs.writeFileSync('styles.css', css.trim() + '\n\n' + bubbleCss, 'utf8');
console.log('Successfully appended Suggest Edit bubble button CSS to styles.css!');
