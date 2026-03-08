import { create } from 'zustand';
import type { InsightReport } from '@/types';

interface InsightState {
  reports: InsightReport[];
  currentReport: InsightReport | null;
  isResearching: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setReports: (reports: InsightReport[]) => void;
  addReport: (report: InsightReport) => void;
  updateReport: (id: string, updates: Partial<InsightReport>) => void;
  setCurrentReport: (report: InsightReport | null) => void;
  setIsResearching: (value: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Server data - no persistence
export const useInsightStore = create<InsightState>((set) => ({
  reports: [],
  currentReport: null,
  isResearching: false,
  isLoading: false,
  error: null,
  
  setReports: (reports) => set({ reports }),
  addReport: (report) => set((state) => ({
    reports: [report, ...state.reports]
  })),
  updateReport: (id, updates) => set((state) => ({
    reports: state.reports.map(r => 
      r.id === id ? { ...r, ...updates } : r
    ),
    currentReport: state.currentReport?.id === id 
      ? { ...state.currentReport, ...updates }
      : state.currentReport
  })),
  setCurrentReport: (report) => set({ currentReport: report }),
  setIsResearching: (value) => set({ isResearching: value }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
