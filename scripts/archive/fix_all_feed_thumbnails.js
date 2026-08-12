const fs = require('fs');

let appJS = fs.readFileSync('app.js', 'utf8');

// Update renderPortalFeed image source to use getArticleImagePath
appJS = appJS.replace(
  '<img src="${a.infobox && a.infobox.imagePath ? a.infobox.imagePath : \'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80\'}" alt="${a.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.style.display=\'none\';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">',
  '<img src="${getArticleImagePath(a)}" alt="${a.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=getSVGThumbnailDataURI(a.title, a.category);" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">'
);

fs.writeFileSync('app.js', appJS, 'utf-8');
console.log('Updated app.js renderPortalFeed thumbnail image generator and fallbacks!');
