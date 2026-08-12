const fs = require('fs');

let articlesContent = fs.readFileSync('data/articles.js', 'utf8');

// Accurate Wikipedia lead image URLs
const authenticImages = {
  christianity: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jesus-Christ-from-Hagia-Sophia.jpg/640px-Jesus-Christ-from-Hagia-Sophia.jpg",
  kabbalah: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Kabbalah_Tree_of_Life.png/640px-Kabbalah_Tree_of_Life.png",
  sufism: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg/640px-Mainard-1890-Livre_d%27Or_des_voyages-Asie-23.jpg",
  buddhism: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/640px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg",
  vedanta: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Raja_Ravi_Varma_-_Sankaracharya.jpg/640px-Raja_Ravi_Varma_-_Sankaracharya.jpg",
  yoga: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Patanjali.jpg/640px-Patanjali.jpg",
  hermetic: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kybalion_1908.jpg/640px-Kybalion_1908.jpg",
  jung: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-640px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg"
};

// Update Faiths & Triadic Portals
articlesContent = articlesContent.replace(
  /({ id: "christianity-gnosticism"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.christianity}$2`
);
articlesContent = articlesContent.replace(
  /({ id: "judaism-kabbalah"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.kabbalah}$2`
);
articlesContent = articlesContent.replace(
  /({ id: "islam-sufism"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.sufism}$2`
);
articlesContent = articlesContent.replace(
  /({ id: "buddhism-madhyamaka"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.buddhism}$2`
);
articlesContent = articlesContent.replace(
  /({ id: "hinduism-vedanta"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.vedanta}$2`
);

// Update Concepts & Avatars Portals
articlesContent = articlesContent.replace(
  /({ id: "yoga-systems"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.yoga}$2`
);
articlesContent = articlesContent.replace(
  /({ id: "hermetic-laws"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.hermetic}$2`
);
articlesContent = articlesContent.replace(
  /({ id: "depth-psychology"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.jung}$2`
);

// Update Featured Articles
articlesContent = articlesContent.replace(
  /({ id: "logos"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.christianity}$2`
);
articlesContent = articlesContent.replace(
  /({ id: "tree-of-life-kabbalah"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.kabbalah}$2`
);
articlesContent = articlesContent.replace(
  /({ id: "wahdat-al-wujud"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.sufism}$2`
);
articlesContent = articlesContent.replace(
  /({ id: "ashtanga-yoga"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.yoga}$2`
);
articlesContent = articlesContent.replace(
  /({ id: "chakra"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.vedanta}$2`
);
articlesContent = articlesContent.replace(
  /({ id: "jungian-archetypes"[^}]+imagePath: ")[^"]+(")/,
  `$1${authenticImages.jung}$2`
);

fs.writeFileSync('data/articles.js', articlesContent, 'utf-8');
console.log('Successfully updated portal cards with authentic Wikipedia images!');
