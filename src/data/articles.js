/**
 * MetaWiki - Data Aggregator & Storage Module
 * Combines modular article files, guides feed, and community forum topics into window.METAWIKI_DATA.
 */
(function(window) {
  'use strict';

  if (!window.METAWIKI_DATA) window.METAWIKI_DATA = {};

  // Aggregate modular articles from sub-modules
  const philosophers = window.METAWIKI_DATA.philosophersArticles || [];
  const metaphysical = window.METAWIKI_DATA.metaphysicalConceptsArticles || [];
  const pioneers = window.METAWIKI_DATA.consciousnessPioneersArticles || [];

  const combinedArticles = [...philosophers, ...metaphysical, ...pioneers];

  window.METAWIKI_DATA.articles = combinedArticles;

  // Practical Guides Feed Dataset
  window.METAWIKI_DATA.guides = [
    {
      id: 'guide-hermetic-initiates-manual',
      wikiId: 'hermeticism-seven-principles-kybalion',
      title: 'Hermetic Initiates Practice Manual',
      subtitle: 'Applying the 7 Universal Principles in Daily Contemplation',
      category: 'Hermetic Scholarship',
      readTime: '12 min',
      views: '45,200',
      hawkinsLevel: 540,
      imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Emerald_Tablet_of_Hermes.jpg/300px-Emerald_Tablet_of_Hermes.jpg',
      summary: 'A step-by-step practical guide to mastering mental gender, polarity transmutation, and rhythmic stabilization in daily life.'
    },
    {
      id: 'guide-hawkins-loc-calibration-guide',
      wikiId: 'david-r-hawkins-map-of-consciousness',
      title: 'Guide to Navigating Hawkins Map of Consciousness',
      subtitle: 'Transcendence from Egoic Force to Spiritual Power',
      category: 'Hawkins LoC Debates',
      readTime: '15 min',
      views: '78,900',
      hawkinsLevel: 605,
      imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/300px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg',
      summary: 'Practical diagnostic framework for identifying attractor fields, clearing emotional blockages, and expanding awareness beyond LoC 200.'
    },
    {
      id: 'guide-platonic-contemplation',
      wikiId: 'platos-theory-of-forms',
      title: 'Platonic Dialectic & The Ascent from the Cave',
      subtitle: 'Contemplative Exercise on the Intelligible Forms',
      category: 'Metaphysical Debate',
      readTime: '10 min',
      views: '32,100',
      hawkinsLevel: 540,
      imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png',
      summary: 'How to practice intellective recollection (Anamnesis) to turn the soul toward the unchangeable Forms.'
    },
    {
      id: 'guide-jungian-shadow-integration',
      wikiId: 'carl-jung-archetypes-collective-unconscious',
      title: 'Jungian Active Imagination & Shadow Work',
      subtitle: 'Integration of Archetypal Content from the Unconscious',
      category: 'Depth Psychology',
      readTime: '18 min',
      views: '64,300',
      hawkinsLevel: 520,
      imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/CGJung.jpg/300px-CGJung.jpg',
      summary: 'Methodology for dialoguing with dream figures, identifying projections, and achieving psychological wholeness.'
    },
    {
      id: 'guide-taoist-wu-wei-practice',
      wikiId: 'lao-tzu-tao-te-ching-non-action',
      title: 'Wu Wei: The Art of Effortless Alignment',
      subtitle: 'Surrendering Willfulness to Cosmic Flow',
      category: 'Meditation Practices',
      readTime: '8 min',
      views: '51,400',
      hawkinsLevel: 610,
      imagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Laozi_-_Project_Gutenberg_eText_15250.jpg/300px-Laozi_-_Project_Gutenberg_eText_15250.jpg',
      summary: 'Practical Taoist exercises for releasing egoic control, cultivating presence, and acting without resistance.'
    }
  ];

  // Community Forum Discussions Dataset
  window.METAWIKI_DATA.forumTopics = [
    {
      id: 'topic-1',
      title: "How does Plato's Form of the Good compare to the Vedantic Brahman?",
      category: 'Metaphysical Debate',
      author: 'Initiate_Plotinus',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      time: '2 hours ago',
      upvotes: 42,
      body: 'In Book VII of The Republic, Plato describes the Form of the Good as the ultimate source of light and truth, beyond existence itself. In Advaita Vedanta, Brahman is described as Nirguna — beyond qualities yet the ground of all appearance. Are these two pointing to the exact same non-dual reality?',
      repliesList: [
        {
          author: 'HermeticScholar',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          time: '1 hour ago',
          body: 'Precisely! Both traditions emphasize that the ultimate source cannot be grasped by conceptual dualistic thought. Plotinus bridged them explicitly in the Enneads.'
        },
        {
          author: 'SophiaSeeker',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          time: '30 mins ago',
          body: 'Hawkins calibrated both Plato’s Form of the Good and Shankara’s Advaita at LoC 540–600+, confirming they tap into the same high attractor energy field.'
        }
      ]
    },
    {
      id: 'topic-2',
      title: 'Practical techniques for shifting from LoC 200 (Courage) to LoC 500 (Love)',
      category: 'Hawkins LoC Debates',
      author: 'AuraResearcher',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      time: '4 hours ago',
      upvotes: 68,
      body: 'Courage (200) is the critical pivot point where we stop acting as victims and take responsibility. But what specific contemplative habits facilitate the transition into the 400s (Reason) and 500s (Heart-centered Love)?',
      repliesList: [
        {
          author: 'MindfulWalker',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
          time: '2 hours ago',
          body: 'Surrendering judgment of self and others is key. As Hawkins notes in Letting Go, releasing the desire to control outcomes automatically elevates the field.'
        }
      ]
    },
    {
      id: 'topic-3',
      title: 'Active Imagination vs. Spontaneous Meditation in Jungian Work',
      category: 'Depth Psychology',
      author: 'PsycheExplorer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      time: '6 hours ago',
      upvotes: 31,
      body: 'When engaging Active Imagination as described by Jung in the Red Book, how do you maintain the ego as a participant without letting it control the narrative?',
      repliesList: []
    }
  ];

})(window);
