const fs = require('fs');

let css = fs.readFileSync('styles.css', 'utf8');

const pulseGlowCss = `
/* =========================================================================
   TOP DAILY FEATURED CARD PULSING 3D & GOLD AURA GLOW ANIMATION
   ========================================================================= */

@keyframes topDailyPulseGlow {
  0% {
    transform: scale(1) translateY(0);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(251, 191, 36, 0.3);
    border-color: var(--mw-border-gold);
  }
  50% {
    transform: scale(1.028) translateY(-8px);
    box-shadow: 0 30px 85px rgba(0, 0, 0, 0.95), 0 0 65px rgba(251, 191, 36, 0.7);
    border-color: #fbbf24;
  }
  100% {
    transform: scale(1) translateY(0);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(251, 191, 36, 0.3);
    border-color: var(--mw-border-gold);
  }
}

.top-daily-featured-card {
  animation: topDailyPulseGlow 4s ease-in-out infinite;
  will-change: transform, box-shadow;
}

.top-daily-featured-card:hover {
  animation-play-state: paused;
  transform: scale(1.035) translateY(-10px);
  box-shadow: 0 35px 90px rgba(0, 0, 0, 0.95), 0 0 80px rgba(251, 191, 36, 0.85);
  border-color: #ffe066;
}
`;

fs.writeFileSync('styles.css', css.trim() + '\n\n' + pulseGlowCss, 'utf8');
console.log('Successfully added continuous pulsing and glowing animation to .top-daily-featured-card in styles.css!');
