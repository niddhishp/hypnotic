import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, 
  Project, 
  InsightReport, 
  ManifestDeck, 
  CraftAsset, 
  ScheduledPost,
  ChatMessage 
} from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
    }),
    { name: 'hypnotic-auth' }
  )
);

// Projects Store
interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: [],
      currentProject: null,
      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((state) => ({
        projects: [project, ...state.projects]
      })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      })),
      setCurrentProject: (project) => set({ currentProject: project }),
    }),
    { name: 'hypnotic-projects' }
  )
);

// Insight Store
interface InsightState {
  reports: InsightReport[];
  currentReport: InsightReport | null;
  isResearching: boolean;
  setReports: (reports: InsightReport[]) => void;
  addReport: (report: InsightReport) => void;
  updateReport: (id: string, updates: Partial<InsightReport>) => void;
  setCurrentReport: (report: InsightReport | null) => void;
  setIsResearching: (value: boolean) => void;
}

export const useInsightStore = create<InsightState>()(
  persist(
    (set) => ({
      reports: [],
      currentReport: null,
      isResearching: false,
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
    }),
    { name: 'hypnotic-insight' }
  )
);

// Manifest Store
interface ManifestState {
  decks: ManifestDeck[];
  currentDeck: ManifestDeck | null;
  isGenerating: boolean;
  setDecks: (decks: ManifestDeck[]) => void;
  addDeck: (deck: ManifestDeck) => void;
  updateDeck: (id: string, updates: Partial<ManifestDeck>) => void;
  setCurrentDeck: (deck: ManifestDeck | null) => void;
  setIsGenerating: (value: boolean) => void;
}

export const useManifestStore = create<ManifestState>()(
  persist(
    (set) => ({
      decks: [],
      currentDeck: null,
      isGenerating: false,
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
    }),
    { name: 'hypnotic-manifest' }
  )
);

// Craft Store
interface CraftState {
  assets: CraftAsset[];
  currentAsset: CraftAsset | null;
  isGenerating: boolean;
  selectedType: 'image' | 'video' | 'audio';
  setAssets: (assets: CraftAsset[]) => void;
  addAsset: (asset: CraftAsset) => void;
  updateAsset: (id: string, updates: Partial<CraftAsset>) => void;
  setCurrentAsset: (asset: CraftAsset | null) => void;
  setIsGenerating: (value: boolean) => void;
  setSelectedType: (type: 'image' | 'video' | 'audio') => void;
}

export const useCraftStore = create<CraftState>()(
  persist(
    (set) => ({
      assets: [],
      currentAsset: null,
      isGenerating: false,
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
      setSelectedType: (type) => set({ selectedType: type }),
    }),
    { name: 'hypnotic-craft' }
  )
);

// Amplify Store
interface AmplifyState {
  posts: ScheduledPost[];
  currentPost: ScheduledPost | null;
  isPublishing: boolean;
  setPosts: (posts: ScheduledPost[]) => void;
  addPost: (post: ScheduledPost) => void;
  updatePost: (id: string, updates: Partial<ScheduledPost>) => void;
  setCurrentPost: (post: ScheduledPost | null) => void;
  setIsPublishing: (value: boolean) => void;
}

export const useAmplifyStore = create<AmplifyState>()(
  persist(
    (set) => ({
      posts: [],
      currentPost: null,
      isPublishing: false,
      setPosts: (posts) => set({ posts }),
      addPost: (post) => set((state) => ({
        posts: [post, ...state.posts]
      })),
      updatePost: (id, updates) => set((state) => ({
        posts: state.posts.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),
      setCurrentPost: (post) => set({ currentPost: post }),
      setIsPublishing: (value) => set({ isPublishing: value }),
    }),
    { name: 'hypnotic-amplify' }
  )
);

// Chat Store
interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  context: string;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setIsOpen: (value: boolean) => void;
  setIsTyping: (value: boolean) => void;
  setContext: (context: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isOpen: false,
      isTyping: false,
      context: '',
      setMessages: (messages) => set({ messages }),
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      clearMessages: () => set({ messages: [] }),
      setIsOpen: (value) => set({ isOpen: value }),
      setIsTyping: (value) => set({ isTyping: value }),
      setContext: (context) => set({ context }),
    }),
    { name: 'hypnotic-chat' }
  )
);

// UI Store
interface UIState {
  sidebarCollapsed: boolean;
  activeModule: string;
  setSidebarCollapsed: (value: boolean) => void;
  setActiveModule: (module: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeModule: 'dashboard',
      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
      setActiveModule: (module) => set({ activeModule: module }),
    }),
    { name: 'hypnotic-ui' }
  )
);
