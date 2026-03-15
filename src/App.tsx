import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

// Layouts
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Pages
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { AuthCallbackPage } from '@/pages/auth/AuthCallbackPage';
import { AuthDebugPage }    from '@/pages/auth/AuthDebugPage';
import { OnboardPage } from '@/pages/onboard/OnboardPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ProjectsPage } from '@/pages/dashboard/ProjectsPage';

// Module Pages
import { InsightPage } from '@/pages/insight/InsightPage';
import { InsightReportPage } from '@/pages/insight/InsightReportPage';
import { ManifestPage } from '@/pages/manifest/ManifestPage';
import { ManifestDeckPage } from '@/pages/manifest/ManifestDeckPage';
import { CraftPage } from '@/pages/craft/CraftPage';
import { CraftImagePage } from '@/pages/craft/CraftImagePage';
import { CraftVideoPage } from '@/pages/craft/CraftVideoPage';
import { CraftAudioPage } from '@/pages/craft/CraftAudioPage';
import { CraftSocialPage } from '@/pages/craft/CraftSocialPage';
import { CraftMockupPage } from '@/pages/craft/CraftMockupPage';
import { CraftPhotographyPage } from '@/pages/craft/CraftPhotographyPage';
import { AmplifyPage } from '@/pages/amplify/AmplifyPage';
import { WorkspacePage } from '@/pages/workspace/WorkspacePage';
import { MarketplacePage } from '@/pages/marketplace/MarketplacePage';
import { SettingsPage } from '@/pages/settings/SettingsPage';


// Marketing / Footer Pages
import { AboutPage }    from '@/pages/marketing/AboutPage';
import { BlogPage }     from '@/pages/marketing/BlogPage';
import { CareersPage }  from '@/pages/marketing/CareersPage';
import { PressPage }    from '@/pages/marketing/PressPage';
import { ContactPage }  from '@/pages/marketing/ContactPage';
import { PrivacyPage }  from '@/pages/marketing/PrivacyPage';
import { TermsPage }    from '@/pages/marketing/TermsPage';
import { CookiesPage }  from '@/pages/marketing/CookiesPage';
import { SecurityPage } from '@/pages/marketing/SecurityPage';
import { ApiDocsPage }  from '@/pages/marketing/ApiDocsPage';
import { RefundPolicyPage } from '@/pages/marketing/RefundPolicyPage';

// Admin Pages
import {
  AdminDashboardPage,
  AdminUsersPage,
  AdminModelsPage,
  AdminPromptsPage,
  AdminAnalyticsPage,
  AdminSettingsPage,
} from '@/pages/admin';

// ─── Route Guards ─────────────────────────────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const { initialize } = useAuthStore();

  // Restore session on mount (calls supabase.auth.getSession)
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Marketing pages */}
          <Route path="/about"    element={<AboutPage />}    />
          <Route path="/blog"     element={<BlogPage />}     />
          <Route path="/careers"  element={<CareersPage />}  />
          <Route path="/press"    element={<PressPage />}    />
          <Route path="/contact"  element={<ContactPage />}  />
          <Route path="/privacy"  element={<PrivacyPage />}  />
          <Route path="/terms"    element={<TermsPage />}    />
          <Route path="/cookies"  element={<CookiesPage />}  />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/api-docs"      element={<ApiDocsPage />}      />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login"  element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/auth/debug"    element={<AuthDebugPage />}    />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Auth callback — handles OAuth + magic link redirects */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/auth/debug"    element={<AuthDebugPage />}    />

          {/* Onboarding — protected but outside dashboard shell */}
          <Route path="/onboard" element={
            <ProtectedRoute><OnboardPage /></ProtectedRoute>
          } />

          {/* Dashboard */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects"  element={<ProjectsPage />} />

            {/* Insight */}
            <Route path="/insight"            element={<InsightPage />} />
            <Route path="/insight/:reportId"  element={<InsightReportPage />} />

            {/* Manifest */}
            <Route path="/manifest"          element={<ManifestPage />} />
            <Route path="/manifest/:deckId"  element={<ManifestDeckPage />} />

            {/* Craft + sub-routes */}
            <Route path="/craft"       element={<CraftPage />} />
            <Route path="/craft/image" element={<CraftImagePage />} />
            <Route path="/craft/video" element={<CraftVideoPage />} />
            <Route path="/craft/audio" element={<CraftAudioPage />} />
            <Route path="/craft/social" element={<CraftSocialPage />} />
            <Route path="/craft/mockup" element={<CraftMockupPage />} />
            <Route path="/craft/photography" element={<CraftPhotographyPage />} />

            {/* Amplify */}
            <Route path="/amplify" element={<AmplifyPage />} />

            {/* Workspace */}
            <Route path="/workspace"            element={<WorkspacePage />} />
            <Route path="/workspace/:projectId" element={<WorkspacePage />} />

            {/* Marketplace (+Human) */}
            <Route path="/marketplace" element={<MarketplacePage />} />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Admin — role-gated */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/admin"            element={<AdminDashboardPage />} />
            <Route path="/admin/dashboard"  element={<AdminDashboardPage />} />
            <Route path="/admin/users"      element={<AdminUsersPage />} />
            <Route path="/admin/models"     element={<AdminModelsPage />} />
            <Route path="/admin/prompts"    element={<AdminPromptsPage />} />
            <Route path="/admin/analytics"  element={<AdminAnalyticsPage />} />
            <Route path="/admin/settings"   element={<AdminSettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
