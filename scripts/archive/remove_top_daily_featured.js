const fs = require('fs');

// 1. Remove from index.html
let html = fs.readFileSync('index.html', 'utf8');
const topDailyHtmlRegex = /<!-- Top Daily Featured Article Card[\s\S]*?<\/div>\s*<\/div>/g;
if (topDailyHtmlRegex.test(html)) {
  html = html.replace(topDailyHtmlRegex, '<!-- Top Daily Featured Card Removed -->');
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully removed Top Daily Featured container from index.html!');
} else {
  console.log('Top daily featured HTML pattern not found in index.html');
}

// 2. Remove from app.js
let appCode = fs.readFileSync('app.js', 'utf8');

// Remove invocation
appCode = appCode.replace('renderTopDailyFeaturedCard();\n', '');
appCode = appCode.replace('renderTopDailyFeaturedCard();', '');

// Remove function definition
const appFunctionRegex = /function renderTopDailyFeaturedCard\(\) \{[\s\S]*?\n  \}/g;
if (appFunctionRegex.test(appCode)) {
  appCode = appCode.replace(appFunctionRegex, '');
  fs.writeFileSync('app.js', appCode, 'utf-8');
  console.log('Successfully removed renderTopDailyFeaturedCard logic from app.js!');
} else {
  console.log('renderTopDailyFeaturedCard function not found in app.js');
}

// 3. Remove styles from styles.css
let css = fs.readFileSync('styles.css', 'utf8');
const cssPattern = /\/\* =+\s*TOP DAILY FEATURED[\s\S]*?$/;
if (cssPattern.test(css)) {
  css = css.replace(cssPattern, '');
  fs.writeFileSync('styles.css', css.trim() + '\n', 'utf-8');
  console.log('Successfully removed top daily featured CSS styles from styles.css!');
} else {
  console.log('Top daily featured CSS pattern not found in styles.css');
}
