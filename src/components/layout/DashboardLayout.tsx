import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ChatAssistant } from '@/components/chat/ChatAssistant';

// These routes render full-bleed — no padding wrapper
const FULL_BLEED_ROUTES = [
  '/workspace', '/craft/video', '/craft/image', '/craft/audio',
  '/craft/social', '/craft/mockup', '/craft/photography',
];

export function DashboardLayout() {
  const { pathname } = useLocation();
  const isFullBleed = FULL_BLEED_ROUTES.some(r => pathname.startsWith(r));

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: '#0A0A0C' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        {isFullBleed ? (
          // Full-bleed: no padding, overflow managed by child
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        ) : (
          // Standard: padded scrollable content
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        )}
      </div>

      <ChatAssistant />
    </div>
  );
}
