import { NavLink, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Cpu, 
  MessageSquare, 
  BarChart3,
  Settings,
  ChevronLeft,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useUIStore, useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/models', label: 'AI Models', icon: Cpu },
  { path: '/admin/prompts', label: 'Prompts', icon: MessageSquare },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { logout, user } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#0F0F11] border-r border-white/5 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="font-display font-semibold text-[#F6F6F6]">Admin</span>
                <span className="block text-[11px] text-[#666]">Hypnotic</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive(item.path)
                  ? "bg-red-500/10 text-red-500"
                  : "text-[#A7A7A7] hover:bg-white/5 hover:text-[#F6F6F6]",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User & Collapse */}
        <div className="p-3 border-t border-white/5">
          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-[#A7A7A7] hover:bg-white/5 hover:text-[#F6F6F6] transition-all mb-3"
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", sidebarCollapsed && "rotate-180")} />
          </button>

          {/* User */}
          {!sidebarCollapsed && user && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {user.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#F6F6F6] truncate">{user.name}</div>
                  <div className="text-xs text-[#666]">Administrator</div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => logout()}
                className="w-full justify-start text-[#A7A7A7] hover:text-red-500 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0B0B0D]/80 backdrop-blur-sm sticky top-0 z-40">
          <h1 className="text-lg font-medium text-[#F6F6F6]">
            {adminNavItems.find(item => isActive(item.path))?.label || 'Admin'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#666]">{user?.email}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
