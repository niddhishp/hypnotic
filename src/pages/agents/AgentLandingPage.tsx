// src/pages/agents/AgentLandingPage.tsx
// Shared landing page for each of the 7 super agents.
// Shows: who they are, their internal team roles, what they produce,
// what they've done for this project, and the entry CTA into their workspace.

import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, ChevronRight, Users, Zap, Check, Clock,
  Lock, Sparkles, Brain,
} from 'lucide-react';
import type { HypnoticAgent } from '@/lib/agents/agent-config';
import { AGENTS, AGENT_BY_ID } from '@/lib/agents/agent-config';
import { useProjectsStore } from '@/store';
import { useBrandMemoryStore } from '@/store/brand-memory.store';
import { cn } from '@/lib/utils';

// Route → workspace page mapping
const WORKSPACE_ROUTES: Record<string, string> = {
  strategist:   '/insight',
  concept:      '/manifest',
  visual:       '/craft/image',
  director:     '/craft/video',
  post:         '/craft',
  sound:        '/craft/audio',
  distribution: '/amplify',
};

interface AgentLandingPageProps {
  agentId: string;
}

function RoleCard({ role }: { role: HypnoticAgent['roles'][0] }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-white/6 hover:border-white/12 transition-all"
      style={{ background: '#0D0D10' }}>
      <span className="text-lg flex-shrink-0 mt-0.5">{role.emoji}</span>
      <div>
        <p className="text-xs font-medium text-[#F0EDE8]">{role.title}</p>
        <p className="text-[11px] text-[#555] leading-relaxed mt-0.5">{role.function}</p>
      </div>
    </div>
  );
}

function OutputBadge({ output, color }: { output: HypnoticAgent['produces'][0]; color: string }) {
  const formatColors: Record<string, string> = {
    strategy: '#7aaee0', document: '#7abf8e', image: '#a07ae0',
    video: '#C9A96E', audio: '#7abf8e', data: '#e0a07a',
  };
  const c = formatColors[output.format] ?? '#888';
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full mr-1.5 mb-1.5 border"
      style={{ color: c, background: `${c}12`, borderColor: `${c}30` }}>
      {output.label}
    </span>
  );
}

export function AgentLandingPage({ agentId }: AgentLandingPageProps) {
  const navigate  = useNavigate();
  const agent     = AGENT_BY_ID[agentId];
  const { currentProject } = useProjectsStore();
  const brandMemory = useBrandMemoryStore();

  if (!agent) return null;

  const memory = currentProject ? brandMemory.getMemory(currentProject.id) : null;
  const workspaceRoute = WORKSPACE_ROUTES[agentId] ?? '/dashboard';
  const prevAgent = agent.phase > 1 ? AGENTS.find(a => a.phase === agent.phase - 1) : null;
  const nextAgent = AGENTS.find(a => a.phase === agent.phase + 1);

  // Determine what's ready from upstream
  const upstreamReady = agent.receives.length === 0 || (
    agent.receives.every(r => {
      if (r.from === 'strategist') return (memory?.completeness ?? 0) >= 25;
      if (r.from === 'concept')    return (memory?.completeness ?? 0) >= 50;
      return true; // assume available for now
    })
  );

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* Pipeline breadcrumb */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {AGENTS.map((a, i) => (
            <div key={a.id} className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => navigate(WORKSPACE_ROUTES[a.id] ?? a.route)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] transition-all',
                  a.id === agentId
                    ? 'font-medium'
                    : 'text-[#333] hover:text-[#555] hover:bg-white/4'
                )}
                style={a.id === agentId ? {
                  background: `${a.color}12`,
                  color: a.color,
                } : {}}>
                <span>{a.emoji}</span>
                <span className="hidden sm:inline">{a.shortName}</span>
              </button>
              {i < AGENTS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-[#222] flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Hero */}
        <div className="space-y-4">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}30` }}>
              {agent.emoji}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-light text-[#F0EDE8]">{agent.name}</h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                  style={{ color: agent.color, background: `${agent.color}15` }}>
                  Phase {agent.phase}
                </span>
              </div>
              <p className="text-sm text-[#555] mb-2">{agent.tagline}</p>
              <p className="text-base font-light italic" style={{ color: agent.color }}>
                "{agent.question}"
              </p>
            </div>
          </div>

          {/* Upstream dependency message */}
          {!upstreamReady && prevAgent && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{ background: `${prevAgent.color}08`, borderColor: `${prevAgent.color}25` }}>
              <span className="text-lg">{prevAgent.emoji}</span>
              <p className="text-xs text-[#777]">
                {prevAgent.name} needs to complete first.{' '}
                <button onClick={() => navigate(WORKSPACE_ROUTES[prevAgent.id] ?? '/')}
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: prevAgent.color }}>
                  Go to {prevAgent.shortName} →
                </button>
              </p>
            </div>
          )}

          {/* Brand Memory signal */}
          {memory && (memory.completeness ?? 0) > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/6 text-[11px]"
              style={{ background: '#0D0D10' }}>
              <Brain className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span className="text-[#555]">
                Brand memory loaded — {memory.persona?.archetype && `${memory.persona.archetype} archetype`}
                {memory.audience?.name && ` · ${memory.audience.name}`}
              </span>
              <span className="text-[#333] ml-auto">{memory.completeness}% complete</span>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => navigate(workspaceRoute)}
            disabled={!upstreamReady}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all group"
            style={{ background: agent.color, color: '#08080A' }}>
            <Sparkles className="w-5 h-5" />
            Open {agent.shortName}'s workspace
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform ml-auto" />
          </button>
        </div>

        {/* Department team */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4" style={{ color: agent.color }} />
            <h2 className="text-sm font-medium text-[#F0EDE8]">Department team</h2>
            <span className="text-[11px] text-[#444]">{agent.roles.length} specialist roles</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {agent.roles.map(role => <RoleCard key={role.title} role={role} />)}
          </div>
        </div>

        {/* What this agent produces */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4" style={{ color: agent.color }} />
            <h2 className="text-sm font-medium text-[#F0EDE8]">Outputs</h2>
            <span className="text-[11px] text-[#444]">What this agent creates</span>
          </div>
          <div className="flex flex-wrap">
            {agent.produces.map(p => (
              <OutputBadge key={p.label} output={p} color={agent.color} />
            ))}
          </div>
        </div>

        {/* What this agent receives */}
        {agent.receives.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#F0EDE8] mb-4">Reads from</h2>
            <div className="space-y-2">
              {agent.receives.map(r => {
                const upstream = AGENT_BY_ID[r.from];
                if (!upstream) return null;
                const ready = r.from === 'strategist'
                  ? (memory?.completeness ?? 0) >= 25
                  : r.from === 'concept' ? (memory?.completeness ?? 0) >= 50 : true;
                return (
                  <div key={r.from}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/6"
                    style={{ background: '#0D0D10' }}>
                    <span className="text-xl">{upstream.emoji}</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium" style={{ color: upstream.color }}>{upstream.name}</p>
                      <p className="text-[11px] text-[#555]">{r.label}</p>
                    </div>
                    {ready
                      ? <span className="text-[10px] text-[#7abf8e] flex items-center gap-1"><Check className="w-3 h-3" />Ready</span>
                      : <span className="text-[10px] text-[#555] flex items-center gap-1"><Lock className="w-3 h-3" />Pending</span>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Example briefs */}
        <div>
          <h2 className="text-sm font-medium text-[#F0EDE8] mb-4">Example briefs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {agent.exampleBriefs.map(brief => (
              <button key={brief}
                onClick={() => navigate(workspaceRoute)}
                className="text-left px-4 py-3 rounded-xl border border-white/6 hover:border-white/15 text-[11px] text-[#555] hover:text-[#888] transition-all"
                style={{ background: '#0D0D10' }}>
                "{brief}"
              </button>
            ))}
          </div>
        </div>

        {/* Next agent */}
        {nextAgent && (
          <div className="rounded-2xl border border-white/6 p-5 flex items-center gap-4"
            style={{ background: '#0D0D10' }}>
            <span className="text-3xl">{nextAgent.emoji}</span>
            <div className="flex-1">
              <p className="text-[11px] text-[#444] uppercase tracking-wider mb-1">After this →</p>
              <p className="text-sm font-medium text-[#F0EDE8]">{nextAgent.name}</p>
              <p className="text-[11px] text-[#555] italic">"{nextAgent.question}"</p>
            </div>
            <button
              onClick={() => navigate(WORKSPACE_ROUTES[nextAgent.id] ?? nextAgent.route)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all"
              style={{ background: `${nextAgent.color}12`, color: nextAgent.color }}>
              Visit <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
