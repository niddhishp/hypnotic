// src/pages/dashboard/DashboardPage.tsx
// Campaign Command Centre.
// Shows active projects as pipeline progress cards.
// Context-aware: empty state changes based on what the user has done.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Scroll, Sparkles, Share2,
  ArrowRight, ChevronRight, Image as ImgIcon,
  Film, Music, FileText, Zap, Clock,
} from 'lucide-react';
import { useProjectsStore, useInsightStore, useManifestStore, useCraftStore } from '@/store';
import { useBrandMemoryStore } from '@/store/brand-memory.store';
import { SEO } from '@/components/shared/SEO';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

// ── Pipeline stage config ────────────────────────────────────────────────────

const STAGES = [
  { id: 'insight',  label: 'Insight',  icon: Search,   color: '#7aaee0', route: '/insight'  },
  { id: 'manifest', label: 'Manifest', icon: Scroll,   color: '#C9A96E', route: '/manifest' },
  { id: 'craft',    label: 'Craft',    icon: Sparkles, color: '#a07ae0', route: '/craft'    },
  { id: 'amplify',  label: 'Amplify',  icon: Share2,   color: '#7abf8e', route: '/amplify'  },
];

// ── Campaign card ────────────────────────────────────────────────────────────

function CampaignCard({
  project,
  onOpen,
  onContinue,
  completedStages,
  activeStage,
}: {
  project: Project;
  onOpen: () => void;
  onContinue: (route: string) => void;
  completedStages: number;  // 0–4
  activeStage: typeof STAGES[0] | null;
}) {
  const progress = (completedStages / 4) * 100;

  return (
    <div
      className="rounded-2xl border border-white/6 p-5 hover:border-white/12 transition-all group cursor-pointer"
      style={{ background: '#0D0D10' }}
      onClick={onOpen}
    >
      {/* Title row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-[#F0EDE8] truncate group-hover:text-white transition-colors">
            {project.name}
          </h3>
          {project.brand && (
            <p className="text-[11px] text-[#C9A96E]/70 mt-0.5">{project.brand}</p>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-[#2A2A2A] group-hover:text-[#C9A96E] transition-colors flex-shrink-0 mt-0.5" />
      </div>

      {/* Pipeline progress bar */}
      <div className="mb-3">
        <div className="flex items-center gap-1 mb-1.5">
          {STAGES.map((stage, i) => {
            const done    = i < completedStages;
            const current = stage === activeStage;
            return (
              <div
                key={stage.id}
                className={cn(
                  'flex-1 h-1 rounded-full transition-all',
                  done    ? 'opacity-100' :
                  current ? 'opacity-70'  : 'bg-white/8 opacity-100'
                )}
                style={done || current ? { background: stage.color } : {}}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {STAGES.map((stage, i) => {
              const done    = i < completedStages;
              const current = stage === activeStage;
              const Icon    = stage.icon;
              return (
                <span
                  key={stage.id}
                  className="text-[9px] font-medium flex items-center gap-0.5"
                  style={{
                    color: done ? stage.color : current ? stage.color : '#222',
                    opacity: done ? 0.8 : current ? 1 : 1,
                  }}
                >
                  <Icon className="w-2.5 h-2.5" />
                </span>
              );
            })}
          </div>

          {activeStage ? (
            <span
              className="text-[10px] font-medium"
              style={{ color: activeStage.color }}
            >
              In {activeStage.label}
            </span>
          ) : completedStages === 4 ? (
            <span className="text-[10px] text-[#7abf8e]">Complete</span>
          ) : (
            <span className="text-[10px] text-[#333]">Not started</span>
          )}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={e => {
          e.stopPropagation();
          onContinue(activeStage?.route ?? STAGES[0].route);
        }}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all mt-1"
        style={{
          background: activeStage ? `${activeStage.color}12` : '#ffffff08',
          color: activeStage?.color ?? '#555',
        }}
      >
        {completedStages === 0 ? 'Start with Insight' :
         completedStages === 4 ? 'View in Amplify' :
         `Continue in ${activeStage?.label}`}
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── Quick Create tile ─────────────────────────────────────────────────────────

function QuickCreateTile({ icon: Icon, label, route, color }: {
  icon: React.ElementType; label: string; route: string; color: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/6 hover:border-white/15 transition-all group"
      style={{ background: '#0D0D10' }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${color}15` }}>
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>
      <span className="text-[11px] text-[#555] group-hover:text-[#888] transition-colors">{label}</span>
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const navigate = useNavigate();
  const { projects, currentProject, fetchProjects, setCurrentProject } = useProjectsStore();
  const { reports }  = useInsightStore();
  const { decks }    = useManifestStore();
  const { assets }   = useCraftStore();
  const brandMemory  = useBrandMemoryStore();

  const [newProjectOpen, setNewProjectOpen] = useState(false);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // Determine pipeline stage per project from Brand Memory and activity
  function getProjectStage(project: Project): { completed: number; active: typeof STAGES[0] | null } {
    const memory    = brandMemory.getMemory(project.id);
    const completeness = memory?.completeness ?? 0;
    const hasInsight  = reports.some(r => (r as any).projectId === project.id);
    const hasManifest = decks.some(d => (d as any).projectId === project.id);
    const hasAssets   = assets.some(a => (a as any).projectId === project.id);

    if (hasAssets)   return { completed: 3, active: STAGES[3] };
    if (hasManifest) return { completed: 2, active: STAGES[2] };
    if (hasInsight || completeness >= 25)
                     return { completed: 1, active: STAGES[1] };
    return { completed: 0, active: STAGES[0] };
  }

  const hasAnyActivity = reports.length > 0 || decks.length > 0 || assets.length > 0;

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <SEO title="Dashboard" noIndex />
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

        {/* ── Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-light text-[#F0EDE8] tracking-tight">
              {projects.length > 0 ? 'Active campaigns' : 'Welcome to Hypnotic'}
            </h1>
            <p className="text-sm text-[#444] mt-1">
              {projects.length > 0
                ? `${projects.length} project${projects.length > 1 ? 's' : ''} in progress`
                : 'Start a new campaign or jump straight into creating'}
            </p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>

        {/* ── Campaign cards ── */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map(project => {
              const { completed, active } = getProjectStage(project);
              return (
                <CampaignCard
                  key={project.id}
                  project={project}
                  completedStages={completed}
                  activeStage={active}
                  onOpen={() => {
                    setCurrentProject(project);
                    navigate(active?.route ?? '/insight');
                  }}
                  onContinue={(route) => {
                    setCurrentProject(project);
                    navigate(route);
                  }}
                />
              );
            })}
            {/* Add campaign tile */}
            <button
              onClick={() => navigate('/projects')}
              className="rounded-2xl border border-dashed border-white/8 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-xs text-[#333] hover:text-[#555] p-5 min-h-[160px]"
            >
              <Plus className="w-4 h-4" /> New campaign
            </button>
          </div>
        ) : (
          /* Empty state — no projects yet */
          <div className="rounded-2xl border border-white/6 p-10 text-center" style={{ background: '#0D0D10' }}>
            <div className="w-12 h-12 rounded-2xl bg-[#C9A96E]/15 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-[#C9A96E]" />
            </div>
            <h2 className="text-base font-light text-[#F0EDE8] mb-2">Start your first campaign</h2>
            <p className="text-sm text-[#444] max-w-sm mx-auto mb-6 leading-relaxed">
              Begin with Insight to research the brand, or go straight to Craft to start creating.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/insight')}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 transition-all">
                <Search className="w-4 h-4" /> Start with Insight
              </button>
              <button onClick={() => navigate('/craft')}
                className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-[#777] rounded-xl text-sm hover:border-white/20 hover:text-[#999] transition-all">
                <Sparkles className="w-4 h-4" /> Go to Craft
              </button>
            </div>
          </div>
        )}

        {/* ── Quick create row ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[#F0EDE8]">Create directly</h2>
            <span className="text-[11px] text-[#333]">No brief needed</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
            <QuickCreateTile icon={ImgIcon}  label="Image"   route="/craft/image"  color="#7aaee0" />
            <QuickCreateTile icon={Film}     label="Video"   route="/craft/video"  color="#C9A96E" />
            <QuickCreateTile icon={Music}    label="Audio"   route="/craft/audio"  color="#a07ae0" />
            <QuickCreateTile icon={FileText} label="Script"  route="/manifest"     color="#7abf8e" />
          </div>
        </div>

        {/* ── Pipeline guide — only shown if no activity ── */}
        {!hasAnyActivity && (
          <div>
            <h2 className="text-sm font-medium text-[#F0EDE8] mb-4">The pipeline</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STAGES.map(stage => {
                const Icon = stage.icon;
                return (
                  <button
                    key={stage.id}
                    onClick={() => navigate(stage.route)}
                    className="text-left p-4 rounded-2xl border border-white/6 hover:border-white/15 transition-all group"
                    style={{ background: '#0D0D10' }}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${stage.color}15` }}>
                      <Icon className="w-4 h-4" style={{ color: stage.color }} />
                    </div>
                    <p className="text-xs font-medium text-[#F0EDE8] group-hover:text-white transition-colors mb-0.5">
                      {stage.label}
                    </p>
                    <p className="text-[10px] text-[#333] leading-relaxed">
                      {stage.id === 'insight'  && 'Research. Find the tension.'}
                      {stage.id === 'manifest' && 'Strategy. Write the idea.'}
                      {stage.id === 'craft'    && 'Generate image, video, audio.'}
                      {stage.id === 'amplify'  && 'Publish. Measure. Iterate.'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
