const fs = require('fs');

// 1. Add #articleReaderView CSS to styles.css
let stylesCSS = fs.readFileSync('styles.css', 'utf8');

const articleReaderCSS = `
/* STANDALONE ARTICLE READER PAGE TAKEOVER VIEW */
#articleReaderView {
  width: 100%;
  min-height: 100vh;
  padding-top: 5rem;
  padding-bottom: 6rem;
  background: #0a0a0f;
  position: relative;
  z-index: 10;
}

#initiatoryPortalView, #forumsView {
  width: 100%;
}
`;

if (!stylesCSS.includes('#articleReaderView {')) {
  stylesCSS += '\n' + articleReaderCSS;
  fs.writeFileSync('styles.css', stylesCSS, 'utf-8');
  console.log('1. Added #articleReaderView CSS styling to styles.css');
}

// 2. Update forceScrollTop and loadArticle in app.js
let appJS = fs.readFileSync('app.js', 'utf8');

const newForceScrollTop = `  function forceScrollTop() {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 20);

    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.documentElement.style.scrollBehavior = '';
      document.body.style.scrollBehavior = '';
    }, 150);
  }`;

const oldForceScrollRegex = /function forceScrollTop\(\) \{[\s\S]*?\n  \}/;
if (oldForceScrollRegex.test(appJS)) {
  appJS = appJS.replace(oldForceScrollRegex, newForceScrollTop);
}

// Ensure loadArticle calls forceScrollTop immediately
if (appJS.includes('switchView(\'article\');')) {
  appJS = appJS.replace('switchView(\'article\');', 'switchView(\'article\');\n    forceScrollTop();');
}

fs.writeFileSync('app.js', appJS, 'utf-8');
console.log('2. Updated forceScrollTop and loadArticle in app.js');
