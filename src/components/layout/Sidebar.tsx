// src/components/layout/Sidebar.tsx
// Four pipeline stages + Direct Create section.
// Agents are invisible — they run inside each stage, users never navigate by agent name.

import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Search, Scroll, Sparkles, Share2,
  Image as ImgIcon, Film, Music, FileText, Users,
  FolderOpen, Settings, LayoutGrid,
  ChevronLeft, ChevronRight, ChevronDown,
} from 'lucide-react';
import { useProjectsStore, useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

// ── Pipeline stages — the four core modules ───────────────────────────────────

const PIPELINE = [
  {
    id: 'insight',   label: 'Insight',   icon: Search,  route: '/insight',
    color: '#7aaee0', desc: 'What should we say?',
  },
  {
    id: 'manifest',  label: 'Manifest',  icon: Scroll,  route: '/manifest',
    color: '#C9A96E', desc: 'What is the big idea?',
  },
  {
    id: 'craft',     label: 'Craft',     icon: Sparkles, route: '/craft',
    color: '#a07ae0', desc: 'Make the work.',
  },
  {
    id: 'amplify',   label: 'Amplify',   icon: Share2,  route: '/amplify',
    color: '#7abf8e', desc: 'Make it travel.',
  },
];

// ── Direct Create shortcuts — for creators and quick tasks ────────────────────

const DIRECT_CREATE = [
  { id: 'image',    label: 'Image',   icon: ImgIcon,   route: '/craft/image'  },
  { id: 'video',    label: 'Video',   icon: Film,      route: '/craft/video'  },
  { id: 'audio',    label: 'Audio',   icon: Music,     route: '/craft/audio'  },
  { id: 'script',   label: 'Script',  icon: FileText,  route: '/manifest'     },
];

// ── Utility links ──────────────────────────────────────────────────────────────

const UTILITY = [
  { id: 'projects',  label: 'Projects',   icon: FolderOpen, route: '/projects'  },
  { id: 'workspace', label: 'Workspace',  icon: LayoutGrid, route: '/workspace' },
  { id: 'settings',  label: 'Settings',   icon: Settings,   route: '/settings'  },
];

export function Sidebar() {
  const location = useNavigate();
  const loc      = useLocation();
  const navigate = useNavigate();
  const { currentProject } = useProjectsStore();
  const { user } = useAuthStore();

  const [collapsed,       setCollapsed]       = useState(false);
  const [createExpanded,  setCreateExpanded]  = useState(true);

  const isActive = (route: string) =>
    loc.pathname === route || loc.pathname.startsWith(route + '/');

  const activePipeline = PIPELINE.find(p => isActive(p.route));
  const activeCreate   = DIRECT_CREATE.find(c => isActive(c.route));

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-white/6 transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-[52px]' : 'w-[192px]'
      )}
      style={{ background: '#08080A' }}
      aria-label="Navigation"
    >
      {/* ── Logo ── */}
      <div className={cn(
        'flex items-center h-[57px] border-b border-white/6 px-3 flex-shrink-0',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 group"
          >
            <div className="w-6 h-6 rounded-lg bg-[#C9A96E] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#08080A]" />
            </div>
            <span className="text-sm font-semibold text-[#F0EDE8] tracking-tight">Hypnotic</span>
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
          <button
            onClick={() => setCollapsed(true)}
            className="text-[#666] hover:text-[#999] transition-colors p-1"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Expand button when collapsed ── */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center py-2 text-[#666] hover:text-[#999] transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col">

        {/* ── Pipeline label ── */}
        {!collapsed && (
          <p className="text-[9px] text-[#555] uppercase tracking-widest font-semibold px-4 pt-5 pb-1.5">
            Pipeline
          </p>
        )}
        {collapsed && <div className="pt-3" />}

        {/* ── Pipeline stages ── */}
        <nav className="px-2 space-y-0.5" aria-label="Pipeline">
          {PIPELINE.map(stage => {
            const Icon    = stage.icon;
            const active  = isActive(stage.route);
            return (
              <button
                key={stage.id}
                onClick={() => navigate(stage.route)}
                className={cn(
                  'w-full flex items-center rounded-xl transition-all group',
                  collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                  active ? '' : 'hover:bg-white/4'
                )}
                style={active ? { background: `${stage.color}12` } : {}}
                aria-label={stage.label}
                aria-current={active ? 'page' : undefined}
                title={collapsed ? stage.label : undefined}
              >
                {/* Active bar */}
                {active && !collapsed && (
                  <span
                    className="absolute left-0 w-0.5 h-5 rounded-full"
                    style={{ background: stage.color }}
                  />
                )}

                <Icon
                  className={cn('flex-shrink-0 transition-all', collapsed ? 'w-4 h-4' : 'w-3.5 h-3.5')}
                  style={{ color: active ? stage.color : '#888' }}
                />

                {!collapsed && (
                  <span className={cn(
                    'text-xs font-medium transition-colors',
                    active ? 'text-[#F0EDE8]' : 'text-[#888] group-hover:text-[#BBB]'
                  )}>
                    {stage.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Divider ── */}
        <div className={cn('border-t border-white/5', collapsed ? 'mx-3 mt-4 mb-3' : 'mx-3 mt-5 mb-3')} />

        {/* ── Direct Create section ── */}
        {!collapsed && (
          <button
            onClick={() => setCreateExpanded(e => !e)}
            className="flex items-center justify-between px-4 pb-1.5 group"
            aria-expanded={createExpanded}
          >
            <p className="text-[9px] text-[#555] uppercase tracking-widest font-semibold group-hover:text-[#888] transition-colors">
              Create
            </p>
            <ChevronDown
              className={cn(
                'w-3 h-3 text-[#555] transition-transform group-hover:text-[#888]',
                createExpanded ? '' : '-rotate-90'
              )}
            />
          </button>
        )}
        {collapsed && <div className="px-2 pb-1" />}

        {(createExpanded || collapsed) && (
          <nav className="px-2 space-y-0.5" aria-label="Direct create">
            {DIRECT_CREATE.map(item => {
              const Icon   = item.icon;
              const active = isActive(item.route) && !activePipeline;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className={cn(
                    'w-full flex items-center rounded-xl transition-all group',
                    collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2',
                    active ? 'bg-white/6' : 'hover:bg-white/4'
                  )}
                  aria-label={item.label}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn('flex-shrink-0', collapsed ? 'w-3.5 h-3.5' : 'w-3 h-3')}
                    style={{ color: active ? '#C0B8AC' : '#888' }}
                  />
                  {!collapsed && (
                    <span className={cn(
                      'text-[11px] transition-colors',
                      active ? 'text-[#888]' : 'text-[#888] group-hover:text-[#BBB]'
                    )}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Utility links ── */}
        <div className={cn('border-t border-white/5 pt-2 pb-2 px-2 space-y-0.5')}>
          {UTILITY.map(link => {
            const Icon   = link.icon;
            const active = isActive(link.route);
            return (
              <button
                key={link.id}
                onClick={() => navigate(link.route)}
                className={cn(
                  'w-full flex items-center rounded-xl transition-all group',
                  collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2',
                  active ? 'bg-white/6' : 'hover:bg-white/4'
                )}
                aria-label={link.label}
                title={collapsed ? link.label : undefined}
              >
                <Icon
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: active ? '#888' : '#777' }}
                />
                {!collapsed && (
                  <span className={cn(
                    'text-[11px] transition-colors',
                    active ? 'text-[#888]' : 'text-[#888] group-hover:text-[#BBB]'
                  )}>
                    {link.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── User ── */}
        {!collapsed && user && (
          <div className="border-t border-white/5 px-3 py-3">
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center gap-2.5 hover:bg-white/4 rounded-xl px-2 py-1.5 transition-colors group"
            >
              <div className="w-6 h-6 rounded-full bg-[#C9A96E]/20 flex items-center justify-center text-[10px] font-semibold text-[#C9A96E] flex-shrink-0">
                {((user.name ?? user.email ?? 'U')[0]).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[11px] text-[#444] truncate group-hover:text-[#666] transition-colors">
                  {user.name ?? user.email?.split('@')[0]}
                </p>
                <p className="text-[10px] text-[#666] capitalize">{user.plan ?? 'free'}</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
