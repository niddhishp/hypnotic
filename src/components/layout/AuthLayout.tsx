import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-semibold text-[#F6F6F6] mb-2">
            Hypnotic
          </h1>
          <p className="text-sm text-[#A7A7A7]">
            AI Creative Operating System
          </p>
        </div>
        
        {/* Content */}
        <Outlet />
      </div>
    </div>
  );
}
