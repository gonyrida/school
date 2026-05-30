/**
 * UserManagementPage.tsx
 * ✅ FIX 3: Real user management — create admin users via Supabase Admin API
 *
 * Replace the AdminListPage placeholder for /dashboard/users in App.tsx:
 *   import UserManagementPage from '@/pages/dashboard/UserManagementPage';
 *   ...
 *   <Route path="users" element={<UserManagementPage />} />
 */

import { useEffect, useState } from 'react';
import { Plus, Search, Trash2, RefreshCw, Shield, Mail, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
}

interface NewUserForm {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'editor';
}

const EMPTY_FORM: NewUserForm = {
  email: '',
  password: '',
  full_name: '',
  role: 'admin',
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewUserForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Read from profiles table — created by a DB trigger on auth.users insert
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at, last_sign_in_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load users';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  /**
   * ✅ Creates a user the same way Supabase Auth dashboard does:
   *    supabase.auth.admin.createUser() — requires service_role key in an
   *    Edge Function (never expose service_role on the client!).
   *
   *    We call an Edge Function `create-admin-user` that wraps this.
   *    See the SQL + Edge Function setup instructions below.
   */
  const handleAddUser = async () => {
    if (!form.email || !form.password || !form.full_name) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: {
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          role: form.role,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`${form.role === 'admin' ? 'Admin' : 'Editor'} user created!`);
      setShowModal(false);
      setForm(EMPTY_FORM);
      await fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create user';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.functions.invoke('delete-admin-user', {
        body: { user_id: userId },
      });
      if (error) throw error;
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete user';
      toast.error(msg);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">User Management</h1>
          <p className="text-sm text-ink-500 mt-1 max-w-2xl">
            Add admin and editor accounts. Each user can log in to this dashboard.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" /> Add User
        </button>
      </header>

      <div className="card p-5">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full bg-surface-muted border-0 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-full bg-surface-muted hover:bg-brand-50 text-ink-500 hover:text-brand-700 transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-surface-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-400">
            <Shield className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No users found. Add your first admin above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-300/10">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Last Sign In</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-ink-300/5 hover:bg-surface-muted/40 transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-brand-700">
                            {(user.full_name || user.email)[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-ink-900">{user.full_name || '—'}</p>
                          <p className="text-xs text-ink-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-brand-700/10 text-brand-700'
                            : 'bg-accent-gold/10 text-accent-gold'
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-ink-500">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="p-2 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
            <div>
              <h2 className="font-display text-xl font-bold text-ink-900">Add New User</h2>
              <p className="text-sm text-ink-500 mt-1">
                Creates a Supabase Auth account — same as adding from the Supabase dashboard.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ahmad Rashid"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full rounded-xl bg-surface-muted border-0 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
                  <input
                    type="email"
                    placeholder="admin@school.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl bg-surface-muted border-0 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-xl bg-surface-muted border-0 px-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as 'admin' | 'editor' })}
                  className="w-full rounded-xl bg-surface-muted border-0 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
                >
                  <option value="admin">Admin — full access</option>
                  <option value="editor">Editor — content only</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
                className="flex-1 btn-ghost"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={submitting}
                className="flex-1 btn-primary disabled:opacity-60"
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
