const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const target = `<button class="live-chat-launcher" id="liveChatLauncher" title="Open Live Community Chat">
    <i class="ph ph-chat-circle-dots"></i>`;

const replace = `<button class="live-chat-launcher" id="liveChatLauncher" title="Open Discord Community Chat">
    <i class="ph ph-discord-logo" style="transform: scaleX(-1); font-size: 1.8rem; color: #ffffff;"></i>`;

if (html.includes(target)) {
  html = html.replace(target, replace);
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully updated liveChatLauncher icon to flipped Discord logo in index.html!');
} else {
  console.log('Target launcher string not found in index.html');
}
