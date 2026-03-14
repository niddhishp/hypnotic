import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Search, Scroll, Sparkles,
  Share2, Network, Settings, ChevronLeft, ChevronRight,
  Users, Image, GitBranch,
} from 'lucide-react';
import { useUIStore, useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const MODULE_ITEMS = [
  { path: '/insight',   label: 'Insight',   icon: Search, color: '#7aaee0' },
  { path: '/manifest',  label: 'Manifest',  icon: Scroll, color: '#C9A96E' },
  { path: '/craft',     label: 'Craft',     icon: Image,  color: '#a07ae0' },
  { path: '/amplify',   label: 'Amplify',   icon: Share2, color: '#7abf8e' },
];

const TOOL_ITEMS = [
  { path: '/workspace',   label: 'Workspace', icon: GitBranch, color: '#C9A96E' },
  { path: '/marketplace', label: '+Human',    icon: Users,     color: '#e0a87a' },
  { path: '/settings',    label: 'Settings',  icon: Settings,  color: undefined  },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { user } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const NavItem = ({
    path, label, icon: Icon, color, badge,
  }: { path: string; label: string; icon: React.ElementType; color?: string; badge?: string }) => {
    const active = isActive(path);
    return (
      <NavLink to={path}
        className={cn(
          'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all group relative',
          active ? 'bg-white/8 text-[#F0EDE8]' : 'text-[#555] hover:bg-white/4 hover:text-[#999]',
          sidebarCollapsed && 'justify-center px-2'
        )}>
        <div className={cn(
          'w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0',
          color ? 'opacity-90' : ''
        )}
          style={color ? { background: `${color}15` } : {}}>
          <Icon className="w-3.5 h-3.5 flex-shrink-0"
            style={color ? { color: active ? color : undefined } : {}} />
        </div>
        {!sidebarCollapsed && (
          <span className="font-light">{label}</span>
        )}
        {badge && !sidebarCollapsed && (
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-[#C9A96E]/20 text-[#C9A96E]">{badge}</span>
        )}
        {/* Active indicator */}
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
            style={{ background: color ?? '#C9A96E' }} />
        )}
      </NavLink>
    );
  };

  return (
    <aside className={cn(
      'border-r border-white/6 flex flex-col transition-all duration-200 flex-shrink-0',
      sidebarCollapsed ? 'w-14' : 'w-52'
    )}
      style={{ background: '#0D0D10' }}>

      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#C9A96E] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#08080A]" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-sm font-medium text-[#F0EDE8] tracking-wide">Hypnotic</span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-5 overflow-y-auto">

        {/* Main */}
        <div className="space-y-0.5">
          {!sidebarCollapsed && (
            <div className="px-3 mb-1.5 text-[9px] uppercase tracking-[0.12em] text-[#333]">Main</div>
          )}
          <NavItem path="/dashboard" label="Home"     icon={LayoutDashboard} />
          <NavItem path="/projects"  label="Projects" icon={FolderOpen} />
        </div>

        {/* Pipeline modules */}
        <div className="space-y-0.5">
          {!sidebarCollapsed && (
            <div className="px-3 mb-1.5 text-[9px] uppercase tracking-[0.12em] text-[#333]">Pipeline</div>
          )}
          {MODULE_ITEMS.map(item => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        {/* Tools */}
        <div className="space-y-0.5">
          {!sidebarCollapsed && (
            <div className="px-3 mb-1.5 text-[9px] uppercase tracking-[0.12em] text-[#333]">Tools</div>
          )}
          {TOOL_ITEMS.map(item => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>
      </nav>

      {/* Footer: user + collapse */}
      <div className="p-2 border-t border-white/5 space-y-1">
        {/* User pill */}
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-white/4 transition-colors cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-medium text-[#C9A96E]">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#C0B8AC] truncate">{user.name}</div>
              <div className="text-[10px] text-[#444] capitalize">{user.plan ?? 'Free'}</div>
            </div>
          </div>
        )}

        {/* Collapse button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-[#444] hover:bg-white/4 hover:text-[#777] transition-all">
          {sidebarCollapsed
            ? <ChevronRight className="w-4 h-4" />
            : <><ChevronLeft className="w-4 h-4" /><span className="text-xs">Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
