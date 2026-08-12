const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

const topbarRegex = /<!-- Top Article Header -->[\s\S]*?<\/header>/g;
if (topbarRegex.test(html)) {
  html = html.replace(topbarRegex, '<!-- Top Article Header Removed -->');
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully removed topbar header from index.html!');
} else {
  console.log('Topbar header not found in index.html');
}

// 2. Hide in styles.css defensively
let css = fs.readFileSync('styles.css', 'utf8');
const hideCss = `
.mw-article-topbar {
  display: none !important;
}
`;

fs.writeFileSync('styles.css', css.trim() + '\n\n' + hideCss, 'utf8');
console.log('Successfully added display:none rule for .mw-article-topbar in styles.css!');
