import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Search, Scroll, Sparkles,
  Share2, Settings, ChevronLeft, ChevronRight,
  Users, Image, GitBranch, Crown,
} from 'lucide-react';
import { useUIStore, useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const MODULE_ITEMS = [
  { path: '/insight',   label: 'Insight',   icon: Search,     color: '#7aaee0', desc: 'Research' },
  { path: '/manifest',  label: 'Manifest',  icon: Scroll,     color: '#C9A96E', desc: 'Strategy'  },
  { path: '/craft',     label: 'Craft',     icon: Image,      color: '#a07ae0', desc: 'Generate'  },
  { path: '/amplify',   label: 'Amplify',   icon: Share2,     color: '#7abf8e', desc: 'Publish'   },
] as const;

const TOOL_ITEMS = [
  { path: '/workspace',   label: 'Workspace', icon: GitBranch, color: '#C9A96E',  desc: 'Pipeline' },
  { path: '/marketplace', label: '+Human',    icon: Users,     color: '#e0a87a',  desc: 'Experts'  },
  { path: '/settings',    label: 'Settings',  icon: Settings,  color: undefined,  desc: 'Account'  },
] as const;

const PLAN_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  free:       { label: 'Free',       color: '#666',     bg: 'rgba(255,255,255,0.05)' },
  starter:    { label: 'Starter',    color: '#C9A96E',  bg: 'rgba(201,169,110,0.1)'  },
  pro:        { label: 'Pro',        color: '#a07ae0',  bg: 'rgba(160,122,224,0.1)'  },
  agency:     { label: 'Agency',     color: '#7abf8e',  bg: 'rgba(122,191,142,0.1)'  },
  enterprise: { label: 'Enterprise', color: '#C9A96E',  bg: 'rgba(201,169,110,0.15)' },
};

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const planInfo = PLAN_BADGE[user?.plan ?? 'free'] ?? PLAN_BADGE.free;

  function NavItem({
    path, label, icon: Icon, color, desc, badge,
  }: { path: string; label: string; icon: React.ElementType; color?: string; desc?: string; badge?: string }) {
    const active = isActive(path);
    return (
      <NavLink
        to={path}
        aria-label={label}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-all group relative',
          active
            ? 'text-[#F0EDE8]'
            : 'text-[#505055] hover:text-[#C0B8AC] hover:bg-white/4',
          sidebarCollapsed && 'justify-center px-2'
        )}
        style={active ? { background: color ? `${color}14` : 'rgba(255,255,255,0.07)' } : {}}
      >
        {/* Active bar */}
        {active && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
            style={{ background: color ?? '#C9A96E' }}
            aria-hidden="true"
          />
        )}

        {/* Icon container */}
        <span
          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
          style={active && color
            ? { background: `${color}20`, color }
            : { background: 'rgba(255,255,255,0.05)' }
          }
          aria-hidden="true"
        >
          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        </span>

        {!sidebarCollapsed && (
          <>
            <span className="font-light text-sm leading-none">{label}</span>
            {badge && (
              <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded-full bg-[#C9A96E]/20 text-[#C9A96E] font-medium">
                {badge}
              </span>
            )}
          </>
        )}

        {/* Collapsed tooltip */}
        {sidebarCollapsed && (
          <span className="
            absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs text-[#F0EDE8] font-medium
            opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50
            border border-white/10 shadow-xl
          " style={{ background: '#1a1a1e' }}>
            {label}
            {desc && <span className="text-[#555] ml-1.5 font-normal">{desc}</span>}
          </span>
        )}
      </NavLink>
    );
  }

  return (
    <aside
      className={cn(
        'border-r border-white/6 flex flex-col transition-all duration-200 flex-shrink-0',
        sidebarCollapsed ? 'w-[52px]' : 'w-52'
      )}
      style={{ background: '#0D0D10' }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-3 border-b border-white/5 flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          aria-label="Hypnotic home"
        >
          <span className="w-7 h-7 rounded-lg bg-[#C9A96E] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#08080A]" aria-hidden="true" />
          </span>
          {!sidebarCollapsed && (
            <span className="text-sm font-medium text-[#F0EDE8] tracking-wide">Hypnotic</span>
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto" aria-label="Site navigation">

        {/* Main */}
        <div className="space-y-0.5">
          {!sidebarCollapsed && (
            <p className="px-2.5 mb-1.5 text-[11px] uppercase tracking-[0.1em] text-[#383838] font-medium select-none">
              Main
            </p>
          )}
          <NavItem path="/dashboard" label="Home"     icon={LayoutDashboard} desc="Overview" />
          <NavItem path="/projects"  label="Projects" icon={FolderOpen}       desc="All work" />
        </div>

        {/* Divider */}
        <div className="px-2.5">
          <div className="h-px bg-white/5" />
        </div>

        {/* Pipeline modules */}
        <div className="space-y-0.5">
          {!sidebarCollapsed && (
            <p className="px-2.5 mb-1.5 text-[11px] uppercase tracking-[0.1em] text-[#383838] font-medium select-none">
              Pipeline
            </p>
          )}
          {MODULE_ITEMS.map(item => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        {/* Divider */}
        <div className="px-2.5">
          <div className="h-px bg-white/5" />
        </div>

        {/* Tools */}
        <div className="space-y-0.5">
          {!sidebarCollapsed && (
            <p className="px-2.5 mb-1.5 text-[11px] uppercase tracking-[0.1em] text-[#383838] font-medium select-none">
              Tools
            </p>
          )}
          {TOOL_ITEMS.map(item => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/5 space-y-1">
        {/* User info */}
        {!sidebarCollapsed && user && (
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/4 transition-colors text-left group"
            aria-label={`${user.name} — ${user.plan ?? 'free'} plan — open settings`}
          >
            <span className="w-7 h-7 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-semibold text-[#C9A96E]">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </span>
            <span className="flex-1 min-w-0">
              <span className="text-xs text-[#C0B8AC] truncate block">{user.name}</span>
              <span
                className="text-[11px] px-1.5 py-0 rounded-full font-medium inline-block mt-0.5"
                style={{ color: planInfo.color, background: planInfo.bg }}
              >
                {planInfo.label}
              </span>
            </span>
            {user.plan === 'free' && (
              <Crown
                className="w-3.5 h-3.5 text-[#C9A96E] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                aria-hidden="true"
              />
            )}
          </button>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!sidebarCollapsed}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-[#383838] hover:bg-white/4 hover:text-[#666] transition-all"
        >
          {sidebarCollapsed
            ? <ChevronRight className="w-4 h-4" aria-hidden="true" />
            : <><ChevronLeft className="w-4 h-4" aria-hidden="true" /><span className="text-xs">Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}
