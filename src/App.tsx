import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';

// Layouts
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Pages
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ProjectsPage } from '@/pages/dashboard/ProjectsPage';

// Module Pages
import { InsightPage } from '@/pages/insight/InsightPage';
import { InsightReportPage } from '@/pages/insight/InsightReportPage';
import { ManifestPage } from '@/pages/manifest/ManifestPage';
import { ManifestDeckPage } from '@/pages/manifest/ManifestDeckPage';
import { CraftPage } from '@/pages/craft/CraftPage';
import { AmplifyPage } from '@/pages/amplify/AmplifyPage';
import { WorkspacePage } from '@/pages/workspace/WorkspacePage';
import { SettingsPage } from '@/pages/settings/SettingsPage';

// Admin Pages
import {
  AdminDashboardPage,
  AdminUsersPage,
  AdminModelsPage,
  AdminPromptsPage,
  AdminAnalyticsPage,
  AdminSettingsPage,
} from '@/pages/admin';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        
        {/* Dashboard Routes */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          
          {/* Insight Module */}
          <Route path="/insight" element={<InsightPage />} />
          <Route path="/insight/:reportId" element={<InsightReportPage />} />
          
          {/* Manifest Module */}
          <Route path="/manifest" element={<ManifestPage />} />
          <Route path="/manifest/:deckId" element={<ManifestDeckPage />} />
          
          {/* Craft Module */}
          <Route path="/craft" element={<CraftPage />} />
          
          {/* Amplify Module */}
          <Route path="/amplify" element={<AmplifyPage />} />
          
          {/* Workspace */}
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/workspace/:projectId" element={<WorkspacePage />} />
          
          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/models" element={<AdminModelsPage />} />
          <Route path="/admin/prompts" element={<AdminPromptsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
