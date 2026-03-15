-- ─── 015: Admin User Setup ───────────────────────────────────────────────────
-- Run this in Supabase SQL Editor after adding yourself via Auth → Users
-- Replace 'your-email@gmail.com' with your actual email

-- Step 1: Create/update user_profiles for admin user
INSERT INTO public.user_profiles (
  id, email, name, role, plan, credits, onboarded, status
)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  'admin',   -- role
  'pro',     -- plan (full access for admin)
  500,       -- credits
  true,      -- onboarded (skip onboarding)
  'active'
FROM auth.users u
WHERE u.email = 'niddhishp@gmail.com'  -- ← change this to your email if different
ON CONFLICT (id) DO UPDATE SET
  role      = 'admin',
  plan      = 'pro',
  credits   = 500,
  onboarded = true;

-- Step 2: Create/update user_subscriptions
INSERT INTO public.user_subscriptions (
  user_id, plan, status, generation_credits
)
SELECT 
  id, 'pro', 'active', 500
FROM auth.users 
WHERE email = 'niddhishp@gmail.com'  -- ← same email
ON CONFLICT (user_id) DO UPDATE SET
  plan               = 'pro',
  status             = 'active',
  generation_credits = 500;

-- Verify it worked
SELECT 
  u.email,
  p.role,
  p.plan,
  p.credits,
  p.onboarded,
  s.generation_credits
FROM auth.users u
LEFT JOIN public.user_profiles p ON p.id = u.id
LEFT JOIN public.user_subscriptions s ON s.user_id = u.id
WHERE u.email = 'niddhishp@gmail.com';
