import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Search, 
  FileText, 
  Image, 
  Share2, 
  Network,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useUIStore, useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderOpen },
];

const moduleNavItems = [
  { path: '/insight', label: 'Insight', icon: Search, color: '#3B82F6' },
  { path: '/manifest', label: 'Manifest', icon: FileText, color: '#22C55E' },
  { path: '/craft', label: 'Craft', icon: Image, color: '#A855F7' },
  { path: '/amplify', label: 'Amplify', icon: Share2, color: '#EF4444' },
];

const utilityNavItems = [
  { path: '/workspace', label: 'Workspace', icon: Network },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, activeModule, setActiveModule } = useUIStore();
  const { user } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside 
      className={cn(
        "bg-[#0F0F11] border-r border-white/5 flex flex-col transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D8A34A] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#0B0B0D]" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-display font-semibold text-[#F6F6F6]">
              Hypnotic
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-6 overflow-y-auto">
        {/* Main Nav */}
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-[#666]">
              Main
            </div>
          )}
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setActiveModule(item.path.replace('/', ''))}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive(item.path)
                  ? "bg-white/10 text-[#F6F6F6]"
                  : "text-[#A7A7A7] hover:bg-white/5 hover:text-[#F6F6F6]",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Modules */}
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-[#666]">
              Modules
            </div>
          )}
          {moduleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setActiveModule(item.path.replace('/', ''))}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
                isActive(item.path)
                  ? "bg-white/10 text-[#F6F6F6]"
                  : "text-[#A7A7A7] hover:bg-white/5 hover:text-[#F6F6F6]",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <div 
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <item.icon 
                  className="w-3.5 h-3.5" 
                  style={{ color: item.color }}
                />
              </div>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Utility */}
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-[#666]">
              Tools
            </div>
          )}
          {utilityNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setActiveModule(item.path.replace('/', ''))}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive(item.path)
                  ? "bg-white/10 text-[#F6F6F6]"
                  : "text-[#A7A7A7] hover:bg-white/5 hover:text-[#F6F6F6]",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User & Collapse */}
      <div className="p-3 border-t border-white/5">
        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-[#A7A7A7] hover:bg-white/5 hover:text-[#F6F6F6] transition-all mb-3"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </div>
          )}
        </button>

        {/* User */}
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D8A34A] to-[#B8832F] flex items-center justify-center">
              <span className="text-xs font-medium text-[#0B0B0D]">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-[#F6F6F6] truncate">{user.name}</div>
              <div className="text-xs text-[#666] capitalize">{user.plan} Plan</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
