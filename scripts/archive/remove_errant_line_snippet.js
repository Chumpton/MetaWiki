const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const errantRegex = /<!-- Hero Single Featured Card[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;

if (errantRegex.test(html)) {
  html = html.replace(errantRegex, '');
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully removed errant line snippet from index.html!');
} else {
  console.log('Errant regex not matched in index.html');
}
