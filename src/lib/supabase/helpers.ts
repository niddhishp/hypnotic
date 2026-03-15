// Type-safe helpers for Supabase operations
// Uses 'as any' casts where supabase-js v2.98 type inference breaks
// Replace with proper generated types once Supabase project is connected

import { supabase } from './client';

// Typed profile fetch
export async function getProfile(userId: string) {
  const { data, error } = await (supabase as any)
    .from('user_profiles')
    .select('id, email, name, role, plan, credits, avatar_url, status')
    .eq('id', userId)
    .single();
  return { data: data as {
    id: string; email: string; name: string | null;
    role: string; plan: string; credits: number;
    avatar_url: string | null; status: string;
  } | null, error };
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  return (supabase as any)
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId);
}

export async function createProject(data: { user_id: string; name: string; status?: string }) {
  return (supabase as any)
    .from('projects')
    .insert(data)
    .select()
    .single();
}

export async function getProjects(userId: string) {
  return (supabase as any)
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
}

export async function createInsightRun(data: {
  project_id: string; user_id: string; subject: string; context?: string;
}) {
  return (supabase as any)
    .from('insight_runs')
    .insert({ ...data, status: 'researching' })
    .select()
    .single();
}

export async function getInsightRuns(projectId: string) {
  return (supabase as any)
    .from('insight_runs')
    .select('id, subject, status, executive_summary, brand_archetype, problem_statement, confidence_score, sources_searched, strategic_routes, created_at, completed_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
}

export async function getInsightRun(runId: string) {
  return (supabase as any)
    .from('insight_runs')
    .select('*')
    .eq('id', runId)
    .single();
}

export async function createManifestRun(data: {
  project_id: string; user_id: string; output_type: string;
  insight_run_id?: string; custom_brief?: string; input_type?: string;
}) {
  return (supabase as any)
    .from('manifest_runs')
    .insert({ ...data, status: 'generating', sections: {} })
    .select()
    .single();
}

export async function getManifestRuns(projectId: string) {
  return (supabase as any)
    .from('manifest_runs')
    .select('id, output_type, title, status, sections, created_at, updated_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
}

export async function createCraftAsset(data: {
  project_id: string; user_id: string; type: string;
  model_id?: string; prompt?: string; manifest_run_id?: string;
}) {
  return (supabase as any)
    .from('craft_assets')
    .insert({ ...data, status: 'draft' })
    .select()
    .single();
}

export async function getUserSubscription(userId: string) {
  return (supabase as any)
    .from('user_subscriptions')
    .select('plan, status, generation_credits, current_period_end, trial_ends_at')
    .eq('user_id', userId)
    .single();
}
