const fs = require('fs');

const bubbleCss = `
/* =========================================================================
   BORDERLESS CATEGORY BUBBLE SPREAD CLOUD STYLES
   ========================================================================= */

.category-bubble-spread {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding: 0.5rem 0;
}

.cat-bubble-btn {
  padding: 0.65rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: none !important;
  border-radius: 40px;
  color: var(--mw-text-muted);
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.cat-bubble-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.25);
}

.cat-bubble-btn.active {
  background: linear-gradient(135deg, #fbbf24, #d97706);
  color: #000;
  font-weight: 800;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.5);
}

.hawkins-level-card {
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.hawkins-level-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 25px rgba(168, 85, 247, 0.3);
}
`;

let css = fs.readFileSync('styles.css', 'utf8');
fs.writeFileSync('styles.css', css.trim() + '\n\n' + bubbleCss, 'utf8');
console.log('Successfully appended borderless Category Bubble Spread styles to styles.css!');
