const fs = require('fs');

let code = fs.readFileSync('data/articles.js', 'utf8');

global.window = global;
eval(code);

if (window.METAWIKI_DATA.forumTopics) {
  window.METAWIKI_DATA.forumTopics.forEach((t, idx) => {
    t.upvotes = Math.floor(Math.random() * 30) + 12;
    t.repliesList = [
      {
        author: "AdvaitaSeeker#2048",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Raja_Ravi_Varma_-_Sankaracharya.jpg/330px-Raja_Ravi_Varma_-_Sankaracharya.jpg",
        time: "1 hour ago",
        body: "Fascinating perspective! Shankara explicitly speaks of Maya as the creative power (Shakti) of Ishwara, which aligns closely with the active principle of Logos in John 1:1."
      },
      {
        author: "GnosticInitiate#9912",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jesus-Christ-from-Hagia-Sophia.jpg/330px-Jesus-Christ-from-Hagia-Sophia.jpg",
        time: "45 mins ago",
        body: "In Gnostic texts like the Gospel of Truth, the uncreated Logos emanates from the Father to illuminate localized consciousness. The parallel to Atman-Brahman non-duality is striking."
      }
    ];
  });

  const updatedJs = `/**
 * MetaWiki - Metaphysical Knowledge Repository
 * Master Dataset with Full Forum Threads & Reply Lists
 */

window.METAWIKI_DATA = ${JSON.stringify(window.METAWIKI_DATA, null, 2)};
`;

  fs.writeFileSync('data/articles.js', updatedJs, 'utf-8');
  console.log('Successfully added thread replies data to data/articles.js!');
}
