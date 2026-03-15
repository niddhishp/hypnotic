// src/components/shared/AgentActivityIndicator.tsx
// The visible hint of invisible intelligence.
// Appears ONLY during generation. Pulses while active, shows completed agents, then fades.
// Usage: <AgentActivityIndicator agentId="strategist" isActive={isResearching} completedAgents={agents} />

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AGENTS } from '@/lib/agents/agent-config';

// Maps Hypnotic module → which agent is running → what specialists to show
const MODULE_SPECIALISTS: Record<string, { count: number; roles: string[] }> = {
  strategist: {
    count: 5,
    roles: ['Brand Strategist', 'Cultural Analyst', 'Consumer Researcher', 'Competitor Mapper', 'Brief Architect'],
  },
  concept: {
    count: 4,
    roles: ['Creative Director', 'Copywriter', 'Story Architect', 'Concept Developer'],
  },
  visual: {
    count: 3,
    roles: ['Art Director', 'Visual Style Architect', 'Moodboard Creator'],
  },
  director: {
    count: 5,
    roles: ['Film Director', 'Cinematographer', 'Storyboard Artist', 'Production Designer', 'Shot Designer'],
  },
  post: {
    count: 4,
    roles: ['Film Editor', 'Colorist', 'Motion Graphics Designer', 'VFX Supervisor'],
  },
  sound: {
    count: 3,
    roles: ['Music Director', 'Composer', 'Sound Designer'],
  },
  distribution: {
    count: 4,
    roles: ['Social Strategist', 'Platform Packager', 'Performance Planner', 'Content Scheduler'],
  },
};

export type AgentActivityPhase = 'idle' | 'active' | 'completing' | 'done';

interface AgentActivityIndicatorProps {
  /** Which agent/module is running — 'strategist' | 'concept' | 'visual' | 'director' | 'post' | 'sound' | 'distribution' */
  agentId: string;
  /** Whether generation is currently in progress */
  isActive: boolean;
  /** Optional: completed role names to show in done state */
  completedRoles?: string[];
  /** Optional custom specialist list override */
  specialists?: string[];
  /** Position variant */
  variant?: 'inline' | 'header';
  className?: string;
}

export function AgentActivityIndicator({
  agentId,
  isActive,
  completedRoles,
  specialists,
  variant = 'header',
  className,
}: AgentActivityIndicatorProps) {
  const [phase, setPhase]         = useState<AgentActivityPhase>('idle');
  const [visible, setVisible]     = useState(false);
  const [roleTicker, setRoleTicker] = useState(0);
  const fadeTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer  = useRef<ReturnType<typeof setInterval> | null>(null);

  const agent      = AGENTS.find(a => a.id === agentId);
  const config     = MODULE_SPECIALISTS[agentId] ?? { count: 3, roles: ['Specialist', 'Analyst', 'Architect'] };
  const roles      = specialists ?? config.roles;
  const agentColor = agent?.color ?? '#C9A96E';

  // Lifecycle: idle → active (on isActive) → completing → done → fade out
  useEffect(() => {
    if (isActive) {
      setPhase('active');
      setVisible(true);
      // Tick through role names while active
      setRoleTicker(0);
      tickTimer.current = setInterval(() => {
        setRoleTicker(n => (n + 1) % roles.length);
      }, 1800);
      return;
    }

    if (!isActive && phase === 'active') {
      // Generation just finished
      clearInterval(tickTimer.current!);
      setPhase('completing');

      // Show "complete" state for 2.5 seconds
      fadeTimer.current = setTimeout(() => {
        setPhase('done');
        // Then fade out after another 2s
        fadeTimer.current = setTimeout(() => {
          setVisible(false);
          setPhase('idle');
        }, 2000);
      }, 2500);
    }

    return () => {
      clearTimeout(fadeTimer.current!);
      clearInterval(tickTimer.current!);
    };
  }, [isActive]);

  if (!visible) return null;

  // ── Header variant — compact pill in module header ────────────────────────
  if (variant === 'header') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all',
          phase === 'idle'       && 'opacity-0',
          phase === 'active'     && 'opacity-100',
          phase === 'completing' && 'opacity-100',
          phase === 'done'       && 'opacity-0 transition-opacity duration-1000',
          className
        )}
        style={{ borderColor: `${agentColor}30`, background: `${agentColor}0C` }}
        aria-live="polite"
        aria-label={phase === 'active' ? `${config.count} specialists working` : 'Generation complete'}
      >
        {/* Pulse dot */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          {phase === 'active' && (
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: agentColor }}
            />
          )}
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{
              background: phase === 'completing' ? '#7abf8e' : agentColor,
              transition: 'background 0.4s',
            }}
          />
        </span>

        {/* Text */}
        <span style={{ color: phase === 'completing' ? '#7abf8e' : agentColor }}>
          {phase === 'active' && (
            <span className="flex items-center gap-1.5">
              <span>{config.count} specialists</span>
              <span className="text-[10px] opacity-60">·</span>
              <span
                className="opacity-80 transition-all"
                key={roleTicker}
                style={{ animation: 'fadeInUp 0.3s ease' }}
              >
                {roles[roleTicker]}
              </span>
            </span>
          )}
          {phase === 'completing' && (
            <span>
              {completedRoles
                ? completedRoles.slice(0, 3).join(' · ') + ' ✓'
                : `${config.count} specialists complete ✓`}
            </span>
          )}
          {phase === 'done' && <span>Done</span>}
        </span>
      </div>
    );
  }

  // ── Inline variant — inside the workspace body ─────────────────────────────
  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-2xl border transition-all',
        phase === 'done' && 'opacity-0 duration-1000',
        className
      )}
      style={{ borderColor: `${agentColor}20`, background: `${agentColor}08` }}
      aria-live="polite"
    >
      {/* Animated orbs */}
      <div className="flex gap-1 pt-0.5 flex-shrink-0">
        {Array.from({ length: Math.min(config.count, 5) }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'block rounded-full transition-all',
              phase === 'active'
                ? 'w-1.5 h-1.5 animate-bounce'
                : 'w-1.5 h-1.5'
            )}
            style={{
              background: phase === 'completing' ? '#7abf8e' : agentColor,
              animationDelay: `${i * 0.12}s`,
              opacity: phase === 'completing' ? 1 : 0.7 + i * 0.06,
            }}
          />
        ))}
      </div>

      <div className="flex-1 min-w-0">
        {phase === 'active' && (
          <>
            <p className="text-xs font-medium" style={{ color: agentColor }}>
              {config.count} specialists working
            </p>
            <p
              className="text-[11px] text-[#555] mt-0.5 transition-all"
              key={roleTicker}
              style={{ animation: 'fadeInUp 0.3s ease' }}
            >
              {roles[roleTicker]}…
            </p>
          </>
        )}
        {phase === 'completing' && (
          <>
            <p className="text-xs font-medium text-[#7abf8e]">Generation complete</p>
            <p className="text-[11px] text-[#555] mt-0.5">
              {completedRoles
                ? completedRoles.join(' · ')
                : roles.join(' · ')} ✓
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// CSS keyframe — add to globals.css if not present
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
