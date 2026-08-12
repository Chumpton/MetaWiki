# Step-by-Step Guidance: Supabase Backend & Vercel Deployment

This guide provides step-by-step instructions for attaching a real **Supabase Authentication & Database backend** and deploying to **Vercel**.

---

## Step 1: Setting Up Supabase (Database & Authentication)

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and create a free project.
   - Note down your **Project URL** (e.g. `https://xyzcompany.supabase.co`) and **Anon Public Key** (e.g. `eyJhbGciOi...`).

2. **Configure Discord OAuth in Supabase**:
   - In your Supabase Dashboard, navigate to **Authentication** $\rightarrow$ **Providers** $\rightarrow$ **Discord**.
   - Enable Discord authentication.
   - Copy the **Callback URL** provided by Supabase (e.g. `https://xyzcompany.supabase.co/auth/v1/callback`).
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications), select your App $\rightarrow$ **OAuth2**, and add the Supabase Callback URL to your Redirect URIs.
   - Paste your Discord **Client ID** and **Client Secret** into the Supabase Discord provider configuration.

3. **Initialize Supabase in MetaWiki**:
   Add the following snippet in your client configuration or environment variables:
   ```javascript
   const SUPABASE_URL = "https://your-project.supabase.co";
   const SUPABASE_ANON_KEY = "your-anon-key";
   
   // Attach Supabase Provider to MetaWiki Auth
   window.METAWIKI_AUTH.initSupabase(SUPABASE_URL, SUPABASE_ANON_KEY);
   ```

---

## Step 2: Deploying to Vercel (Serverless Functions)

1. **Environment Variables on Vercel**:
   In your Vercel Project Settings $\rightarrow$ **Environment Variables**, add:
   ```env
   DISCORD_CLIENT_ID="your_discord_client_id"
   DISCORD_CLIENT_SECRET="your_discord_client_secret"
   DISCORD_BOT_TOKEN="Bot your_bot_token"
   TARGET_GUILD_ID="987654321098765432"
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

2. **Serverless API Route (`api/auth/discord/verify-guild.js`)**:
   Vercel handles serverless functions automatically inside the `/api` directory.
   The `/api/auth/discord/verify-guild.js` route queries Discord's Bot API to verify guild membership before issuing session tokens.

3. **Deploying Command**:
   ```bash
   npx vercel
   ```

---

## Step 3: Local & Automated Testing Commands

- **Run Automated Auth & Session Test Suite**:
  ```bash
  node scripts/test_auth_real.js
  ```
- **Run Discord-Gated Site Test Suite**:
  ```bash
  npm run test:e2e
  ```
