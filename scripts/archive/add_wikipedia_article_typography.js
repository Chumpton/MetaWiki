const fs = require('fs');

const wikiTypographyCss = `
/* =========================================================================
   AUTHENTIC WIKIPEDIA ARTICLE TYPOGRAPHY & SECTION DIVIDERS
   ========================================================================= */

#articleMainText {
  font-family: var(--font-sans-wiki, 'Inter', -apple-system, sans-serif);
  font-size: 1.05rem;
  line-height: 1.85;
  color: var(--mw-text-main, #e2e8f0);
}

#articleMainText h2 {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin-top: 3rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  clear: none;
}

#articleMainText h2 .mw-headline {
  position: relative;
  display: inline-block;
}

#articleMainText h2 .mw-headline::after {
  content: '';
  position: absolute;
  bottom: -0.65rem;
  left: 0;
  width: 80px;
  height: 2px;
  background: var(--mw-gold);
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
}

#articleMainText h3 {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--mw-gold);
  margin-top: 2rem;
  margin-bottom: 0.85rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
}

#articleMainText p {
  font-size: 1.05rem;
  line-height: 1.85;
  margin-bottom: 1.6rem;
  color: #e2e8f0;
  letter-spacing: 0.01em;
}

#articleMainText hr,
.article-section-divider {
  border: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.5) 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
  margin: 3rem 0;
}

#articleMainText ul, 
#articleMainText ol {
  margin-bottom: 1.6rem;
  padding-left: 2rem;
  line-height: 1.8;
}

#articleMainText li {
  margin-bottom: 0.5rem;
}

#articleMainText blockquote {
  border-left: 4px solid var(--mw-gold);
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  background: rgba(251, 191, 36, 0.05);
  border-radius: 0 12px 12px 0;
  font-style: italic;
  color: #cbd5e1;
}

/* Wikipedia Infobox Clear & Floating */
.infobox {
  float: right;
  width: 340px;
  background: rgba(16, 16, 24, 0.95);
  backdrop-filter: blur(25px);
  border: 1px solid var(--mw-border-gold);
  border-radius: 16px;
  padding: 1.25rem;
  margin: 0 0 2rem 2.5rem;
  font-size: 0.9rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
}

.infobox-title {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffffff;
  text-align: center;
  border-bottom: 1px solid var(--mw-border);
  padding-bottom: 0.6rem;
  margin-bottom: 1rem;
}
`;

let css = fs.readFileSync('styles.css', 'utf8');
fs.writeFileSync('styles.css', css.trim() + '\n\n' + wikiTypographyCss, 'utf8');
console.log('Successfully appended Wikipedia section dividers and article typography styles to styles.css!');
