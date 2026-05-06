import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { SchoolLogo } from '@/components/ui/SchoolLogo';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="checker-bg flex min-h-screen items-center justify-center bg-surface-soft px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>

        <div className="card p-8 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <SchoolLogo className="h-14 w-14" />
            <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Sign in to manage Norol Iman High School
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              Supabase is not yet configured. Add your project URL and anon key
              to <code className="font-mono">.env.local</code> to enable real
              authentication. You can still preview the dashboard at{' '}
              <Link to="/dashboard" className="font-semibold underline">
                /dashboard
              </Link>
              .
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@noroliman.school"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-400">
            Forgot your password? Contact your system administrator.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
