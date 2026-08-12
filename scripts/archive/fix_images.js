const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');
if (html.includes('assets/the_fool_tarot.jpg')) {
  html = html.replace(
    'src="assets/the_fool_tarot.jpg" alt="The Fool Archetype"',
    'src="assets/the_fool_tarot.jpg" alt="The Fool Archetype" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=\'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80\';"'
  );
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Updated index.html hero image tag.');
}

console.log('Image fix script completed.');
