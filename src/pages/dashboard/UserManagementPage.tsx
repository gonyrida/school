/**
 * UserManagementPage.tsx
 * Full CRUD with tabbed Edit modal (Profile tab + Password tab).
 */

import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle, Check, Clock, Edit3, Eye, EyeOff,
  KeyRound, Mail, Plus, RefreshCw, Search, Shield,
  Trash2, User, Users, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

/* ─── Types ─────────────────────────────────────────────────── */
interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
}
interface NewUserForm  { email: string; password: string; full_name: string }
interface EditUserForm { id: string; email: string; full_name: string }
interface PwForm       { password: string; confirm: string }

const EMPTY_NEW:  NewUserForm  = { email: '', password: '', full_name: '' };
const EMPTY_EDIT: EditUserForm = { id: '', email: '', full_name: '' };
const EMPTY_PW:   PwForm       = { password: '', confirm: '' };

/* ─── Brand ─────────────────────────────────────────────────── */
const B = {
  navy: '#1f2f7d', blue: '#2a3fa8', gold: '#e8931d',
  text: '#2c3e50', muted: '#7f8c8d', light: '#f8f9fa', bdr: '#e0e0e0',
};

/* ─── Helpers ───────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: typeof Users; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm"
         style={{ border: `1px solid ${B.bdr}` }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: color + '18' }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: B.text }}>{value}</p>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: B.muted }}>{label}</p>
      </div>
    </div>
  );
}

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none transition"
      style={{ borderColor: B.bdr, background: B.light, color: B.text }}
      onFocus={e => { e.currentTarget.style.borderColor = B.navy; e.currentTarget.style.boxShadow = `0 0 0 3px ${B.navy}18`; }}
      onBlur={e  => { e.currentTarget.style.borderColor = B.bdr;  e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}

function PwStrength({ pw }: { pw: string }) {
  if (!pw) return null;
  const score = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
  const levels = ['Too short', 'Weak', 'Fair', 'Strong', 'Very strong'];
  const colors = ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#198754'];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0,1,2,3].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all"
               style={{ background: i < score ? colors[score] : B.bdr }} />
        ))}
      </div>
      <p className="text-[11px]" style={{ color: colors[score] }}>{levels[score]}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page
═══════════════════════════════════════════════════════════════ */
export default function UserManagementPage() {
  /* list state */
  const [users, setUsers]           = useState<AdminUser[]>([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch]         = useState('');

  /* add modal */
  const [showAdd, setShowAdd]       = useState(false);
  const [addForm, setAddForm]       = useState<NewUserForm>(EMPTY_NEW);
  const [showAddPw, setShowAddPw]   = useState(false);
  const [adding, setAdding]         = useState(false);

  /* edit modal – tabbed */
  const [showEdit, setShowEdit]         = useState(false);
  const [editTab, setEditTab]           = useState<'profile' | 'password'>('profile');
  const [editForm, setEditForm]         = useState<EditUserForm>(EMPTY_EDIT);
  const [pwForm, setPwForm]             = useState<PwForm>(EMPTY_PW);
  const [showNewPw, setShowNewPw]       = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [editSaving, setEditSaving]     = useState(false);
  const [pwSaved, setPwSaved]           = useState(false);   // green tick after pw change

  /* delete */
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting]           = useState(false);

  /* ── open edit ── */
  const openEdit = (u: AdminUser) => {
    setEditForm({ id: u.id, email: u.email, full_name: u.full_name ?? '' });
    setPwForm(EMPTY_PW);
    setEditTab('profile');
    setShowNewPw(false);
    setShowConfirmPw(false);
    setPwSaved(false);
    setShowEdit(true);
  };

  /* ── fetch ── */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase.functions.invoke('list-admin-users');
      if (error) {
        if (error.message?.includes('Failed to send') || error.message?.includes('not found') || error.message?.includes('404')) {
          const { data: pd, error: pe } = await supabase
            .from('profiles')
            .select('id, email, full_name, role, created_at, last_sign_in_at')
            .order('created_at', { ascending: false });
          if (pe) throw pe;
          setUsers((pd ?? []) as AdminUser[]);
          toast('Deploy list-admin-users to see ALL auth users', { icon: 'ℹ️', duration: 5000 });
          return;
        }
        throw error;
      }
      if (data?.error) throw new Error(data.error);
      setUsers((data?.users ?? []) as AdminUser[]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load users';
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  /* ── create ── */
  const handleAdd = async () => {
    if (!addForm.email || !addForm.password || !addForm.full_name) { toast.error('All fields required'); return; }
    if (addForm.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setAdding(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: { email: addForm.email, password: addForm.password, full_name: addForm.full_name },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success('Admin account created ✓');
      setShowAdd(false);
      setAddForm(EMPTY_NEW);
      setTimeout(() => { void fetchUsers(); }, 800);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setAdding(false);
    }
  };

  /* ── save profile (name + email) ── */
  const handleSaveProfile = async () => {
    if (!editForm.email || !editForm.full_name) { toast.error('Email and name are required'); return; }
    setEditSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-admin-user', {
        body: { user_id: editForm.id, email: editForm.email, full_name: editForm.full_name },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setUsers(prev => prev.map(u =>
        u.id === editForm.id ? { ...u, email: editForm.email, full_name: editForm.full_name } : u,
      ));
      toast.success('Profile updated ✓');
      setShowEdit(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setEditSaving(false);
    }
  };

  /* ── save password ── */
  const handleSavePassword = async () => {
    if (!pwForm.password) { toast.error('Enter a new password'); return; }
    if (pwForm.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (pwForm.password !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    setEditSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-admin-user', {
        body: { user_id: editForm.id, password: pwForm.password },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPwForm(EMPTY_PW);
      setPwSaved(true);
      toast.success('Password changed ✓');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setEditSaving(false);
    }
  };

  /* ── delete ── */
  const handleDelete = async (userId: string) => {
    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-admin-user', { body: { userId } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setDeleteConfirm(null);
      toast.success('User removed');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  /* ══════════════ RENDER ══════════════ */
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: B.navy }}>User Management</h1>
          <p className="text-sm mt-1" style={{ color: B.muted }}>Manage admin accounts — all accounts can log in to this dashboard.</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow transition hover:opacity-90 active:scale-95"
          style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}>
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {/* Error banner */}
      {fetchError && (
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#fff3cd', border: '1px solid #ffc107' }}>
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-yellow-600" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold">Could not load users</p>
            <p className="mt-0.5">{fetchError}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Total Users" value={users.length} icon={Users}  color={B.navy} />
        <StatCard label="Admins"      value={users.length} icon={Shield} color={B.blue} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1px solid ${B.bdr}` }}>
        <div className="flex items-center gap-3 p-5" style={{ borderBottom: '1px solid #f0f0f0' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: B.muted }} />
            <input type="text" placeholder="Search by name or email…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm border outline-none transition"
              style={{ background: B.light, borderColor: B.bdr, color: B.text }}
              onFocus={e => (e.currentTarget.style.borderColor = B.navy)}
              onBlur={e  => (e.currentTarget.style.borderColor = B.bdr)} />
          </div>
          <button onClick={() => void fetchUsers()} disabled={loading}
            className="p-2.5 rounded-lg border transition hover:bg-gray-50 disabled:opacity-40"
            style={{ borderColor: B.bdr, color: B.muted }} title="Refresh">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {[...Array(4)].map((_, i) => (
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
              {!fetchError && users.length === 0 ? 'Add the first admin using "Add User" above.' : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold uppercase tracking-wider"
                    style={{ background: B.light, color: B.muted }}>
                  {['User', 'Role', 'Joined', 'Last Sign In', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50/60 transition" style={{ borderColor: '#f0f0f0' }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
                             style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}>
                          {(u.full_name || u.email)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate" style={{ color: B.text }}>{u.full_name || '—'}</p>
                          <p className="text-xs truncate" style={{ color: B.muted }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                            style={{ background: B.navy + '14', color: B.navy }}>
                        <Shield className="h-3 w-3" /> Admin
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs whitespace-nowrap" style={{ color: B.muted }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap" style={{ color: B.muted }}>
                        <Clock className="h-3 w-3" />
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(u)}
                          className="p-2 rounded-lg hover:bg-blue-50 transition"
                          style={{ color: B.muted }} title="Edit user">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {deleteConfirm === u.id ? (
                          <>
                            <button onClick={() => void handleDelete(u.id)} disabled={deleting}
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                              style={{ background: '#dc3545' }}>
                              {deleting ? '…' : 'Confirm'}
                            </button>
                            <button onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold border hover:bg-gray-50"
                              style={{ borderColor: B.bdr, color: B.muted }}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button onClick={() => setDeleteConfirm(u.id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition"
                            style={{ color: B.muted }} title="Delete user">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 text-xs" style={{ color: B.muted, borderTop: `1px solid ${B.bdr}` }}>
              Showing {filtered.length} of {users.length} user{users.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════ ADD MODAL ══════════════ */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(31,47,125,0.35)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between"
                 style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}>
              <div>
                <h2 className="font-bold text-lg text-white">Add New User</h2>
                <p className="text-xs text-white/65 mt-0.5">Creates a Supabase Auth account instantly</p>
              </div>
              <button onClick={() => { setShowAdd(false); setAddForm(EMPTY_NEW); }}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>Full Name</label>
                <FieldInput type="text" placeholder="e.g. Ahmad Rashid" value={addForm.full_name}
                  onChange={e => setAddForm(f => ({ ...f, full_name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: B.muted }} />
                  <FieldInput type="email" placeholder="admin@school.edu" style={{ paddingLeft: '2.5rem' }}
                    value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>Password</label>
                <div className="relative">
                  <FieldInput type={showAddPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                    style={{ paddingRight: '2.5rem' }} value={addForm.password}
                    onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowAddPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: B.muted }}>
                    {showAddPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PwStrength pw={addForm.password} />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                   style={{ background: B.navy + '0d', border: `1px solid ${B.navy}20` }}>
                <Shield className="h-4 w-4" style={{ color: B.navy }} />
                <span className="text-sm font-semibold" style={{ color: B.navy }}>Role: Admin</span>
                <span className="text-xs ml-auto" style={{ color: B.muted }}>All accounts are Admin</span>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => { setShowAdd(false); setAddForm(EMPTY_NEW); }} disabled={adding}
                className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                style={{ borderColor: B.bdr, color: B.muted }}>
                Cancel
              </button>
              <button onClick={() => void handleAdd()} disabled={adding}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 active:scale-95"
                style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}>
                {adding ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ EDIT MODAL (tabbed) ══════════════ */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(31,47,125,0.35)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal header */}
            <div className="px-6 py-5 flex items-center justify-between"
                 style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}>
              <div>
                <h2 className="font-bold text-lg text-white">Edit User</h2>
                <p className="text-xs text-white/65 mt-0.5">{editForm.email}</p>
              </div>
              <button onClick={() => setShowEdit(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex" style={{ borderBottom: `1px solid ${B.bdr}` }}>
              {(['profile', 'password'] as const).map(tab => (
                <button key={tab} onClick={() => { setEditTab(tab); setPwSaved(false); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition"
                  style={{
                    color: editTab === tab ? B.navy : B.muted,
                    borderBottom: editTab === tab ? `2px solid ${B.navy}` : '2px solid transparent',
                    background: editTab === tab ? B.navy + '06' : 'transparent',
                  }}>
                  {tab === 'profile'
                    ? <><User className="h-4 w-4" /> Profile</>
                    : <><KeyRound className="h-4 w-4" /> Password</>}
                </button>
              ))}
            </div>

            {/* ── Profile tab ── */}
            {editTab === 'profile' && (
              <>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>Full Name</label>
                    <FieldInput type="text" placeholder="e.g. Ahmad Rashid" value={editForm.full_name}
                      onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: B.muted }} />
                      <FieldInput type="email" placeholder="admin@school.edu" style={{ paddingLeft: '2.5rem' }}
                        value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                  <button onClick={() => setShowEdit(false)} disabled={editSaving}
                    className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                    style={{ borderColor: B.bdr, color: B.muted }}>
                    Cancel
                  </button>
                  <button onClick={() => void handleSaveProfile()} disabled={editSaving}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}>
                    {editSaving ? 'Saving…' : <><Check className="h-4 w-4" /> Save Profile</>}
                  </button>
                </div>
              </>
            )}

            {/* ── Password tab ── */}
            {editTab === 'password' && (
              <>
                <div className="p-6 space-y-4">

                  {/* Success state */}
                  {pwSaved ? (
                    <div className="flex flex-col items-center py-6 gap-3">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center"
                           style={{ background: '#d1fae5' }}>
                        <Check className="h-7 w-7 text-green-600" />
                      </div>
                      <p className="font-semibold text-green-700">Password changed successfully</p>
                      <p className="text-sm text-center" style={{ color: B.muted }}>
                        The user's password has been updated in Supabase Auth.
                      </p>
                      <button onClick={() => { setPwSaved(false); setPwForm(EMPTY_PW); }}
                        className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold border transition hover:bg-gray-50"
                        style={{ borderColor: B.bdr, color: B.text }}>
                        Change again
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Info banner */}
                      <div className="flex items-start gap-2.5 p-3 rounded-xl text-xs"
                           style={{ background: B.blue + '0d', border: `1px solid ${B.blue}22`, color: B.blue }}>
                        <KeyRound className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>Password is updated directly in Supabase Auth — it is never stored in plain text.</span>
                      </div>

                      {/* New password */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>
                          New Password
                        </label>
                        <div className="relative">
                          <FieldInput
                            type={showNewPw ? 'text' : 'password'}
                            placeholder="Min. 6 characters"
                            style={{ paddingRight: '2.5rem' }}
                            value={pwForm.password}
                            onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))}
                          />
                          <button type="button" onClick={() => setShowNewPw(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: B.muted }}>
                            {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <PwStrength pw={pwForm.password} />
                      </div>

                      {/* Confirm password */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>
                          Confirm Password
                        </label>
                        <div className="relative">
                          <FieldInput
                            type={showConfirmPw ? 'text' : 'password'}
                            placeholder="Re-enter new password"
                            style={{ paddingRight: '2.5rem' }}
                            value={pwForm.confirm}
                            onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                          />
                          <button type="button" onClick={() => setShowConfirmPw(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: B.muted }}>
                            {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {/* Match indicator */}
                        {pwForm.confirm && (
                          <p className="mt-1.5 text-xs flex items-center gap-1"
                             style={{ color: pwForm.password === pwForm.confirm ? '#198754' : '#dc3545' }}>
                            {pwForm.password === pwForm.confirm
                              ? <><Check className="h-3 w-3" /> Passwords match</>
                              : '✕ Passwords do not match'}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {!pwSaved && (
                  <div className="px-6 pb-6 flex gap-3">
                    <button onClick={() => setShowEdit(false)} disabled={editSaving}
                      className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                      style={{ borderColor: B.bdr, color: B.muted }}>
                      Cancel
                    </button>
                    <button onClick={() => void handleSavePassword()} disabled={editSaving}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                      style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}>
                      {editSaving ? 'Saving…' : <><KeyRound className="h-4 w-4" /> Update Password</>}
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}