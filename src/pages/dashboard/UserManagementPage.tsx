/**
 * UserManagementPage.tsx
 * ✅ FIX 5: Shows authenticated Supabase users, add-admin works correctly.
 *
 * Root causes fixed:
 *  a) Previous version queried `profiles` table which may be empty if the
 *     DB trigger hasn't run or RLS blocks the read. Now we fetch from
 *     `profiles` WITH a fallback message explaining the setup step.
 *  b) Edge Function `create-admin-user` must exist (see supabase/functions/).
 *     If the function isn't deployed yet, the page shows a clear warning.
 *  c) RLS: the `profiles` select policy must allow the logged-in admin to
 *     read all rows (not just their own). SQL migration below fixes this.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  Clock, Eye, EyeOff, Mail, Plus,
  RefreshCw, Search, Shield, Trash2,
  UserCheck, Users, X, AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

/* ── Types ────────────────────────────────────────────────── */
interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'editor';
  created_at: string;
  last_sign_in_at: string | null;
}
interface NewUserForm {
  email: string; password: string; full_name: string; role: 'admin' | 'editor';
}
const EMPTY: NewUserForm = { email: '', password: '', full_name: '', role: 'admin' };

/* ── Brand ────────────────────────────────────────────────── */
const B = {
  navy: '#1f2f7d', blue: '#2a3fa8', gold: '#e8931d',
  text: '#2c3e50', muted: '#7f8c8d', light: '#f8f9fa', bdr: '#e0e0e0',
};

/* ── Stat card ────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: typeof Users; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm" style={{ border: `1px solid ${B.bdr}` }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '18' }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: B.text }}>{value}</p>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: B.muted }}>{label}</p>
      </div>
    </div>
  );
}

/* ── Field input ──────────────────────────────────────────── */
function ModalInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none transition"
      style={{ borderColor: B.bdr, background: B.light, color: B.text }}
      onFocus={e  => { e.currentTarget.style.borderColor = B.navy; e.currentTarget.style.boxShadow = `0 0 0 3px ${B.navy}18`; }}
      onBlur={e   => { e.currentTarget.style.borderColor = B.bdr;  e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}

/* ══ Main page ════════════════════════════════════════════════ */
export default function UserManagementPage() {
  const [users,         setUsers]         = useState<AdminUser[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [fetchError,    setFetchError]    = useState<string | null>(null);
  const [showModal,     setShowModal]     = useState(false);
  const [form,          setForm]          = useState<NewUserForm>(EMPTY);
  const [submitting,    setSubmitting]    = useState(false);
  const [showPw,        setShowPw]        = useState(false);
  const [search,        setSearch]        = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  /* ── Fetch users from profiles table ──────────────────────
     The profiles table is populated by a DB trigger on auth.users INSERT.
     If it's empty, that means either:
       1. The SQL migration hasn't been run yet (see SETUP.md), or
       2. RLS is blocking the select (the policy must allow admin reads).
  ── */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at, last_sign_in_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data ?? []) as AdminUser[]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load users';
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  /* ── Add user via Edge Function ───────────────────────────
     Calls create-admin-user which uses service_role key to:
       adminClient.auth.admin.createUser({ email, password, email_confirm: true, user_metadata })
     This is identical to the Supabase Auth dashboard "Add user" button.
  ── */
  const handleAddUser = async () => {
    if (!form.email || !form.password || !form.full_name) {
      toast.error('Please fill in all fields'); return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: {
          email:     form.email,
          password:  form.password,
          full_name: form.full_name,
          role:      form.role,
        },
      });

      if (error) {
        // If the Edge Function isn't deployed yet, give a helpful message
        if (error.message?.includes('Failed to send') || error.message?.includes('not found')) {
          throw new Error(
            'Edge Function not deployed. Run: supabase functions deploy create-admin-user'
          );
        }
        throw error;
      }
      if (data?.error) throw new Error(data.error);

      toast.success(`${form.role === 'admin' ? 'Admin' : 'Editor'} account created ✓`);
      setShowModal(false);
      setForm(EMPTY);
      // Wait briefly for the DB trigger to fire, then refresh
      setTimeout(() => { void fetchUsers(); }, 1000);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Delete user ──────────────────────────────────────── */
  const handleDelete = async (userId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-admin-user', {
        body: { user_id: userId },
      });
      if (error) throw error;
      toast.success('User removed');
      setUsers(prev => prev.filter(u => u.id !== userId));
      setDeleteConfirm(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  /* ── Render ────────────────────────────────────────────── */
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: B.navy }}>User Management</h1>
          <p className="text-sm mt-1" style={{ color: B.muted }}>
            Manage admin and editor accounts. All accounts can log in to this dashboard.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow transition hover:opacity-90 active:scale-95"
          style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}
        >
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {/* Setup warning banner */}
      {fetchError && (
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#fff3cd', border: '1px solid #ffc107' }}>
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-yellow-600" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold">Could not load users</p>
            <p className="mt-0.5">{fetchError}</p>
            <p className="mt-1">Make sure you've run the SQL migration and the RLS policy allows admin reads. See SETUP.md.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Users"  value={users.length}                              icon={Users}     color={B.navy} />
        <StatCard label="Admins"       value={users.filter(u => u.role === 'admin').length}  icon={Shield}    color={B.blue} />
        <StatCard label="Editors"      value={users.filter(u => u.role === 'editor').length} icon={UserCheck} color={B.gold} />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1px solid ${B.bdr}` }}>
        {/* Search bar */}
        <div className="flex items-center gap-3 p-5" style={{ borderBottom: `1px solid #f0f0f0` }}>
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: B.muted }} />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm border outline-none transition"
              style={{ background: B.light, borderColor: B.bdr, color: B.text }}
              onFocus={e => (e.currentTarget.style.borderColor = B.navy)}
              onBlur={e  => (e.currentTarget.style.borderColor = B.bdr)}
            />
          </div>
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-lg border transition hover:bg-gray-50"
            style={{ borderColor: B.bdr, color: B.muted }}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Table / empty state */}
        {loading ? (
          <div className="space-y-3 p-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: B.light }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: B.navy + '12' }}>
              <Users className="h-7 w-7" style={{ color: B.navy }} />
            </div>
            <p className="font-semibold" style={{ color: B.text }}>
              {fetchError ? 'Could not load users' : users.length === 0 ? 'No users yet' : 'No matches'}
            </p>
            <p className="text-sm mt-1" style={{ color: B.muted }}>
              {!fetchError && users.length === 0
                ? 'Add the first admin with the "Add User" button above.'
                : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold uppercase tracking-wider" style={{ background: B.light, color: B.muted }}>
                  {['User', 'Role', 'Joined', 'Last Sign In', ''].map(h => (
                    <th key={h} className="px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50/60 transition" style={{ borderColor: '#f0f0f0' }}>
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
                          style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}
                        >
                          {(u.full_name || u.email)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate" style={{ color: B.text }}>{u.full_name || '—'}</p>
                          <p className="text-xs truncate" style={{ color: B.muted }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Role badge */}
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                        style={u.role === 'admin'
                          ? { background: B.navy + '15', color: B.navy }
                          : { background: B.gold  + '22', color: '#b86d0e' }
                        }
                      >
                        <Shield className="h-3 w-3" />{u.role}
                      </span>
                    </td>
                    {/* Joined */}
                    <td className="px-5 py-4 text-xs whitespace-nowrap" style={{ color: B.muted }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    {/* Last sign-in */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap" style={{ color: B.muted }}>
                        <Clock className="h-3 w-3" />
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      {deleteConfirm === u.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs" style={{ color: B.muted }}>Delete?</span>
                          <button onClick={() => handleDelete(u.id)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                            style={{ background: '#dc3545' }}>Yes</button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold border hover:bg-gray-50"
                            style={{ borderColor: B.bdr, color: B.muted }}>No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(u.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition"
                          style={{ color: B.muted }}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══ ADD USER MODAL ════════════════════════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(31,47,125,0.35)', backdropFilter: 'blur(4px)' }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal header */}
            <div
              className="px-6 py-5 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}
            >
              <div>
                <h2 className="font-bold text-lg text-white">Add New User</h2>
                <p className="text-xs text-white/65 mt-0.5">Creates a Supabase Auth account instantly</p>
              </div>
              <button
                onClick={() => { setShowModal(false); setForm(EMPTY); }}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>
                  Full Name
                </label>
                <ModalInput
                  type="text"
                  placeholder="e.g. Ahmad Rashid"
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: B.muted }} />
                  <ModalInput
                    type="email"
                    placeholder="admin@school.edu"
                    style={{ paddingLeft: '2.5rem' }}
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>
                  Password
                </label>
                <div className="relative">
                  <ModalInput
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    style={{ paddingRight: '2.5rem' }}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: B.muted }}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>
                  Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['admin', 'editor'] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => setForm(f => ({ ...f, role: r }))}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition"
                      style={form.role === r
                        ? { borderColor: B.navy, background: B.navy + '10', color: B.navy }
                        : { borderColor: B.bdr,  background: 'white',       color: B.muted }
                      }
                    >
                      <Shield className="h-4 w-4" />
                      {r === 'admin' ? 'Admin' : 'Editor'}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-1.5" style={{ color: B.muted }}>
                  {form.role === 'admin'
                    ? 'Full access — pages, events, media, and user management.'
                    : 'Content only — pages, events, media. No user management.'}
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => { setShowModal(false); setForm(EMPTY); }}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                style={{ borderColor: B.bdr, color: B.muted }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 active:scale-95"
                style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}
              >
                {submitting ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
