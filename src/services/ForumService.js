/**
 * MetaWiki - Production Forum Service for Supabase Integration
 * Handles fetching live posts, creating posts linked to Discord profiles,
 * submitting replies, and toggling upvotes in Supabase.
 */

(function (window) {
  'use strict';

  const SUPABASE_URL = 'https://qcqbinlijrzzuvrseyii.supabase.co';

  class ForumService {
    constructor() {
      this.posts = [];
    }

    /**
     * Get Authorization Headers for Supabase REST API
     */
    getHeaders() {
      const headers = {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      };
      const session = window.METAWIKI_AUTH ? window.METAWIKI_AUTH.getSession() : null;
      if (session && session.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
      }
      if (window.METAWIKI_SUPABASE_ANON_KEY) {
        headers['apikey'] = window.METAWIKI_SUPABASE_ANON_KEY;
        if (!headers['Authorization']) {
          headers['Authorization'] = `Bearer ${window.METAWIKI_SUPABASE_ANON_KEY}`;
        }
      }
      return headers;
    }

    /**
     * Fetch Live Forum Posts from Supabase
     */
    async fetchPosts() {
      try {
        const headers = this.getHeaders();
        if (!headers['Authorization'] && !headers['apikey']) {
          return this.posts;
        }
        const res = await fetch(`${SUPABASE_URL}/rest/v1/forum_posts?select=*,profiles(*)&order=created_at.desc`, {
          headers: headers
        });
        if (res.ok) {
          const rawData = await res.json();
          this.posts = rawData.map(p => this.formatPost(p));
          return this.posts;
        }
      } catch (e) {
        console.warn('Could not fetch posts from Supabase REST API:', e);
      }
      return this.posts;
    }

    /**
     * Format Supabase post database record to UI schema
     */
    formatPost(p) {
      const profile = p.profiles || {};
      const date = p.created_at ? new Date(p.created_at) : new Date();
      const timeAgo = this.getTimeAgo(date);

      return {
        id: p.id,
        title: p.title,
        category: p.category || 'General',
        body: p.body,
        author: profile.username || 'Campton',
        avatar: profile.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png',
        handle: profile.handle ? `@${profile.handle}` : '@campton',
        upvotes: p.upvotes_count || 0,
        repliesCount: p.replies_count || 0,
        timestamp: timeAgo,
        created_at: p.created_at,
        repliesList: []
      };
    }

    getTimeAgo(date) {
      const seconds = Math.floor((new Date() - date) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return date.toLocaleDateString();
    }

    /**
     * Create New Discussion Topic linked to User Profile
     */
    async createPost(title, category, body) {
      const session = window.METAWIKI_AUTH ? window.METAWIKI_AUTH.getSession() : null;
      
      const newLocalPost = {
        id: 'post-' + Date.now(),
        title: title,
        category: category || 'General',
        body: body,
        author: session ? session.username : 'Campton',
        avatar: session ? session.avatar : 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
        handle: session ? session.fullHandle : '@campton',
        upvotes: 1,
        repliesCount: 0,
        timestamp: 'Just now',
        repliesList: []
      };

      if (session && session.id && session.token) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/forum_posts`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
              author_id: session.id,
              title: title,
              category: category || 'General',
              body: body
            })
          });
          if (res.ok) {
            const inserted = await res.json();
            if (inserted && inserted[0]) {
              return this.formatPost(inserted[0]);
            }
          }
        } catch (e) {
          console.warn('Supabase post creation error:', e);
        }
      }

      this.posts.unshift(newLocalPost);
      return newLocalPost;
    }

    /**
     * Fetch Replies/Comments for a Post
     */
    async fetchComments(postId) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/forum_comments?post_id=eq.${postId}&select=*,profiles(*)&order=created_at.asc`, {
          headers: this.getHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          return data.map(c => ({
            id: c.id,
            author: c.profiles?.username || 'Campton',
            avatar: c.profiles?.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png',
            body: c.body,
            time: this.getTimeAgo(new Date(c.created_at))
          }));
        }
      } catch (e) {}
      return [];
    }

    /**
     * Submit Reply to a Post
     */
    async createComment(postId, bodyText) {
      const session = window.METAWIKI_AUTH ? window.METAWIKI_AUTH.getSession() : null;
      const commentObj = {
        id: 'reply-' + Date.now(),
        author: session ? session.username : 'Campton',
        avatar: session ? session.avatar : 'https://cdn.discordapp.com/avatars/400161052383379457/caf6e3529ab582bb5ff31fe9cb0ce5ee.png?size=256',
        body: bodyText,
        time: 'Just now'
      };

      if (session && session.id && session.token) {
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/forum_comments`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
              post_id: postId,
              author_id: session.id,
              body: bodyText
            })
          });
        } catch (e) {}
      }

      return commentObj;
    }

    /**
     * Toggle or update post upvote count in Supabase backend
     */
    async toggleUpvote(postId, newVote) {
      try {
        const headers = this.getHeaders();
        const post = window.METAWIKI_FORUM_STORE ? window.METAWIKI_FORUM_STORE.getPostById(postId) : null;
        const baseUpvotes = post ? (post.upvotes || 0) : 0;
        const netCount = Math.max(0, baseUpvotes + (newVote === 1 ? 1 : 0));

        if (headers['Authorization'] || headers['apikey']) {
          await fetch(`${SUPABASE_URL}/rest/v1/forum_posts?id=eq.${postId}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({
              upvotes_count: netCount
            })
          });
        }
        return netCount;
      } catch (e) {
        console.warn('Could not sync upvote to Supabase backend:', e);
      }
      return 0;
    }
  }

  window.METAWIKI_FORUM_SERVICE = new ForumService();

})(window);
