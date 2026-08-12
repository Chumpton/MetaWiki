const fs = require('fs');

let appContent = fs.readFileSync('app.js', 'utf8');

// 1. Re-insert createHawkinsRainbowBar in renderPortalFeed
appContent = appContent.replace(
  /<div class="triadic-card-footer">\s*<div style="display: flex; align-items: center; gap: 0.75rem;">/g,
  `<div class="triadic-card-footer">
          \${createHawkinsRainbowBar(a.hawkinsCalibration || a.hawkinsNumeric)}
          <div style="display: flex; align-items: center; gap: 0.75rem;">`
);

// 2. Re-insert createHawkinsRainbowBar in renderTriadicPortals for guides, faiths, concepts, avatars
appContent = appContent.replace(
  /<div class="triadic-card-footer">\s*<div style="display: flex; align-items: center; gap: 0\.75rem;">\s*<span class="card-views-footer"><i class="ph ph-eye"><\/i> \${getArticleViews\(g\.wikiId\)}<\/span>/g,
  `<div class="triadic-card-footer">
            \${createHawkinsRainbowBar(g.hawkinsLevel)}
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="card-views-footer"><i class="ph ph-eye"></i> \${getArticleViews(g.wikiId)}</span>`
);

appContent = appContent.replace(
  /<div class="triadic-card-footer">\s*<div style="display: flex; align-items: center; gap: 0\.75rem;">\s*<span class="card-views-footer"><i class="ph ph-eye"><\/i> \${getArticleViews\(f\.wikiId\)}<\/span>/g,
  `<div class="triadic-card-footer">
            \${createHawkinsRainbowBar(f.hawkinsLevel)}
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="card-views-footer"><i class="ph ph-eye"></i> \${getArticleViews(f.wikiId)}</span>`
);

appContent = appContent.replace(
  /<div class="triadic-card-footer">\s*<div style="display: flex; align-items: center; gap: 0\.75rem;">\s*<span class="card-views-footer"><i class="ph ph-eye"><\/i> \${getArticleViews\(c\.wikiId\)}<\/span>/g,
  `<div class="triadic-card-footer">
            \${createHawkinsRainbowBar(c.hawkinsLevel)}
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="card-views-footer"><i class="ph ph-eye"></i> \${getArticleViews(c.wikiId)}</span>`
);

appContent = appContent.replace(
  /<div class="triadic-card-footer">\s*<div style="display: flex; align-items: center; gap: 0\.75rem;">\s*<span class="card-views-footer"><i class="ph ph-eye"><\/i> \${getArticleViews\(a\.wikiId\)}<\/span>/g,
  `<div class="triadic-card-footer">
            \${createHawkinsRainbowBar(a.hawkinsLevel)}
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="card-views-footer"><i class="ph ph-eye"></i> \${getArticleViews(a.wikiId)}</span>`
);

// 3. Ensure title formatting removes any parenthetical ascension facet strings if present
appContent = appContent.replace(/\.replace\(\/\s*\([^)]*ascension[^)]*\)\/gi,\s*''\)/g, '');

fs.writeFileSync('app.js', appContent, 'utf-8');
console.log('Successfully restored LoC Hawkins bar to thumbnail cards and ensured clean titles!');
