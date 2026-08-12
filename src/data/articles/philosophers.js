/**
 * MetaWiki - Philosophers & Consciousness Masters Dataset
 */
(function(window) {
  'use strict';

  const philosophers = [
    {
      id: 'platos-theory-of-forms',
      title: "Plato's Theory of Forms",
      shortDescription: "The foundational metaphysical doctrine asserting that transcendent, non-material Forms represent the ultimate reality.",
      category: 'Ontology & Being',
      dimension: '6D Matrix',
      hawkinsCalibration: 'LoC 540',
      hawkinsNumeric: 540,
      lastModified: '2026-08-11',
      views: '142,500',
      watchers: '3,120',
      infobox: {
        title: "Plato's Theory of Forms",
        subtitle: 'Metaphysical Concept & Consciousness Analysis',
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png',
        fullImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png',
        imageCaption: "Bust of Plato (Silanion), Capitoline Museums, Rome.",
        data: [
          { label: 'Category', value: 'Ontology & Being' },
          { label: 'Tradition', value: 'Classical Greek Philosophy / Platonism' },
          { label: 'Key Text', value: 'The Republic (Book VII - Allegory of the Cave)' },
          { label: 'Hawkins Calibration', value: 'LoC 540 (Joy & Spiritual Realization)' },
          { label: 'Wikipedia Status', value: 'Verified Academic Record' }
        ]
      },
      metaphysicalInterpretation: {
        title: "Metaphysical & Ontological Interpretation of Plato's Theory of Forms",
        maxim: "“In Plato's Theory of Forms, form and essence converge to express the non-dual truth of universal consciousness.”",
        hawkinsContext: "Calibrated at LoC 540 on Dr. David R. Hawkins' Map of Consciousness.",
        synthesis: "Plato's Theory of Forms articulates how transcendent archetypal patterns structure physical reality, guiding consciousness from shadow identification to direct perception of the Good."
      }
    },
    {
      id: 'plotinus-the-one-emanationism',
      title: "Plotinus & Neoplatonic Emanationism",
      shortDescription: "The metaphysical architecture of The One, Nous (Divine Mind), and Psyche (World Soul).",
      category: 'Neoplatonism',
      dimension: '9D Source',
      hawkinsCalibration: 'LoC 580',
      hawkinsNumeric: 580,
      lastModified: '2026-08-10',
      views: '98,400',
      watchers: '2,450',
      infobox: {
        title: 'Plotinus',
        subtitle: 'Founder of Neoplatonism (c. 204–270 CE)',
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Plotinos.png/300px-Plotinos.png',
        fullImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Plotinos.png/300px-Plotinos.png',
        imageCaption: 'Ancient bust identified as Plotinus, Ostia Antica Museum.',
        data: [
          { label: 'Category', value: 'Neoplatonism' },
          { label: 'Primary Work', value: 'The Enneads (compiled by Porphyry)' },
          { label: 'Central Concept', value: 'The One (To Hen) & Henosis' },
          { label: 'Hawkins Calibration', value: 'LoC 580 (Non-Dual Realization)' },
          { label: 'Wikipedia Status', value: 'Verified Historical Philosophy' }
        ]
      },
      metaphysicalInterpretation: {
        title: 'Metaphysical Synthesis of Plotinian Emanationism',
        maxim: "“The One is all things and no one of them; the source of all things is not all things.”",
        hawkinsContext: 'Calibrated at LoC 580 — Non-Dual Unification field.',
        synthesis: 'Plotinus maps the descending cascade of consciousness from the transcendent One into Mind, Soul, and Matter, establishing the blueprint for Western mysticism.'
      }
    },
    {
      id: 'lao-tzu-tao-te-ching-non-action',
      title: 'Lao Tzu & The Taoist Mechanics of Wu Wei',
      shortDescription: "The metaphysics of the unnamable Tao, spontaneous natural alignment, and effortless action.",
      category: 'Eastern Non-Duality',
      dimension: '8D Galactic',
      hawkinsCalibration: 'LoC 610',
      hawkinsNumeric: 610,
      lastModified: '2026-08-09',
      views: '185,200',
      watchers: '4,890',
      infobox: {
        title: 'Lao Tzu',
        subtitle: 'Author of the Tao Te Ching (6th Century BCE)',
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Laozi_-_Project_Gutenberg_eText_15250.jpg/300px-Laozi_-_Project_Gutenberg_eText_15250.jpg',
        fullImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Laozi_-_Project_Gutenberg_eText_15250.jpg/300px-Laozi_-_Project_Gutenberg_eText_15250.jpg',
        imageCaption: 'Traditional Chinese depiction of Lao Tzu riding an ox.',
        data: [
          { label: 'Category', value: 'Taoist Philosophy' },
          { label: 'Core Text', value: 'Tao Te Ching' },
          { label: 'Core Principle', value: 'Wu Wei (Natural Non-Striving)' },
          { label: 'Hawkins Calibration', value: 'LoC 610 (Peace & Enlightened State)' },
          { label: 'Wikipedia Status', value: 'Verified World Cultural Asset' }
        ]
      },
      metaphysicalInterpretation: {
        title: 'Metaphysical Analysis of Lao Tzu & The Tao',
        maxim: "“The Tao that can be told is not the eternal Tao.”",
        hawkinsContext: 'Calibrated at LoC 610 on Hawkins Map of Consciousness.',
        synthesis: 'Lao Tzu describes the self-organizing cosmic Intelligence (Tao) which governs all manifestation when personal egoic resistance is surrendered.'
      }
    },
    {
      id: 'carl-jung-archetypes-collective-unconscious',
      title: 'Carl Jung: Archetypes & The Collective Unconscious',
      shortDescription: "Depth psychology's bridge to metaphysics, individualization, and primordial symbolic matrices.",
      category: 'Depth Psychology',
      dimension: '5D Probability',
      hawkinsCalibration: 'LoC 520',
      hawkinsNumeric: 520,
      lastModified: '2026-08-11',
      views: '210,000',
      watchers: '5,300',
      infobox: {
        title: 'Carl Gustav Jung',
        subtitle: 'Founder of Analytical Psychology (1875–1961)',
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/CGJung.jpg/300px-CGJung.jpg',
        fullImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/CGJung.jpg/300px-CGJung.jpg',
        imageCaption: 'C.G. Jung in 1935.',
        data: [
          { label: 'Category', value: 'Depth Psychology & Symbolism' },
          { label: 'Key Concepts', value: 'Archetypes, Synchronicity, Anima/Animus, Shadow' },
          { label: 'Major Work', value: 'The Red Book / Psychological Types' },
          { label: 'Hawkins Calibration', value: 'LoC 520 (Unconditional Love & Vision)' },
          { label: 'Wikipedia Status', value: 'Verified Academic Standard' }
        ]
      },
      metaphysicalInterpretation: {
        title: 'Metaphysical Hermeneutics of Jungian Archetypes',
        maxim: "“Who looks outside, dreams; who looks inside, awakes.”",
        hawkinsContext: 'Calibrated at LoC 520.',
        synthesis: 'Jung demonstrated that human consciousness accesses shared transpersonal archetypal fields that structure myths, dreams, and synchronous events.'
      }
    },
    {
      id: 'gautama-buddha-four-noble-truths-sunyata',
      title: 'Gautama Buddha: Emptiness & Non-Self',
      shortDescription: "The metaphysical realization of Anatta (Non-Self), Pratītyasamutpāda (Dependent Origination), and Nirvana.",
      category: 'Buddhist Metaphysics',
      dimension: '9D Source',
      hawkinsCalibration: 'LoC 1000',
      hawkinsNumeric: 1000,
      lastModified: '2026-08-08',
      views: '340,000',
      watchers: '9,120',
      infobox: {
        title: 'Siddhartha Gautama (The Buddha)',
        subtitle: 'Founder of Buddhism (c. 5th–4th Century BCE)',
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Gandhara_Buddha_%28tnm%29.jpeg/300px-Gandhara_Buddha_%28tnm%29.jpeg',
        fullImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Gandhara_Buddha_%28tnm%29.jpeg/300px-Gandhara_Buddha_%28tnm%29.jpeg',
        imageCaption: 'Seated Buddha from Gandhara, 2nd-3rd century CE.',
        data: [
          { label: 'Category', value: 'Buddhist Metaphysics' },
          { label: 'Core Teaching', value: 'Four Noble Truths & Eightfold Path' },
          { label: 'Ontological State', value: 'Anatta & Śūnyatā (Emptiness)' },
          { label: 'Hawkins Calibration', value: 'LoC 1000 (Maximum Avatar Consciousness)' },
          { label: 'Wikipedia Status', value: 'Verified Global Record' }
        ]
      },
      metaphysicalInterpretation: {
        title: 'Metaphysical Analysis of Buddhist Non-Self & Emptiness',
        maxim: "“Form is emptiness, emptiness is form.”",
        hawkinsContext: 'Calibrated at LoC 1000 — Absolute Divine Realization.',
        synthesis: 'The Buddha mapped the absolute cessation of egoic illusion, revealing pure unconditioned awareness as the ultimate state of liberation.'
      }
    },
    {
      id: 'baruch-spinoza-deus-sive-natura',
      title: 'Spinoza: Deus Sive Natura (God or Nature)',
      shortDescription: "The radical monist metaphysics equating God, Nature, and Substance as one infinite reality.",
      category: 'Rationalist Metaphysics',
      dimension: '7D Multiverse',
      hawkinsCalibration: 'LoC 570',
      hawkinsNumeric: 570,
      lastModified: '2026-08-07',
      views: '89,100',
      watchers: '2,100',
      infobox: {
        title: 'Baruch Spinoza',
        subtitle: 'Dutch Philosopher & Monist Master (1632–1677)',
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Spinoza.jpg/300px-Spinoza.jpg',
        fullImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Spinoza.jpg/300px-Spinoza.jpg',
        imageCaption: 'Portrait of Baruch Spinoza, c. 1665.',
        data: [
          { label: 'Category', value: 'Monist Metaphysics' },
          { label: 'Magnum Opus', value: 'Ethics (Demonstrated in Geometrical Order)' },
          { label: 'Core Axiom', value: 'Deus Sive Natura (God or Nature)' },
          { label: 'Hawkins Calibration', value: 'LoC 570 (Intellectual Intuition & Serenity)' },
          { label: 'Wikipedia Status', value: 'Verified Philosophical Landmark' }
        ]
      },
      metaphysicalInterpretation: {
        title: 'Metaphysical Synthesis of Spinozist Pantheism',
        maxim: "“Whatever is, is in God, and nothing can be or be conceived without God.”",
        hawkinsContext: 'Calibrated at LoC 570.',
        synthesis: 'Spinoza provided a mathematically rigorous proof that only one substance exists, of which mind and matter are infinite attributes.'
      }
    },
    {
      id: 'marcus-aurelius-stoic-logos',
      title: 'Marcus Aurelius & The Stoic Cosmic Logos',
      shortDescription: "Imperial Stoic philosophy on living in harmony with universal reason and transient nature.",
      category: 'Stoicism',
      dimension: '4D Time',
      hawkinsCalibration: 'LoC 480',
      hawkinsNumeric: 480,
      lastModified: '2026-08-06',
      views: '162,000',
      watchers: '3,900',
      infobox: {
        title: 'Marcus Aurelius',
        subtitle: 'Roman Emperor & Stoic Philosopher (121–180 CE)',
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Marcus_Aurelius_Louvre_MR561.jpg/300px-Marcus_Aurelius_Louvre_MR561.jpg',
        fullImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Marcus_Aurelius_Louvre_MR561.jpg/300px-Marcus_Aurelius_Louvre_MR561.jpg',
        imageCaption: 'Bust of Marcus Aurelius, Louvre Museum.',
        data: [
          { label: 'Category', value: 'Stoic Metaphysics' },
          { label: 'Core Text', value: 'Meditations (Ta Eis Heauton)' },
          { label: 'Cosmic View', value: 'Logos & Amor Fati' },
          { label: 'Hawkins Calibration', value: 'LoC 480 (Reason & Wisdom)' },
          { label: 'Wikipedia Status', value: 'Verified Historical Classical Record' }
        ]
      },
      metaphysicalInterpretation: {
        title: 'Metaphysical Analysis of Stoic Providence',
        maxim: "“Everything that happens happens as it should, and if you observe carefully, you will find this to be so.”",
        hawkinsContext: 'Calibrated at LoC 480.',
        synthesis: 'Marcus Aurelius aligns human consciousness with the cosmic order (Logos), viewing all events as purposeful expressions of nature.'
      }
    }
  ];

  if (!window.METAWIKI_DATA) window.METAWIKI_DATA = {};
  window.METAWIKI_DATA.philosophersArticles = philosophers;

})(window);
