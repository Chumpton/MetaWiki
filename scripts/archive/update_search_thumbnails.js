const fs = require('fs');

let appContent = fs.readFileSync('app.js', 'utf8');

const targetStr = `<strong style="color: var(--mw-gold); font-family: var(--font-heading); font-size: 0.95rem;">\${m.title}</strong>`;
const replaceStr = `\${m.infobox && m.infobox.imagePath ? \`<img src="\${m.infobox.imagePath}" alt="\${m.title}" referrerpolicy="no-referrer" style="width: 34px; height: 34px; object-fit: cover; border-radius: 6px; border: 1px solid var(--mw-border); flex-shrink: 0; margin-right: 0.6rem;">\` : ''}<strong style="color: var(--mw-gold); font-family: var(--font-heading); font-size: 0.95rem;">\${m.title}</strong>`;

if (appContent.includes(targetStr)) {
  appContent = appContent.replace(targetStr, replaceStr);
  fs.writeFileSync('app.js', appContent, 'utf-8');
  console.log('Successfully added authentic Wikipedia thumbnails to search results!');
} else {
  console.log('Target search string not found in app.js');
}
