import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { ManifestDeck } from '@/types';

interface ManifestState {
  decks: ManifestDeck[];
  currentDeck: ManifestDeck | null;
  isGenerating: boolean;
  isLoading: boolean;
  error: string | null;

  fetchDecks:     (projectId: string) => Promise<void>;
  addDeck:        (deck: ManifestDeck) => void;
  updateDeck:     (id: string, updates: Partial<ManifestDeck>) => void;
  setCurrentDeck: (deck: ManifestDeck | null) => void;
  setIsGenerating:(value: boolean) => void;
  setLoading:     (loading: boolean) => void;
  setError:       (error: string | null) => void;
  setDecks:       (decks: ManifestDeck[]) => void;
}

export const useManifestStore = create<ManifestState>((set) => ({
  decks: [],
  currentDeck: null,
  isGenerating: false,
  isLoading: false,
  error: null,

  fetchDecks: async (projectId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await (supabase as any)
        .from('manifest_runs')
        .select('id, project_id, output_type, title, status, sections, created_at, updated_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const decks: ManifestDeck[] = (data ?? []).map((r: any) => ({
        id:         r.id,
        projectId:  r.project_id,
        outputType: r.output_type,
        title:      r.title ?? r.output_type,
        status:     r.status,
        sections:   r.sections ?? {},
        sectionCount: Object.keys(r.sections ?? {}).length,
        createdAt:  r.created_at,
        updatedAt:  r.updated_at,
      }));

      set({ decks, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addDeck:        (deck)        => set(s => ({ decks: [deck, ...s.decks] })),
  updateDeck:     (id, updates) => set(s => ({
    decks: s.decks.map(d => d.id === id ? { ...d, ...updates } : d),
    currentDeck: s.currentDeck?.id === id ? { ...s.currentDeck!, ...updates } : s.currentDeck,
  })),
  setCurrentDeck: (d) => set({ currentDeck: d }),
  setIsGenerating:(v) => set({ isGenerating: v }),
  setLoading:     (v) => set({ isLoading: v }),
  setError:       (e) => set({ error: e }),
  setDecks:       (d) => set({ decks: d }),
}));
