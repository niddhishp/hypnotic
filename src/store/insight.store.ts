import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { InsightReport } from '@/types';

interface InsightState {
  reports: InsightReport[];
  currentReport: InsightReport | null;
  isResearching: boolean;
  isLoading: boolean;
  error: string | null;

  fetchReports:     (projectId: string) => Promise<void>;
  addReport:        (report: InsightReport) => void;
  updateReport:     (id: string, updates: Partial<InsightReport>) => void;
  setCurrentReport: (report: InsightReport | null) => void;
  setIsResearching: (value: boolean) => void;
  setLoading:       (loading: boolean) => void;
  setError:         (error: string | null) => void;
  setReports:       (reports: InsightReport[]) => void;
}

export const useInsightStore = create<InsightState>((set) => ({
  reports: [],
  currentReport: null,
  isResearching: false,
  isLoading: false,
  error: null,

  fetchReports: async (projectId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await (supabase as any)
        .from('insight_runs')
        .select('id, project_id, subject, status, executive_summary, problem_statement, brand_archetype, confidence_score, sources_searched, strategic_routes, created_at, completed_at')
        .eq('project_id', projectId)
        .in('status', ['complete', 'researching'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reports: InsightReport[] = (data ?? []).map((r: any) => ({
        id:                r.id,
        projectId:         r.project_id,
        subject:           r.subject,
        status:            r.status,
        executiveSummary:  r.executive_summary,
        problemStatement:  r.problem_statement,
        brandArchetype:    r.brand_archetype,
        confidenceScore:   r.confidence_score,
        strategicRoutes:   r.strategic_routes,
        createdAt:         r.created_at,
        completedAt:       r.completed_at,
        sourcesSearched:   r.sources_searched ?? 0,
      }));

      set({ reports, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  addReport:        (report)        => set(s => ({ reports: [report, ...s.reports] })),
  updateReport:     (id, updates)   => set(s => ({
    reports: s.reports.map(r => r.id === id ? { ...r, ...updates } : r),
    currentReport: s.currentReport?.id === id ? { ...s.currentReport!, ...updates } : s.currentReport,
  })),
  setCurrentReport: (r)   => set({ currentReport: r }),
  setIsResearching: (v)   => set({ isResearching: v }),
  setLoading:       (v)   => set({ isLoading: v }),
  setError:         (e)   => set({ error: e }),
  setReports:       (r)   => set({ reports: r }),
}));
