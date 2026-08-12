const fs = require('fs');

let appContent = fs.readFileSync('app.js', 'utf8');

// 1. Remove createHawkinsRainbowBar from renderPortalFeed
appContent = appContent.replace(
  /\${createHawkinsRainbowBar\(a\.hawkinsCalibration \|\| a\.hawkinsNumeric\)\}/g,
  ''
);

// 2. Remove createHawkinsRainbowBar from renderTriadicPortals
appContent = appContent.replace(/\${createHawkinsRainbowBar\(g\.hawkinsLevel\)\}/g, '');
appContent = appContent.replace(/\${createHawkinsRainbowBar\(f\.hawkinsLevel\)\}/g, '');
appContent = appContent.replace(/\${createHawkinsRainbowBar\(c\.hawkinsLevel\)\}/g, '');
appContent = appContent.replace(/\${createHawkinsRainbowBar\(a\.hawkinsLevel\)\}/g, '');

fs.writeFileSync('app.js', appContent, 'utf-8');
console.log('Successfully removed ascension facet & Hawkins LoC rainbow bar from all thumbnail cards!');
