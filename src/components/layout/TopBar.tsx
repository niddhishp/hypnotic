import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Plus, ChevronRight, LogOut, Settings } from 'lucide-react';
import { useProjectsStore, useAuthStore } from '@/store';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Home', projects: 'Projects', insight: 'Insight',
  manifest: 'Manifest', craft: 'Craft', amplify: 'Amplify',
  workspace: 'Workspace', marketplace: '+Human', settings: 'Settings',
  onboard: 'Onboarding',
};

const MODULE_COLORS: Record<string, string> = {
  insight: '#7aaee0', manifest: '#C9A96E', craft: '#a07ae0',
  amplify: '#7abf8e', workspace: '#C9A96E',
};

export function TopBar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { currentProject } = useProjectsStore();
  const { user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Build breadcrumbs
  const parts = location.pathname.split('/').filter(Boolean);
  const crumbs = parts.map((p, i) => ({
    label: MODULE_LABELS[p] ?? p.charAt(0).toUpperCase() + p.slice(1),
    path:  '/' + parts.slice(0, i + 1).join('/'),
    color: MODULE_COLORS[p],
  }));

  return (
    <header className="h-14 border-b border-white/6 flex items-center justify-between px-5 flex-shrink-0 z-40"
      style={{ background: '#0D0D10' }}>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm">
        {crumbs.length === 0 && <span className="text-[#F0EDE8] font-light">Home</span>}
        {crumbs.map((c, i) => (
          <div key={c.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#333]" />}
            <span
              className={cn(
                'font-light transition-colors',
                i === crumbs.length - 1
                  ? 'text-[#F0EDE8]'
                  : 'text-[#555] hover:text-[#888] cursor-pointer'
              )}
              style={i === crumbs.length - 1 && c.color ? { color: c.color } : {}}
              onClick={() => i < crumbs.length - 1 && navigate(c.path)}
            >
              {c.label}
            </span>
          </div>
        ))}
        {currentProject && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#333]" />
            <span className="text-[#C9A96E] font-light">{currentProject.name}</span>
          </>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444]" />
          <input
            placeholder="Search…"
            className="w-56 pl-9 pr-4 py-2 bg-white/4 border border-white/8 rounded-xl text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 transition-colors"
          />
        </div>

        {/* New project */}
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 bg-[#C9A96E] text-[#08080A] rounded-xl px-3 py-2 text-xs font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-3.5 h-3.5" /> New Project
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-[#555] hover:text-[#888] hover:bg-white/4 rounded-xl transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C9A96E] rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/8 overflow-hidden shadow-2xl z-50"
              style={{ background: '#0D0D10' }}>
              <div className="px-4 py-3 border-b border-white/5 text-xs font-medium text-[#F0EDE8]">Notifications</div>
              {[
                { text: 'Research complete for Nike campaign', time: '2m ago' },
                { text: 'New image asset generated in Craft', time: '15m ago' },
                { text: 'Manifest deck ready for review', time: '1h ago' },
              ].map((n, i) => (
                <div key={i} className="px-4 py-3 border-b border-white/4 hover:bg-white/3 cursor-pointer transition-colors">
                  <div className="text-xs text-[#C0B8AC]">{n.text}</div>
                  <div className="text-[10px] text-[#444] mt-0.5">{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/4 transition-all">
            <div className="w-7 h-7 rounded-full bg-[#C9A96E]/20 flex items-center justify-center">
              <span className="text-[11px] font-medium text-[#C9A96E]">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-white/8 overflow-hidden shadow-2xl z-50"
              style={{ background: '#0D0D10' }}>
              <div className="px-4 py-3 border-b border-white/5">
                <div className="text-xs text-[#F0EDE8] font-medium">{user?.name}</div>
                <div className="text-[10px] text-[#444] mt-0.5">{user?.email}</div>
                <div className="text-[10px] text-[#C9A96E]/70 mt-0.5 capitalize">{user?.plan ?? 'Free'} plan</div>
              </div>
              <button
                onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#777] hover:text-[#F0EDE8] hover:bg-white/4 transition-all">
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#777] hover:text-red-400 hover:bg-red-500/5 transition-all">
                <LogOut className="w-3.5 h-3.5" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
