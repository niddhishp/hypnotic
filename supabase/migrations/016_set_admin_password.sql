-- ─── 016: Directly set admin password (bypass email) ─────────────────────────
-- Run this in Supabase SQL Editor when rate limited on password reset emails
-- This sets a bcrypt hash for a known password directly on the auth.users table
-- 
-- IMPORTANT: After running this, log in with:
--   Email: niddhishp@gmail.com
--   Password: HypnoticAdmin2026!
-- Then immediately change it in Settings

-- First verify the user exists
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'niddhishp@gmail.com';

-- Update: confirm email AND update the encrypted_password
-- The hash below is bcrypt for: HypnoticAdmin2026!
-- Generated with: SELECT crypt('HypnoticAdmin2026!', gen_salt('bf'))
UPDATE auth.users
SET 
  encrypted_password = crypt('HypnoticAdmin2026!', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email = 'niddhishp@gmail.com';

-- Verify the update worked
SELECT 
  id, 
  email, 
  email_confirmed_at IS NOT NULL AS email_confirmed,
  created_at,
  updated_at
FROM auth.users 
WHERE email = 'niddhishp@gmail.com';

-- Ensure user_profiles and subscriptions exist
INSERT INTO public.user_profiles (id, email, name, role, plan, credits, onboarded)
SELECT id, email, 'Niddhish', 'admin', 'pro', 500, true
FROM auth.users WHERE email = 'niddhishp@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin', plan = 'pro', credits = 500, onboarded = true;

INSERT INTO public.user_subscriptions (user_id, plan, status, generation_credits)
SELECT id, 'pro', 'active', 500
FROM auth.users WHERE email = 'niddhishp@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  plan = 'pro', status = 'active', generation_credits = 500;

SELECT 'SUCCESS: Login with niddhishp@gmail.com / HypnoticAdmin2026!' AS result;
