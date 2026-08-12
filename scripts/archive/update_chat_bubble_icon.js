const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const target = `<i class="ph ph-discord-logo" style="transform: scaleX(-1); font-size: 1.8rem; color: #ffffff;"></i>`;
const replace = `<i class="ph ph-chat-teardrop-dots" style="transform: scaleX(-1); font-size: 1.8rem; color: #ffffff;"></i>`;

if (html.includes(target)) {
  html = html.replace(target, replace);
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully replaced Discord logo with flipped chat bubble icon in index.html!');
} else {
  console.log('Target string not found in index.html');
}
