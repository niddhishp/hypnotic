// src/components/layout/Sidebar.tsx
// The 7 Super Agents of Hypnotic — each one an entire creative department.

import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Search, Lightbulb, Aperture, Film, Scissors, Music, Share2,
  Settings, FolderOpen, LayoutGrid, ChevronLeft, ChevronRight,
  Lock, Sparkles,
} from 'lucide-react';
import { useProjectsStore, useAuthStore } from '@/store';
import { AGENTS } from '@/lib/agents/agent-config';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  Search, Lightbulb, Aperture, Film, Scissors, Music, Share2,
};

// Route overlap — agent routes mapped to existing page routes
const AGENT_ROUTE_MAP: Record<string, string> = {
  '/strategist':    '/insight',
  '/concept':       '/manifest',
  '/visual':        '/craft/image',
  '/director':      '/craft/video',
  '/post':          '/craft',
  '/sound':         '/craft/audio',
  '/distribution':  '/amplify',
};

const UTILITY_LINKS = [
  { icon: FolderOpen,  label: 'Projects',  route: '/projects'   },
  { icon: LayoutGrid,  label: 'Workspace', route: '/workspace'  },
  { icon: Settings,    label: 'Settings',  route: '/settings'   },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentProject } = useProjectsStore();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  // Determine which agent is active based on current route
  const activeAgentRoute = AGENTS.find(a => {
    const mappedRoute = AGENT_ROUTE_MAP[a.route] ?? a.route;
    return location.pathname.startsWith(mappedRoute) || location.pathname.startsWith(a.route);
  });

  const handleAgentClick = (agentRoute: string) => {
    const mapped = AGENT_ROUTE_MAP[agentRoute] ?? agentRoute;
    navigate(mapped);
  };

  const isUtilityActive = (route: string) => location.pathname.startsWith(route);

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-white/6 transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-14' : 'w-52'
      )}
      style={{ background: '#0A0A0C' }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 border-b border-white/6 flex-shrink-0 px-4',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-lg bg-[#C9A96E] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#08080A]" />
            </div>
            <span className="text-sm font-medium text-[#F0EDE8] tracking-tight">Hypnotic</span>
          </button>
        )}
        {collapsed && (
          <button onClick={() => navigate('/dashboard')}>
            <div className="w-7 h-7 rounded-lg bg-[#C9A96E] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#08080A]" />
            </div>
          </button>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)}
            className="text-[#333] hover:text-[#666] transition-colors p-1 rounded-lg hover:bg-white/5">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Collapsed expand button */}
      {collapsed && (
        <button onClick={() => setCollapsed(false)}
          className="flex items-center justify-center py-2 text-[#333] hover:text-[#666] transition-colors">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Project context */}
      {!collapsed && currentProject && (
        <div className="px-3 py-2.5 border-b border-white/4">
          <button onClick={() => navigate('/projects')}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#C9A96E] flex-shrink-0" />
            <span className="text-[11px] text-[#555] truncate hover:text-[#888] transition-colors">
              {currentProject.name}
            </span>
          </button>
        </div>
      )}

      {/* Pipeline label */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-1.5">
          <p className="text-[10px] text-[#333] uppercase tracking-widest font-medium">Creative Pipeline</p>
        </div>
      )}

      {/* 7 Agents */}
      <nav className="flex-1 overflow-y-auto py-1 space-y-0.5 px-2" aria-label="Creative pipeline">
        {AGENTS.map((agent) => {
          const Icon = ICON_MAP[agent.icon] ?? Search;
          const isActive = activeAgentRoute?.id === agent.id;

          return (
            <button
              key={agent.id}
              onClick={() => handleAgentClick(agent.route)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl transition-all relative group',
                collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                isActive
                  ? 'text-[#F0EDE8]'
                  : 'text-[#444] hover:text-[#888] hover:bg-white/4'
              )}
              style={isActive ? { background: `${agent.color}12` } : {}}
              title={collapsed ? agent.name : undefined}
              aria-label={agent.name}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator bar */}
              {isActive && !collapsed && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full"
                  style={{ background: agent.color }}
                />
              )}

              {/* Icon */}
              <div
                className={cn(
                  'flex items-center justify-center rounded-lg flex-shrink-0 transition-all',
                  collapsed ? 'w-7 h-7' : 'w-6 h-6',
                  isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                )}
                style={isActive ? { background: `${agent.color}20` } : {}}
              >
                <Icon
                  className={collapsed ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'}
                  style={{ color: isActive ? agent.color : 'currentColor' }}
                />
              </div>

              {/* Label + phase */}
              {!collapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      'text-xs font-medium truncate',
                      isActive ? 'text-[#F0EDE8]' : ''
                    )}>
                      {agent.shortName}
                    </span>
                    <span
                      className="text-[9px] font-medium px-1 py-0.5 rounded ml-auto flex-shrink-0 opacity-60"
                      style={{ color: agent.color }}
                    >
                      {agent.phase}
                    </span>
                  </div>
                  {isActive && (
                    <p className="text-[10px] truncate mt-0.5" style={{ color: agent.color, opacity: 0.7 }}>
                      {agent.question}
                    </p>
                  )}
                </div>
              )}

              {/* Collapsed tooltip */}
              {collapsed && isActive && (
                <span
                  className="absolute left-full ml-2 px-2 py-1 rounded-lg text-[11px] whitespace-nowrap z-50 pointer-events-none"
                  style={{ background: '#0F0F12', color: agent.color, border: `1px solid ${agent.color}30` }}
                >
                  {agent.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider + Utility nav */}
      <div className="border-t border-white/6 py-2 px-2 space-y-0.5">
        {UTILITY_LINKS.map(link => {
          const Icon = link.icon;
          const isActive = isUtilityActive(link.route);
          return (
            <button key={link.route}
              onClick={() => navigate(link.route)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl transition-all',
                collapsed ? 'justify-center p-2.5' : 'px-3 py-2',
                isActive ? 'bg-white/6 text-[#888]' : 'text-[#333] hover:text-[#555] hover:bg-white/4'
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {!collapsed && <span className="text-xs">{link.label}</span>}
            </button>
          );
        })}
      </div>

      {/* User profile */}
      {!collapsed && user && (
        <div className="border-t border-white/6 px-3 py-3">
          <button onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-2.5 hover:bg-white/4 rounded-xl px-2 py-1.5 transition-colors group">
            <div className="w-7 h-7 rounded-full bg-[#C9A96E]/20 flex items-center justify-center text-[11px] font-medium text-[#C9A96E] flex-shrink-0">
              {(user.name ?? user.email ?? 'U')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-[#555] truncate group-hover:text-[#888] transition-colors">
                {user.name ?? user.email?.split('@')[0]}
              </p>
              <p className="text-[10px] text-[#333] capitalize">{user.plan ?? 'free'}</p>
            </div>
          </button>
        </div>
      )}
    </aside>
  );
}
