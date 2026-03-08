import { useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Plus,
  ChevronRight
} from 'lucide-react';
import { useProjectsStore, useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const moduleNames: Record<string, string> = {
  '/dashboard': 'Home',
  '/projects': 'Projects',
  '/insight': 'Insight',
  '/manifest': 'Manifest',
  '/craft': 'Craft',
  '/amplify': 'Amplify',
  '/workspace': 'Workspace',
  '/settings': 'Settings',
};

export function TopBar() {
  const location = useLocation();
  const { currentProject } = useProjectsStore();
  const { user, logout } = useAuthStore();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    
    if (parts.length === 0) return [{ label: 'Home', path: '/dashboard' }];
    
    const breadcrumbs = [];
    let currentPath = '';
    
    for (const part of parts) {
      currentPath += `/${part}`;
      const label = moduleNames[currentPath] || part;
      breadcrumbs.push({ label, path: currentPath });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const currentModule = moduleNames[location.pathname] || 'Home';

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0B0B0D]/80 backdrop-blur-sm sticky top-0 z-40">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-[#666]" />
            )}
            <span 
              className={`text-sm ${
                index === breadcrumbs.length - 1 
                  ? 'text-[#F6F6F6] font-medium' 
                  : 'text-[#A7A7A7]'
              }`}
            >
              {crumb.label}
            </span>
          </div>
        ))}
        {currentProject && (
          <>
            <ChevronRight className="w-4 h-4 text-[#666]" />
            <span className="text-sm text-[#D8A34A]">{currentProject.name}</span>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-[#D8A34A]/50"
          />
        </div>

        {/* New Project Button */}
        <Button 
          size="sm"
          className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] font-medium"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Project
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-[#A7A7A7] hover:text-[#F6F6F6] hover:bg-white/5 rounded-lg transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D8A34A] rounded-full" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-[#0F0F11] border-white/10">
            <div className="px-3 py-2 border-b border-white/10">
              <span className="text-sm font-medium text-[#F6F6F6]">Notifications</span>
            </div>
            <div className="py-2">
              <DropdownMenuItem className="text-[#A7A7A7] focus:text-[#F6F6F6] focus:bg-white/5">
                <div className="flex flex-col">
                  <span className="text-sm">Research complete for Nike campaign</span>
                  <span className="text-xs text-[#666]">2 minutes ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#A7A7A7] focus:text-[#F6F6F6] focus:bg-white/5">
                <div className="flex flex-col">
                  <span className="text-sm">New image generated</span>
                  <span className="text-xs text-[#666]">15 minutes ago</span>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D8A34A] to-[#B8832F] flex items-center justify-center">
                <span className="text-xs font-medium text-[#0B0B0D]">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#0F0F11] border-white/10">
            <div className="px-3 py-2 border-b border-white/10">
              <div className="text-sm text-[#F6F6F6]">{user?.name}</div>
              <div className="text-xs text-[#666]">{user?.email}</div>
            </div>
            <DropdownMenuItem 
              onClick={() => logout()}
              className="text-[#A7A7A7] focus:text-[#F6F6F6] focus:bg-white/5"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
