import { create } from 'zustand';
import type { CraftAsset } from '@/types';

interface CraftState {
  assets: CraftAsset[];
  currentAsset: CraftAsset | null;
  isGenerating: boolean;
  isLoading: boolean;
  error: string | null;
  selectedType: 'image' | 'video' | 'audio';
  
  // Actions
  setAssets: (assets: CraftAsset[]) => void;
  addAsset: (asset: CraftAsset) => void;
  updateAsset: (id: string, updates: Partial<CraftAsset>) => void;
  setCurrentAsset: (asset: CraftAsset | null) => void;
  setIsGenerating: (value: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedType: (type: 'image' | 'video' | 'audio') => void;
}

// Server data - no persistence
export const useCraftStore = create<CraftState>((set) => ({
  assets: [],
  currentAsset: null,
  isGenerating: false,
  isLoading: false,
  error: null,
  selectedType: 'image',
  
  setAssets: (assets) => set({ assets }),
  addAsset: (asset) => set((state) => ({
    assets: [asset, ...state.assets]
  })),
  updateAsset: (id, updates) => set((state) => ({
    assets: state.assets.map(a => 
      a.id === id ? { ...a, ...updates } : a
    )
  })),
  setCurrentAsset: (asset) => set({ currentAsset: asset }),
  setIsGenerating: (value) => set({ isGenerating: value }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSelectedType: (type) => set({ selectedType: type }),
}));
