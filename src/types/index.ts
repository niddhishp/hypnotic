// Hypnotic Types

export type UserRole = 'creator' | 'agency' | 'expert' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  plan: 'free' | 'starter' | 'pro' | 'agency';
  credits: number;
  status?: 'active' | 'suspended' | 'pending';
  lastActive?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

// Insight Types
export interface InsightReport {
  id: string;
  projectId: string;
  subject: string;
  status: 'researching' | 'complete' | 'failed';
  executiveSummary?: string;
  whatDataShows?: ReportSection;
  audienceSignals?: AudienceSection;
  competitiveLandscape?: CompSection;
  culturalTension?: CultureSection;
  brandArchetype?: ArchetypeSection;
  problemStatement?: string;
  strategicRoutes?: StrategicRoute[];
  confidenceScore?: number;
  createdAt: string;
}

export interface ReportSection {
  title: string;
  content: string;
  keyFindings: string[];
}

export interface AudienceSection {
  primaryPersona: Persona;
  secondaryPersonas: Persona[];
  psychographics: string[];
  culturalInsights: string[];
}

export interface Persona {
  name: string;
  age: string;
  description: string;
  motivations: string[];
  frustrations: string[];
  aspirations: string[];
  mediaHabits: string[];
}

export interface CompSection {
  keyPlayers: Competitor[];
  gaps: string[];
  whitespace: string;
}

export interface Competitor {
  name: string;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
}

export interface CultureSection {
  trends: string[];
  tensions: string[];
  opportunities: string[];
}

export interface ArchetypeSection {
  archetype: string;
  confidence: number;
  rationale: string;
  traits: string[];
}

export interface StrategicRoute {
  id: string;
  label: string;
  oneLiner: string;
  fullDirection: string;
  implications: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

// Manifest Types
export interface ManifestDeck {
  id: string;
  projectId: string;
  title: string;
  outputType?: string;
  sections: DeckSection[];
  status: 'generating' | 'complete';
  createdAt: string;
}

export interface DeckSection {
  id: string;
  title: string;
  content: string;
  icon: string;
}

export interface FilmScript {
  id: string;
  projectId: string;
  title: string;
  genre: string;
  scenes: ScriptScene[];
  characters: Character[];
  duration: string;
}

export interface ScriptScene {
  id: string;
  sceneNumber: number;
  heading: string;
  action: string;
  dialogue?: DialogueLine[];
  visualNote?: string;
}

export interface DialogueLine {
  character: string;
  line: string;
}

export interface Character {
  name: string;
  archetype: string;
  backstory: string;
  motivation: string;
}

// Craft Types
export type AssetType = 'image' | 'video' | 'audio';
export type AssetStatus = 'draft' | 'in_review' | 'approved' | 'rejected';

export interface CraftAsset {
  id: string;
  projectId: string;
  type: AssetType;
  url: string;
  thumbnailUrl?: string;
  prompt: string;
  model: string;
  status: AssetStatus;
  dimensions?: { width: number; height: number };
  duration?: number;
  createdAt: string;
}

export interface GenerationModel {
  id: string;
  name: string;
  provider: string;
  type: AssetType | 'voice';
  tier: 'fast' | 'quality' | 'ultra';
  isActive: boolean;
  lastVerified?: string;
  costPerImage?: number;
  costPerSecond?: number;
  costPerChar?: number;
  costPerSong?: number;
}

// Amplify Types
export interface ScheduledPost {
  id: string;
  projectId: string;
  assetId: string;
  platform: string;
  caption: string;
  hashtags: string[];
  scheduledAt?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  maxCaptionLength: number;
}

// Workspace Types
export interface WorkspaceNode {
  id: string;
  type: 'insight' | 'manifest' | 'craft' | 'amplify';
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    status: 'pending' | 'in_progress' | 'complete';
  };
}

export interface WorkspaceEdge {
  id: string;
  source: string;
  target: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: string;
}

export interface ChatContext {
  activeModule?: string;
  projectId?: string;
  insightReport?: InsightReport;
  manifestDeck?: ManifestDeck;
  recentAssets?: CraftAsset[];
}
