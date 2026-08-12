const fs = require('fs');

// 1. Update index.html for chat launcher icon (Discord logo, flipped horizontally)
let html = fs.readFileSync('index.html', 'utf8');

const oldLauncherRegex = /<button class="live-chat-launcher" id="liveChatLauncher" title="Open Live Community Chat">\s*<i class="ph ph-chats-circle"><\/i>/g;
const newLauncherHTML = `<button class="live-chat-launcher" id="liveChatLauncher" title="Open Discord Community Chat">
    <i class="ph ph-discord-logo" style="transform: scaleX(-1); font-size: 1.8rem; color: #ffffff;"></i>`;

if (oldLauncherRegex.test(html)) {
  html = html.replace(oldLauncherRegex, newLauncherHTML);
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('Successfully updated chat launcher icon in index.html!');
} else {
  console.log('Old launcher regex not matched in index.html');
}

// 2. Update styles.css for Discord Purple styling
let css = fs.readFileSync('styles.css', 'utf8');

const oldLauncherCss = /\.live-chat-launcher\s*\{[\s\S]*?\}/;
const newLauncherCss = `.live-chat-launcher {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  padding: 0;
  background: linear-gradient(135deg, #5865F2 0%, #4752C4 100%);
  color: #ffffff;
  font-size: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(88, 101, 242, 0.65);
  z-index: 5000;
  border: 1px solid rgba(88, 101, 242, 0.8);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.live-chat-launcher:hover {
  transform: scale(1.12) rotate(-5deg);
  box-shadow: 0 15px 40px rgba(88, 101, 242, 0.9);
}`;

if (oldLauncherCss.test(css)) {
  css = css.replace(oldLauncherCss, newLauncherCss);
  fs.writeFileSync('styles.css', css, 'utf-8');
  console.log('Successfully updated .live-chat-launcher styles to Discord Purple in styles.css!');
} else {
  console.log('Old launcher CSS pattern not matched in styles.css');
}
