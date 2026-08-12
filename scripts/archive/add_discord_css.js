const fs = require('fs');

const discordCss = `
/* =========================================================================
   FLOATING DISCORD SIGN UP / LOGIN BUBBLE BUTTON STYLES
   ========================================================================= */

.discord-bubble-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.15rem;
  background: rgba(88, 101, 242, 0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(88, 101, 242, 0.4);
  border-radius: 30px;
  color: #ffffff;
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(88, 101, 242, 0.25);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.discord-bubble-btn:hover {
  background: #5865F2;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(88, 101, 242, 0.5);
}

.discord-bubble-btn.logged-in {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.4);
  color: #4ade80;
}
`;

let css = fs.readFileSync('styles.css', 'utf8');
fs.writeFileSync('styles.css', css.trim() + '\n\n' + discordCss, 'utf8');
console.log('Successfully appended Discord bubble button CSS to styles.css!');
