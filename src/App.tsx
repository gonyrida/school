import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CmsPage } from '@/components/CmsPage';

// Public pages — Events list/detail stay as their own components since
// they query the events collection, not a single page.
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import ContactPage from '@/pages/ContactPage';

// Hardcoded fallbacks (used while the CMS is being seeded the first time)
import HomePage from '@/pages/HomePage';
import SchoolPage from '@/pages/about/SchoolPage';
import LeaderPage from '@/pages/about/LeaderPage';
import DormitoryPage from '@/pages/about/DormitoryPage';
import CurriculumOverviewPage from '@/pages/curriculum/OverviewPage';
import KindergartenPage from '@/pages/curriculum/KindergartenPage';
import ElementaryPage from '@/pages/curriculum/ElementaryPage';
import AdmissionsPage from '@/pages/AdmissionsPage';
import SupportPage from '@/pages/SupportPage';

// Dashboard pages
import LoginPage from '@/pages/dashboard/LoginPage';
import DashboardOverviewPage from '@/pages/dashboard/OverviewPage';
import AdminListPage from '@/pages/dashboard/AdminListPage';

// CMS admin pages
import PagesListPage from '@/cms/admin/pages/PagesListPage';
import PageBuilderPage from '@/cms/admin/pages/PageBuilderPage';
import EventsListPage from '@/cms/admin/pages/EventsListPage';
import EventEditPage from '@/cms/admin/pages/EventEditPage';
import MediaLibraryPage from '@/cms/admin/pages/MediaLibraryPage';

function NotFoundPage() {
  return (
    <div className="container-page py-32 text-center">
      <p className="eyebrow text-brand-700">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-ink-900">Page not found</h1>
      <p className="mt-3 text-ink-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="btn-primary mt-8 inline-flex">
        Back to homepage
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', background: '#0f172a', color: '#fff' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public website (CMS-backed where applicable) */}
        <Route element={<PublicLayout />}>
          <Route index element={<CmsPage pageKey="home" fallback={<HomePage />} />} />

          <Route path="about">
            <Route index element={<Navigate to="/about/school" replace />} />
            <Route path="school" element={<CmsPage pageKey="about/school" fallback={<SchoolPage />} />} />
            <Route path="leader" element={<CmsPage pageKey="about/leader" fallback={<LeaderPage />} />} />
            <Route path="dormitory" element={<CmsPage pageKey="about/dormitory" fallback={<DormitoryPage />} />} />
          </Route>

          <Route path="curriculum">
            <Route index element={<CmsPage pageKey="curriculum" fallback={<CurriculumOverviewPage />} />} />
            <Route
              path="kindergarten"
              element={<CmsPage pageKey="curriculum/kindergarten" fallback={<KindergartenPage />} />}
            />
            <Route
              path="elementary"
              element={<CmsPage pageKey="curriculum/elementary" fallback={<ElementaryPage />} />}
            />
          </Route>

          <Route path="admissions" element={<CmsPage pageKey="admissions" fallback={<AdmissionsPage />} />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:slug" element={<EventDetailPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="support" element={<CmsPage pageKey="support" fallback={<SupportPage />} />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin dashboard (protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverviewPage />} />

          {/* CMS modules */}
          <Route path="pages" element={<PagesListPage />} />
          <Route path="pages/:pageKey" element={<PageBuilderPage />} />

          <Route path="events" element={<EventsListPage />} />
          <Route path="events/new" element={<EventEditPage />} />
          <Route path="events/:id" element={<EventEditPage />} />

          <Route path="media" element={<MediaLibraryPage />} />

          {/* Legacy admin scaffolds (still useful for users/settings) */}
          <Route
            path="users"
            element={
              <AdminListPage
                title="User Management"
                description="Add admins and editors. Manage roles and permissions."
                itemLabel="User"
              />
            }
          />
          <Route
            path="settings"
            element={
              <AdminListPage
                title="Settings"
                description="Site-wide settings: school info, social links, SEO, and integrations."
                itemLabel="Setting"
              />
            }
          />

          {/* Redirect old per-page admin routes to the new pages module */}
          <Route path="homepage" element={<Navigate to="/dashboard/pages/home" replace />} />
          <Route path="about" element={<Navigate to="/dashboard/pages" replace />} />
          <Route path="curriculum" element={<Navigate to="/dashboard/pages" replace />} />
          <Route path="news" element={<Navigate to="/dashboard/events" replace />} />
          <Route path="gallery" element={<Navigate to="/dashboard/media" replace />} />
          <Route path="admissions" element={<Navigate to="/dashboard/pages/admissions" replace />} />
          <Route path="contact" element={<Navigate to="/dashboard/pages/contact" replace />} />
          <Route path="support" element={<Navigate to="/dashboard/pages/support" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
