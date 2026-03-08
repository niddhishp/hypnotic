import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  // Supabase
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(10).optional(),
  
  // AI Providers (optional for now)
  VITE_OPENAI_API_KEY: z.string().optional(),
  VITE_ANTHROPIC_API_KEY: z.string().optional(),
  
  // App URL
  VITE_APP_URL: z.string().url().default('http://localhost:5173'),
});

// Parse and validate environment variables
const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Environment validation errors:', parsed.error.flatten().fieldErrors);
}

export const env = parsed.success ? parsed.data : {
  VITE_SUPABASE_URL: '',
  VITE_SUPABASE_ANON_KEY: '',
  VITE_OPENAI_API_KEY: '',
  VITE_ANTHROPIC_API_KEY: '',
  VITE_APP_URL: 'http://localhost:5173',
};

// Helper to check if required env vars are present
export const hasRequiredEnv = () => {
  return Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY);
};
