/**
 * UserManagementPage.tsx
 * ✅ Fix 1: "Add User" directly calls supabase.auth.admin.createUser via Edge Function
 * ✅ Fix 3: Styled to NICS brand guidelines
 *   Primary:   #1f2f7d (Deep Navy Blue)
 *   Secondary: #2a3fa8 (Medium Blue)
 *   Accent:    #e8931d (Gold)
 *   Success:   #28a745
 *   Text:      #2c3e50
 *   Muted:     #7f8c8d
 */

import { useEffect, useState } from 'react';
import {
  Plus, Search, Trash2, RefreshCw, Shield,
  Mail, Eye, EyeOff, X, Users, UserCheck, Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'editor';
  created_at: string;
  last_sign_in_at: string | null;
}

interface NewUserForm {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'editor';
}

const EMPTY_FORM: NewUserForm = { email: '', password: '', full_name: '', role: 'admin' };

// Brand colours as JS constants for inline styles where Tailwind doesn't reach
const BRAND = {
  navy: '#1f2f7d',
  blue: '#2a3fa8',
  gold: '#e8931d',
  green: '#28a745',
  text: '#2c3e50',
  muted: '#7f8c8d',
  light: '#f8f9fa',
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewUserForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  /* ─── Load users from profiles table ────────────────────────── */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at, last_sign_in_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsers((data as AdminUser[]) ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchUsers(); }, []);

  /* ─── Add User via Edge Function (service_role) ──────────────── */
  const handleAddUser = async () => {
    if (!form.email || !form.password || !form.full_name) {
      toast.error('Please fill in all fields'); return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }

    setSubmitting(true);
    try {
      /**
       * Calls supabase/functions/create-admin-user/index.ts
       * which runs:  adminClient.auth.admin.createUser({ email, password, email_confirm: true, user_metadata })
       * — identical to the Supabase dashboard "Add user" button.
       */
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: { email: form.email, password: form.password, full_name: form.full_name, role: form.role },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`${form.role === 'admin' ? 'Admin' : 'Editor'} account created ✓`);
      setShowModal(false);
      setForm(EMPTY_FORM);
      await fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Delete user ────────────────────────────────────────────── */
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

  const adminCount = users.filter(u => u.role === 'admin').length;
  const editorCount = users.filter(u => u.role === 'editor').length;

  /* ─── JSX ───────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: BRAND.navy }}
          >
            User Management
          </h1>
          <p className="text-sm mt-1 max-w-xl" style={{ color: BRAND.muted }}>
            Manage admin and editor accounts. All users can log in to this dashboard.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white shadow transition hover:opacity-90 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.blue} 100%)` }}
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </header>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Users',  value: users.length, icon: Users,     color: BRAND.navy },
          { label: 'Admins',       value: adminCount,   icon: Shield,    color: BRAND.blue },
          { label: 'Editors',      value: editorCount,  icon: UserCheck, color: BRAND.gold },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl p-5 flex items-center gap-4 bg-white shadow-sm border"
            style={{ borderColor: '#e0e0e0' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: color + '18' }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: BRAND.text }}>{value}</p>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: BRAND.muted }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        {/* Search bar */}
        <div className="flex flex-wrap items-center gap-3 p-5 border-b" style={{ borderColor: '#e0e0e0' }}>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: BRAND.muted }} />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg text-sm py-2.5 pl-10 pr-4 outline-none border focus:ring-2 transition"
              style={{
                background: BRAND.light,
                borderColor: '#e0e0e0',
                color: BRAND.text,
              }}
              onFocus={e => (e.currentTarget.style.borderColor = BRAND.navy)}
              onBlur={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
            />
          </div>
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-lg border transition hover:bg-gray-50"
            style={{ borderColor: '#e0e0e0', color: BRAND.muted }}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3 p-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: BRAND.light }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: BRAND.navy + '12' }}
            >
              <Users className="h-7 w-7" style={{ color: BRAND.navy }} />
            </div>
            <p className="font-semibold" style={{ color: BRAND.text }}>No users found</p>
            <p className="text-sm mt-1" style={{ color: BRAND.muted }}>Add your first admin using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-left text-xs font-bold uppercase tracking-wider"
                  style={{ background: BRAND.light, color: BRAND.muted }}
                >
                  {['User', 'Role', 'Joined', 'Last Sign In', ''].map(h => (
                    <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr
                    key={user.id}
                    className="border-t transition hover:bg-gray-50/60"
                    style={{ borderColor: '#f0f0f0' }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm text-white"
                          style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})` }}
                        >
                          {(user.full_name || user.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: BRAND.text }}>
                            {user.full_name || '—'}
                          </p>
                          <p className="text-xs" style={{ color: BRAND.muted }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                        style={
                          user.role === 'admin'
                            ? { background: BRAND.navy + '15', color: BRAND.navy }
                            : { background: BRAND.gold + '20', color: '#b86d0e' }
                        }
                      >
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: BRAND.muted }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs"
                        style={{ color: BRAND.muted }}
                      >
                        <Clock className="h-3 w-3" />
                        {user.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : 'Never'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {deleteConfirm === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs" style={{ color: BRAND.muted }}>Delete?</span>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold text-white transition hover:opacity-80"
                            style={{ background: '#dc3545' }}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold border transition hover:bg-gray-50"
                            style={{ borderColor: '#e0e0e0', color: BRAND.muted }}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="p-2 rounded-lg transition hover:bg-red-50 hover:text-red-600"
                          style={{ color: BRAND.muted }}
                        >
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

      {/* ── Add User Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(31,47,125,0.35)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal header */}
            <div
              className="px-6 py-5 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.blue} 100%)` }}
            >
              <div>
                <h2 className="font-display font-bold text-lg text-white">Add New User</h2>
                <p className="text-xs text-white/70 mt-0.5">Creates a Supabase Auth account instantly</p>
              </div>
              <button
                onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: BRAND.muted }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ahmad Rashid"
                  value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  className="w-full rounded-lg px-4 py-2.5 text-sm border outline-none transition"
                  style={{ borderColor: '#e0e0e0', color: BRAND.text, background: BRAND.light }}
                  onFocus={e => (e.currentTarget.style.borderColor = BRAND.navy)}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: BRAND.muted }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: BRAND.muted }} />
                  <input
                    type="email"
                    placeholder="admin@school.edu"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm border outline-none transition"
                    style={{ borderColor: '#e0e0e0', color: BRAND.text, background: BRAND.light }}
                    onFocus={e => (e.currentTarget.style.borderColor = BRAND.navy)}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: BRAND.muted }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-lg px-4 pr-10 py-2.5 text-sm border outline-none transition"
                    style={{ borderColor: '#e0e0e0', color: BRAND.text, background: BRAND.light }}
                    onFocus={e => (e.currentTarget.style.borderColor = BRAND.navy)}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: BRAND.muted }}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role selector */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: BRAND.muted }}>
                  Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['admin', 'editor'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, role: r })}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition"
                      style={
                        form.role === r
                          ? { borderColor: BRAND.navy, background: BRAND.navy + '10', color: BRAND.navy }
                          : { borderColor: '#e0e0e0', color: BRAND.muted, background: 'white' }
                      }
                    >
                      <Shield className="h-4 w-4" />
                      {r === 'admin' ? 'Admin' : 'Editor'}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-1.5" style={{ color: BRAND.muted }}>
                  {form.role === 'admin' ? 'Full access to all dashboard sections.' : 'Can manage content only (pages, events, media).'}
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                style={{ borderColor: '#e0e0e0', color: BRAND.muted }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.blue} 100%)` }}
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
