# MetaWiki Supabase & Vercel Production Integration Guide

This guide reflects your active Supabase project and Vercel deployment link.

---

## Active Infrastructure Credentials

- **Supabase Project URL**: `https://qcqbinlijrzzuvrseyii.supabase.co`
- **Supabase Auth Callback URL**: `https://qcqbinlijrzzuvrseyii.supabase.co/auth/v1/callback`
- **Vercel Project Dashboard**: `https://vercel.com/chumptons-projects/meta-wiki`

---

## 1. Discord OAuth Setup in Discord Developer Portal

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Select your Application $\rightarrow$ **OAuth2** $\rightarrow$ **Redirects**.
3. Add your exact Supabase Callback URL:
   ```
   https://qcqbinlijrzzuvrseyii.supabase.co/auth/v1/callback
   ```
4. Copy your **Client ID** and **Client Secret**.

---

## 2. Supabase Provider Configuration

1. In your [Supabase Dashboard](https://supabase.com/dashboard/project/qcqbinlijrzzuvrseyii), navigate to **Authentication** $\rightarrow$ **Providers** $\rightarrow$ **Discord**.
2. Enable Discord Authentication.
3. Enter your Discord **Client ID** and **Client Secret**.
4. Save the configuration.

---

## 3. Vercel Environment Variables Configuration

Navigate to your Vercel Dashboard at [https://vercel.com/chumptons-projects/meta-wiki](https://vercel.com/chumptons-projects/meta-wiki) $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**, and add:

```env
NEXT_PUBLIC_SUPABASE_URL="https://qcqbinlijrzzuvrseyii.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_here"
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"
TARGET_GUILD_ID="987654321098765432"
```

---

## 4. Local & Automated Test Runner

Run the automated test runner to auto-check authentication states anytime:
```bash
node scripts/test_auth_real.js
```
