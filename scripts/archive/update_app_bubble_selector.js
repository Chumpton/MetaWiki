const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

appCode = appCode.replace(/\.cat-tab-btn/g, '.cat-bubble-btn');

fs.writeFileSync('app.js', appCode, 'utf-8');
console.log('Successfully updated app.js to use .cat-bubble-btn selector!');
