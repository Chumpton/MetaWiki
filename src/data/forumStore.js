/**
 * MetaWiki - Segmented Forum Data Store
 * Manages segmented state for Posts, Comments, Votes, and User Sessions.
 * Provides clean CRUD accessors for UI editing, LocalStorage persistence, and Supabase API sync.
 */

(function(window) {
  'use strict';

  // 1 Official Test Post from Campton
  const OFFICIAL_CAMPTON_TEST_POST = {
    id: 'topic-campton-official',
    title: 'Welcome to MetaWiki Community — Consciousness & Hermetic Contemplations',
    category: 'Metaphysical Debate',
    author: 'Campton',
    avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
    handle: '@campton',
    body: 'Welcome to the official MetaWiki community forums! Here we explore non-dual perception, Dr. David R. Hawkins\' consciousness calibrations, Hermetic mechanics, and perennial philosophy. Feel free to start a discussion or leave a reply.',
    repliesCount: 1,
    upvotes: 42,
    timestamp: 'Just now',
    repliesList: [
      {
        id: 'reply-init-1',
        author: 'Campton',
        avatar: 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
        body: 'All posts, replies, and upvotes are linked directly to your authenticated user profile.',
        time: 'Just now'
      }
    ]
  };

  class ForumStore {
    constructor() {
      this.posts = [];
      this.commentsMap = {};
      this.votesMap = {};
      this.init();
    }

    init() {
      // Purge old mock topics from local storage
      try {
        localStorage.removeItem('metawiki_local_forum_topics');
      } catch(e) {}

      // Load persistent user created posts
      let savedPosts = [];
      try {
        savedPosts = JSON.parse(localStorage.getItem('metawiki_user_posts')) || [];
      } catch(e) {}

      // Load persistent comments map
      try {
        this.commentsMap = JSON.parse(localStorage.getItem('metawiki_user_comments')) || {};
      } catch(e) {}

      // Load persistent votes map
      try {
        this.votesMap = JSON.parse(localStorage.getItem('metawiki_forum_votes')) || {};
      } catch(e) {}

      // Combine user posts + 1 Official Campton Test Post
      this.posts = [...savedPosts, OFFICIAL_CAMPTON_TEST_POST];

      // Attach comments from storage if available
      this.posts.forEach(p => {
        if (this.commentsMap[p.id] && this.commentsMap[p.id].length > 0) {
          p.repliesList = this.commentsMap[p.id];
          p.repliesCount = p.repliesList.length;
        }
      });

      // Synchronize with global METAWIKI_DATA
      window.METAWIKI_DATA = window.METAWIKI_DATA || {};
      window.METAWIKI_DATA.forumTopics = this.posts;
    }

    getPosts() {
      window.METAWIKI_DATA = window.METAWIKI_DATA || {};
      if (!window.METAWIKI_DATA.forumTopics || window.METAWIKI_DATA.forumTopics.length === 0) {
        window.METAWIKI_DATA.forumTopics = this.posts;
      }
      return this.posts;
    }

    getPostById(postId) {
      return this.posts.find(p => String(p.id) === String(postId));
    }

    addPost(title, category, body) {
      const session = window.METAWIKI_AUTH ? window.METAWIKI_AUTH.getSession() : null;
      const authorName = session ? session.username : 'Campton';
      const authorAvatar = session ? session.avatar : 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256';

      const cleanCat = String(category || 'Metaphysical Debate').replace(/^r\//i, '').trim();
      const cleanUser = String(authorName).replace(/^u\//i, '').replace(/^@/, '').trim();

      const newPost = {
        id: 'topic-' + Date.now(),
        title: title,
        category: cleanCat,
        author: cleanUser,
        avatar: authorAvatar,
        handle: `@${cleanUser}`,
        body: body,
        repliesCount: 0,
        upvotes: 1,
        timestamp: 'Just now',
        repliesList: []
      };

      this.posts.unshift(newPost);
      window.METAWIKI_DATA.forumTopics = this.posts;

      try {
        const userPosts = this.posts.filter(p => p.id !== OFFICIAL_CAMPTON_TEST_POST.id);
        localStorage.setItem('metawiki_user_posts', JSON.stringify(userPosts));
      } catch(e) {}

      if (window.METAWIKI_FORUM_SERVICE) {
        try {
          window.METAWIKI_FORUM_SERVICE.createPost(title, cleanCat, body).catch(() => {});
        } catch(e) {}
      }

      return newPost;
    }

    getComments(postId) {
      const post = this.getPostById(postId);
      if (this.commentsMap[postId]) {
        return this.commentsMap[postId];
      }
      return post ? (post.repliesList || []) : [];
    }

    addComment(postId, text) {
      const post = this.getPostById(postId);
      if (!post) return null;

      const session = window.METAWIKI_AUTH ? window.METAWIKI_AUTH.getSession() : null;
      const authorName = session ? session.username : 'Campton';
      const authorAvatar = session ? session.avatar : 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256';
      const cleanUser = String(authorName).replace(/^u\//i, '').replace(/^@/, '').trim();

      const newComment = {
        id: 'reply-' + Date.now(),
        author: cleanUser,
        avatar: authorAvatar,
        handle: `@${cleanUser}`,
        body: text,
        time: 'Just now'
      };

      post.repliesList = post.repliesList || [];
      post.repliesList.push(newComment);
      post.repliesCount = post.repliesList.length;

      this.commentsMap[postId] = post.repliesList;

      try {
        localStorage.setItem('metawiki_user_comments', JSON.stringify(this.commentsMap));
      } catch(e) {}

      if (window.METAWIKI_FORUM_SERVICE) {
        try {
          window.METAWIKI_FORUM_SERVICE.createComment(postId, text).catch(() => {});
        } catch(e) {}
      }

      return newComment;
    }

    toggleVote(postId) {
      const post = this.getPostById(postId);
      if (!post) return 0;

      const currentVote = this.votesMap[postId] || 0;
      const newVote = currentVote === 1 ? 0 : 1;
      this.votesMap[postId] = newVote;

      try {
        localStorage.setItem('metawiki_forum_votes', JSON.stringify(this.votesMap));
      } catch(e) {}

      if (window.METAWIKI_FORUM_SERVICE && typeof window.METAWIKI_FORUM_SERVICE.toggleUpvote === 'function') {
        try {
          window.METAWIKI_FORUM_SERVICE.toggleUpvote(postId, newVote).catch(() => {});
        } catch(e) {}
      }

      return newVote;
    }

    getVoteStatus(postId) {
      return this.votesMap[postId] || 0;
    }
  }

  window.METAWIKI_FORUM_STORE = new ForumStore();

})(window);
