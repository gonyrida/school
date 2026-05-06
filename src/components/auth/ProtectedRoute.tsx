import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Guards `/dashboard/*` routes. While Supabase is unconfigured we let the
 * route through so designers can preview the dashboard mockups locally.
 * Once you set the env vars, unauthenticated users get bounced to /login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!isSupabaseConfigured) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-soft">
        <div className="flex flex-col items-center gap-3 text-ink-500">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
          <p className="text-sm">Checking session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
