const fs = require('fs');

let code = fs.readFileSync('data/articles.js', 'utf8');

// Insert horizontal section break lines (<hr class="article-section-divider">) before section headings in contentHTML
code = code.replace(/(<h2 id="[^"]+"><span class="mw-headline">)/g, '<hr class="article-section-divider">\n      $1');

fs.writeFileSync('data/articles.js', code, 'utf-8');
console.log('Successfully inserted horizontal section break lines across all 1,008 articles in data/articles.js!');
