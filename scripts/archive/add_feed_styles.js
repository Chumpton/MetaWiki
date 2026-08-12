const fs = require('fs');

const cssStyles = `
/* =========================================================================
   CATEGORY SELECT & PERSONALIZED 'FOR YOU' FEED SYSTEM STYLES
   ========================================================================= */

.feed-header-wrapper {
  background: rgba(18, 18, 26, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid var(--mw-border);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

.feed-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.feed-title-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.feed-count-badge {
  font-size: 0.78rem;
  font-weight: 800;
  background: rgba(251, 191, 36, 0.15);
  color: var(--mw-gold);
  border: 1px solid var(--mw-border-gold);
  padding: 0.2rem 0.7rem;
  border-radius: 12px;
  font-family: var(--font-heading);
}

.feed-actions-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.customize-interests-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  background: rgba(168, 85, 247, 0.15);
  color: #e2e8f0;
  border: 1px solid rgba(168, 85, 247, 0.4);
  border-radius: 10px;
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.customize-interests-btn:hover {
  background: rgba(168, 85, 247, 0.3);
  color: #fff;
  border-color: #a855f7;
  transform: translateY(-1px);
}

.feed-sort-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feed-sort-select {
  padding: 0.5rem 0.9rem;
  background: rgba(10, 8, 20, 0.9);
  border: 1px solid var(--mw-border);
  border-radius: 8px;
  color: #fff;
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
}

.feed-sort-select:focus {
  border-color: var(--mw-gold);
}

/* Scrollable Category Tabs Bar */
.category-tabs-bar {
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
  padding-bottom: 0.4rem;
  scrollbar-width: thin;
}

.category-tabs-bar::-webkit-scrollbar {
  height: 4px;
}
.category-tabs-bar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.cat-tab-btn {
  padding: 0.55rem 1.1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--mw-border);
  border-radius: 30px;
  color: var(--mw-text-muted);
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.cat-tab-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

.cat-tab-btn.active {
  background: var(--mw-gold);
  color: #000;
  border-color: var(--mw-gold);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
}

/* Interest Chips for Modal */
.interests-chip-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--mw-border);
  border-radius: 20px;
  color: var(--mw-text-muted);
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.interests-chip-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.interests-chip-btn.selected {
  background: rgba(251, 191, 36, 0.2);
  color: var(--mw-gold);
  border-color: var(--mw-border-gold);
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
}

/* Load More Button */
.load-more-feed-btn {
  padding: 0.85rem 2.2rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(168, 85, 247, 0.15));
  border: 1px solid var(--mw-border-gold);
  border-radius: 30px;
  color: #fff;
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 5px 20px rgba(0,0,0,0.5);
}

.load-more-feed-btn:hover {
  background: var(--mw-gold);
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
}
`;

let css = fs.readFileSync('styles.css', 'utf8');
fs.writeFileSync('styles.css', css.trim() + '\n\n' + cssStyles, 'utf8');
console.log('Successfully appended Feed System styles to styles.css!');
