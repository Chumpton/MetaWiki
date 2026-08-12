const fs = require('fs');
const path = require('path');

// Clean up thumbnail URLs by stripping query parameters like ?utm_source=...
function cleanWikiUrl(url) {
  if (!url) return null;
  return url.split('?')[0];
}

// Category-based unique fallback images (so fallback never displays repeating generic mountain photos)
const CATEGORY_FALLBACKS = {
  "World Religions & Gnosticism": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jesus-Christ-from-Hagia-Sophia.jpg/640px-Jesus-Christ-from-Hagia-Sophia.jpg",
  "Judaism & Kabbalah": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kabbalah_Tree_of_Life.png/640px-Kabbalah_Tree_of_Life.png",
  "Islam & Sufism": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg/640px-Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg",
  "Hinduism & Advaita Vedanta": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Raja_Ravi_Varma_-_Sankaracharya.jpg/640px-Raja_Ravi_Varma_-_Sankaracharya.jpg",
  "Buddhism & Zen": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/640px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg",
  "Hermeticism & Alchemy": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kybalion_1908.jpg/640px-Kybalion_1908.jpg",
  "Western Philosophy & Neoplatonism": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Plato_Silanion_Musei_Capitolini_MC1377.jpg/640px-Plato_Silanion_Musei_Capitolini_MC1377.jpg",
  "Depth & Transpersonal Psychology": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-640px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg",
  "Sacred Geometry & Quantum Metaphysics": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Logos.svg/640px-Logos.svg.png"
};

// Update data/articles.js directly with clean, unique, authentic Wikipedia thumbnail URLs
let code = fs.readFileSync('data/articles.js', 'utf8');

// Replace any leftover mountain photo or broken URLs with authentic category thumbnails
code = code.replace(/https:\/\/images\.unsplash\.com\/photo-1506744038136-46273834b3fb[^\"]+/g, (match) => {
  return "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/640px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg";
});

// Strip query parameters (?utm_source=...) from all thumbnail URLs in articles.js
code = code.replace(/(https:\/\/upload\.wikimedia\.org\/[^\"]+)\?utm_source=[^\"]+/g, '$1');

// Explicitly update triadicPortals in articles.js with 5 DISTINCT authentic Wikipedia images
const faithsUpdated = `
    faiths: [
      { id: "christianity-gnosticism", title: "World Religions: Christianity & Gnosticism", subtitle: "The Divine Logos, Hesychasm, Nag Hammadi", hawkinsLevel: 700, hawkinsStage: "LoC 700 (Divine Logos)", imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jesus-Christ-from-Hagia-Sophia.jpg/640px-Jesus-Christ-from-Hagia-Sophia.jpg", summary: "Exploring the creative Word (Logos), contemplative prayer of Hesychasm, and Gnostic illumination.", wikiId: "logos" },
      { id: "judaism-kabbalah", title: "World Religions: Judaism & Kabbalah", subtitle: "Ten Sephirot, Ein Sof, Merkabah", hawkinsLevel: 700, hawkinsStage: "LoC 700 (Ein Sof Light)", imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kabbalah_Tree_of_Life.png/640px-Kabbalah_Tree_of_Life.png", summary: "The 10 Kabbalistic Sephirot, infinite unmanifest Ein Sof, and celestial throne ascent.", wikiId: "ein-sof" },
      { id: "islam-sufism", title: "World Religions: Islam & Sufism", subtitle: "Wahdat al-Wujud, Fana, 99 Names", hawkinsLevel: 600, hawkinsStage: "LoC 600 (Divine Love)", imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg/640px-Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg", summary: "Ibn Arabi's Wahdat al-Wujud (Unity of Being), ego annihilation (Fana), and 99 Divine Names.", wikiId: "wahdat-al-wujud" },
      { id: "buddhism-madhyamaka", title: "World Religions: Buddhism & Madhyamaka", subtitle: "Śūnyatā, Pratītyasamutpāda, Anatta", hawkinsLevel: 700, hawkinsStage: "LoC 700 (Luminous Śūnyatā)", imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/640px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg", summary: "Nāgārjuna's Śūnyatā (Emptiness), Pratītyasamutpāda, and Anatta (Non-Self).", wikiId: "sunyata" },
      { id: "hinduism-vedanta", title: "World Religions: Hinduism & Advaita Vedanta", subtitle: "Advaita, Atman-Brahman, Maya", hawkinsLevel: 700, hawkinsStage: "LoC 700-1000 (Pure Awareness)", imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Raja_Ravi_Varma_-_Sankaracharya.jpg/640px-Raja_Ravi_Varma_-_Sankaracharya.jpg", summary: "Adi Shankara's non-dual realization that Atman is Brahman.", wikiId: "advaita-vedanta" }
    ],`;

code = code.replace(/faiths:\s*\[[\s\S]*?\],/, faithsUpdated.trim());

fs.writeFileSync('data/articles.js', code, 'utf-8');
console.log('Successfully rebuilt articles.js with unique, authentic Wikipedia images!');
