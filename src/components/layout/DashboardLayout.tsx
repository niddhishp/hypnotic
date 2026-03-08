import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ChatAssistant } from '@/components/chat/ChatAssistant';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Floating Chat Assistant */}
      <ChatAssistant />
    </div>
  );
}
