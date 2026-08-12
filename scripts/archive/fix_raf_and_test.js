const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

appCode = appCode.replace(
`    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
        document.body.style.scrollBehavior = '';
      }, 50);
    });`,
`    const handleReset = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
        document.body.style.scrollBehavior = '';
      }, 50);
    };
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(handleReset);
    } else {
      handleReset();
    }`
);

fs.writeFileSync('app.js', appCode, 'utf-8');

// Update test_dom_click.js
let testCode = fs.readFileSync('scripts/test_dom_click.js', 'utf8');
testCode = `global.requestAnimationFrame = (fn) => fn();\n` + testCode;
fs.writeFileSync('scripts/test_dom_click.js', testCode, 'utf-8');

console.log('Successfully updated forceScrollTop and test_dom_click.js with requestAnimationFrame guards!');
