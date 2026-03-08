import { create } from 'zustand';
import type { ManifestDeck } from '@/types';

interface ManifestState {
  decks: ManifestDeck[];
  currentDeck: ManifestDeck | null;
  isGenerating: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setDecks: (decks: ManifestDeck[]) => void;
  addDeck: (deck: ManifestDeck) => void;
  updateDeck: (id: string, updates: Partial<ManifestDeck>) => void;
  setCurrentDeck: (deck: ManifestDeck | null) => void;
  setIsGenerating: (value: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Server data - no persistence
export const useManifestStore = create<ManifestState>((set) => ({
  decks: [],
  currentDeck: null,
  isGenerating: false,
  isLoading: false,
  error: null,
  
  setDecks: (decks) => set({ decks }),
  addDeck: (deck) => set((state) => ({
    decks: [deck, ...state.decks]
  })),
  updateDeck: (id, updates) => set((state) => ({
    decks: state.decks.map(d => 
      d.id === id ? { ...d, ...updates } : d
    ),
    currentDeck: state.currentDeck?.id === id
      ? { ...state.currentDeck, ...updates }
      : state.currentDeck
  })),
  setCurrentDeck: (deck) => set({ currentDeck: deck }),
  setIsGenerating: (value) => set({ isGenerating: value }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
