import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  activeModule: string;
  theme: 'dark' | 'light' | 'system';
  
  // Actions
  setSidebarCollapsed: (value: boolean) => void;
  setActiveModule: (module: string) => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  toggleSidebar: () => void;
}

// UI preferences - can be persisted
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeModule: 'dashboard',
      theme: 'dark',
      
      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
      setActiveModule: (module) => set({ activeModule: module }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    { name: 'hypnotic-ui-preferences' }
  )
);
