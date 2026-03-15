# Hypnotic — Go-Live Instructions
## How to connect Supabase, configure API keys, and deploy Edge Functions

---

## STEP 1: Create Supabase Project

1. Go to https://supabase.com → New Project
2. Name: `hypnotic-prod`
3. Set a strong database password — save it
4. Region: `ap-south-1` (Mumbai) or `us-east-1`
5. After creation, go to **Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret, server only)

---

## STEP 2: Run Database Migrations

In the Supabase Dashboard → **SQL Editor**, run each file in order:

```
supabase/migrations/001_user_profiles.sql
supabase/migrations/002_projects.sql
supabase/migrations/003_insight_runs.sql
supabase/migrations/004_manifest_runs.sql
supabase/migrations/005_ai_models.sql
supabase/migrations/006_craft_assets.sql
supabase/migrations/007_amplify.sql
supabase/migrations/008_workspace.sql
supabase/migrations/009_marketplace.sql
supabase/migrations/010_subscriptions.sql
supabase/migrations/011_ai_usage_log.sql
supabase/migrations/012_system_prompts.sql
supabase/migrations/013_helpers.sql
supabase/migrations/014_seed_data.sql   ← Run last (seeds models + prompts)
```

Or using the CLI (after `supabase link --project-ref YOUR_PROJECT_REF`):
```bash
supabase db push
```

---

## STEP 3: Configure Supabase Auth

In Supabase Dashboard → **Authentication → Providers**:

### Email (required)
- Enable Email → ✓ Enable Email Signup
- Enable Email Confirmations → on (for production)
- SMTP: Configure with your email provider (Resend recommended)

### Google OAuth (required)
1. Go to https://console.cloud.google.com → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Authorized redirect URIs: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. In Supabase → Authentication → Providers → Google:
   - Client ID: paste from Google Console
   - Client Secret: paste from Google Console

### Site URL
In Supabase → Authentication → URL Configuration:
- Site URL: `https://your-app.vercel.app` (or your domain)
- Redirect URLs: add `https://your-app.vercel.app/**`

---

## STEP 4: Get Required API Keys

### AI (required for Insight + Manifest)
- **OpenRouter**: https://openrouter.ai → Dashboard → Keys → Create key
  - Single key covers Claude, GPT-4o, Gemini — recommended

### Web Search (required for Insight research)  
- **Exa**: https://exa.ai → Get API Key (best semantic search)
- **SerpAPI**: https://serpapi.com → Dashboard (Google results fallback)

### Image/Video Generation (required for Craft)
- **fal.ai**: https://fal.ai → Dashboard → Keys
  - Covers: Flux, Kling, Seedream, Runway, Wan, Hailuo, Suno, ElevenLabs

### Audio/Voice (required for Craft audio)
- **ElevenLabs**: https://elevenlabs.io → Profile → API Keys

### Billing (required for paid plans)
- **Stripe**: https://dashboard.stripe.com → Developers → API Keys
  - Copy: Publishable key, Secret key
  - Run `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook` for local webhook testing

---

## STEP 5: Create .env.local

Copy `.env.example` to `.env.local` and fill in:

```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key

# AI (use OpenRouter for one key that covers everything)
VITE_OPENROUTER_API_KEY=sk-or-...

# Web Search
VITE_EXA_API_KEY=...
VITE_SERPAPI_KEY=...

# Generation
VITE_FAL_API_KEY=...
VITE_ELEVENLABS_API_KEY=...

# Billing
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App
VITE_APP_URL=https://your-app.vercel.app
```

---

## STEP 6: Deploy Edge Functions

Install Supabase CLI:
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Deploy all Edge Functions with secrets:
```bash
# Set secrets (server-only keys — never in VITE_ vars)
supabase secrets set OPENROUTER_API_KEY=sk-or-...
supabase secrets set EXA_API_KEY=...
supabase secrets set SERPAPI_KEY=...
supabase secrets set BRAVE_SEARCH_API_KEY=...
supabase secrets set FAL_API_KEY=...
supabase secrets set RUNWAY_API_KEY=...
supabase secrets set ELEVENLABS_API_KEY=...
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set CRON_SECRET=$(openssl rand -base64 32)

# Deploy functions
supabase functions deploy insight-research
supabase functions deploy manifest-generate
supabase functions deploy craft-generate
```

---

## STEP 7: Create Stripe Products

In https://dashboard.stripe.com → Products → Create product:

| Product Name | Price | Interval | Notes |
|---|---|---|---|
| Starter | ₹1,999 or $24 | monthly | Copy price_id → STRIPE_PRICE_STARTER |
| Pro | ₹4,999 or $59 | monthly | Copy price_id → STRIPE_PRICE_PRO |
| Agency | ₹14,999 or $179 | monthly | Copy price_id → STRIPE_PRICE_AGENCY |
| Credits 50 | ₹499 or $6 | one-time | Copy price_id → STRIPE_PRICE_CREDITS_50 |
| Credits 200 | ₹1,499 or $18 | one-time | Copy price_id → STRIPE_PRICE_CREDITS_200 |
| Credits 500 | ₹2,999 or $35 | one-time | Copy price_id → STRIPE_PRICE_CREDITS_500 |

Add these to Supabase secrets:
```bash
supabase secrets set STRIPE_PRICE_STARTER=price_...
supabase secrets set STRIPE_PRICE_PRO=price_...
supabase secrets set STRIPE_PRICE_AGENCY=price_...
```

---

## STEP 8: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set all env vars in Vercel dashboard
# Project → Settings → Environment Variables
# Add all variables from .env.local
# CRITICAL: Do NOT add STRIPE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY as VITE_ vars
```

Add to `vercel.json` (create at project root):
```json
{
  "crons": [
    { "path": "/api/cron/publish-scheduled", "schedule": "*/5 * * * *" },
    { "path": "/api/cron/refresh-models", "schedule": "0 0 * * 0" }
  ]
}
```

---

## STEP 9: Test the Full Flow

1. Go to your deployed URL → `/signup`
2. Create account with Google OAuth
3. Complete onboarding (role + use case)
4. Run an Insight research on a brand name
5. Watch 8 source categories animate as Edge Function runs
6. View completed report with archetype + strategic routes
7. Click "Take to Manifest" → generate a strategy deck
8. Watch sections stream in one by one
9. Navigate to Craft → test image generation (requires FAL_API_KEY)

---

## STEP 10: Verify Supabase Tables

After signup, check in Supabase Table Editor:
- `user_profiles` → should have 1 row with your email
- `user_subscriptions` → should have 1 row with plan='free', credits=50
- `projects` → should have 1 row (auto-created in onboarding)

If rows are missing, check that migration `001_user_profiles.sql` trigger ran correctly.

---

## Current Status (commit c1a339f)

| Module | UI | Backend | Edge Function | Notes |
|---|---|---|---|---|
| Auth | ✅ | ✅ | — | Real Supabase auth |
| Insight | ✅ | ✅ | ✅ | Calls insight-research EF |
| Manifest | ✅ | ✅ | ✅ | SSE streaming |
| Craft | ✅ | Partial | ✅ | fal.ai routing built, UI demo mode |
| Amplify | ✅ | Partial | — | Scheduling UI built, OAuth pending |
| Workspace | ✅ | — | — | Auto-populates from stores |
| Marketplace | ✅ | — | — | UI built, Stripe Connect pending |
| Billing | ✅ | — | — | Stripe checkout Edge Function pending |
| Admin | ✅ | — | — | Prompts editor + models management |
