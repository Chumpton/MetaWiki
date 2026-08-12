const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

// Replace DOMContentLoaded wrapper with readyState-aware bootstrap helper
const oldStart = `document.addEventListener('DOMContentLoaded', () => {`;
const newStart = `function initMetaWikiApp() {`;

const oldEnd = `});\n`;
const newEnd = `}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMetaWikiApp);
} else {
  initMetaWikiApp();
}
`;

if (appCode.includes(oldStart)) {
  appCode = appCode.replace(oldStart, newStart);
  // Find last line of appCode and replace closing });
  const lastIndex = appCode.lastIndexOf('});');
  if (lastIndex !== -1) {
    appCode = appCode.substring(0, lastIndex) + newEnd;
  }
}

fs.writeFileSync('app.js', appCode, 'utf-8');
console.log('Successfully updated app.js with readyState-aware bootstrap helper!');
