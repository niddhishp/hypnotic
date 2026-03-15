import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Plus, ChevronRight, LogOut, Settings, Zap } from 'lucide-react';
import { useProjectsStore, useAuthStore } from '@/store';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Home', projects: 'Projects', insight: 'Insight',
  manifest: 'Manifest', craft: 'Craft', amplify: 'Amplify',
  workspace: 'Workspace', marketplace: '+Human', settings: 'Settings',
  onboard: 'Onboarding',
};

const MODULE_COLORS: Record<string, string> = {
  insight: '#7aaee0', manifest: '#C9A96E', craft: '#a07ae0',
  amplify: '#7abf8e', workspace: '#C9A96E', marketplace: '#e0a87a',
};

const NOTIFICATIONS = [
  { id: 1, text: 'Research complete for Nike campaign', time: '2m ago',  unread: true  },
  { id: 2, text: 'New image asset generated in Craft',  time: '15m ago', unread: true  },
  { id: 3, text: 'Manifest deck ready for review',      time: '1h ago',  unread: false },
];

export function TopBar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { currentProject }    = useProjectsStore();
  const { user, logout }      = useAuthStore();
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [unreadCount] = useState(NOTIFICATIONS.filter(n => n.unread).length);

  const userMenuRef  = useRef<HTMLDivElement>(null);
  const notifRef     = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Build breadcrumbs
  const parts  = location.pathname.split('/').filter(Boolean);
  const crumbs = parts.map((p, i) => ({
    label: MODULE_LABELS[p] ?? p.charAt(0).toUpperCase() + p.slice(1),
    path:  '/' + parts.slice(0, i + 1).join('/'),
    color: MODULE_COLORS[p],
  }));

  const credits = (user as any)?.credits ?? 50;
  const lowCredits = credits < 20;

  return (
    <header
      className="h-14 border-b border-white/6 flex items-center justify-between px-5 flex-shrink-0 z-40"
      style={{ background: '#0D0D10' }}
      role="banner"
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
        {crumbs.length === 0 && (
          <span className="text-[#F0EDE8] font-light">Home</span>
        )}
        {crumbs.map((c, i) => (
          <div key={c.path} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-[#2a2a2e]" aria-hidden="true" />
            )}
            {i < crumbs.length - 1 ? (
              <button
                onClick={() => navigate(c.path)}
                className="text-[#484850] hover:text-[#888] transition-colors font-light text-sm"
              >
                {c.label}
              </button>
            ) : (
              <span
                className="font-medium text-sm"
                style={{ color: c.color ?? '#F0EDE8' }}
                aria-current="page"
              >
                {c.label}
              </span>
            )}
          </div>
        ))}
        {currentProject && crumbs.length > 0 && (
          <div className="flex items-center gap-1.5 ml-1">
            <ChevronRight className="w-3 h-3 text-[#2a2a2e]" aria-hidden="true" />
            <span className="text-[11px] text-[#383838] truncate max-w-32">{currentProject.name}</span>
          </div>
        )}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">

        {/* Active project pill */}
        {currentProject && (
          <button
            onClick={() => navigate('/projects')}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-[#555] hover:text-[#888] border border-white/6 hover:border-white/15 transition-all max-w-40"
            aria-label={`Current project: ${currentProject.name} — switch projects`}
          >
            <span className="w-2 h-2 rounded-full bg-[#C9A96E] flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{currentProject.name}</span>
          </button>
        )}

        {/* Credit counter */}
        {user && (
          <button
            onClick={() => navigate('/settings/billing')}
            aria-label={`${credits} generation credits remaining${lowCredits ? ' — low credits' : ''}`}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition-all border',
              lowCredits
                ? 'border-amber-500/30 bg-amber-500/8 text-amber-400 hover:bg-amber-500/15'
                : 'border-white/8 bg-white/4 text-[#555] hover:border-white/15 hover:text-[#888]'
            )}
          >
            <Zap className="w-3 h-3" aria-hidden="true" />
            <span className="font-medium tabular-nums">{credits}</span>
            {lowCredits && <span className="hidden sm:inline">credits</span>}
          </button>
        )}

        {/* New project */}
        <button
          onClick={() => navigate('/projects')}
          aria-label="New project"
          className="flex items-center gap-1.5 bg-[#C9A96E] text-[#08080A] rounded-xl px-3 py-2 text-xs font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ''}`}
            aria-expanded={notifOpen}
            aria-haspopup="true"
            className="relative p-2 text-[#484850] hover:text-[#888] hover:bg-white/4 rounded-xl transition-all"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C9A96E] rounded-full"
                aria-hidden="true"
              />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/8 overflow-hidden shadow-2xl z-50"
              style={{ background: '#0F0F12' }}
              role="menu"
              aria-label="Notifications"
            >
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-[#F0EDE8]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[11px] text-[#C9A96E]">{unreadCount} new</span>
                )}
              </div>
              {NOTIFICATIONS.map(n => (
                <div
                  key={n.id}
                  className={cn(
                    'px-4 py-3 border-b border-white/4 cursor-pointer transition-colors',
                    n.unread ? 'hover:bg-white/4' : 'hover:bg-white/2 opacity-60'
                  )}
                  role="menuitem"
                >
                  <div className="flex items-start gap-2.5">
                    {n.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] flex-shrink-0 mt-1.5" aria-hidden="true" />
                    )}
                    <div className={cn(!n.unread && 'ml-4')}>
                      <p className="text-xs text-[#C0B8AC] leading-relaxed">{n.text}</p>
                      <time className="text-[11px] text-[#444] mt-0.5 block">{n.time}</time>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <button className="text-[11px] text-[#444] hover:text-[#777] transition-colors">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-label={`User menu — ${user?.name ?? 'Account'}`}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/4 transition-all"
          >
            <span className="w-7 h-7 rounded-full bg-[#C9A96E]/20 flex items-center justify-center">
              <span className="text-[11px] font-semibold text-[#C9A96E]" aria-hidden="true">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </span>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/8 overflow-hidden shadow-2xl z-50"
              style={{ background: '#0F0F12' }}
              role="menu"
              aria-label="User account menu"
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs text-[#F0EDE8] font-medium truncate">{user?.name}</p>
                <p className="text-[11px] text-[#444] mt-0.5 truncate">{user?.email}</p>
                <p className="text-[11px] text-[#C9A96E]/80 mt-0.5 capitalize font-medium">
                  {user?.plan ?? 'Free'} plan
                </p>
              </div>

              <button
                onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#777] hover:text-[#F0EDE8] hover:bg-white/4 transition-all"
                role="menuitem"
              >
                <Settings className="w-3.5 h-3.5" aria-hidden="true" /> Settings
              </button>

              <button
                onClick={() => { navigate('/settings?tab=billing'); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#777] hover:text-[#C9A96E] hover:bg-[#C9A96E]/5 transition-all"
                role="menuitem"
              >
                <Zap className="w-3.5 h-3.5" aria-hidden="true" /> Upgrade Plan
              </button>

              <div className="h-px bg-white/5 mx-4" />

              <button
                onClick={async () => { await logout(); navigate('/'); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#777] hover:text-red-400 hover:bg-red-500/5 transition-all mb-1"
                role="menuitem"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
