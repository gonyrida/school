/**
 * ProfilePage.tsx
 * ✅ FIX 4: Admin can edit their profile info (name, avatar, password)
 *
 * Add to App.tsx under /dashboard routes:
 *   import ProfilePage from '@/pages/dashboard/ProfilePage';
 *   <Route path="profile" element={<ProfilePage />} />
 */

import { useState, useRef } from 'react';
import { User, Camera, Key, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // ── Upload avatar to Supabase Storage ──────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const ext = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${ext}`;

    setUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
      toast.success('Avatar uploaded');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // ── Save profile (name + avatar) ────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl,
        },
      });
      if (error) throw error;

      // Also update profiles table if it exists
      await supabase
        .from('profiles')
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq('id', user.id);

      toast.success('Profile updated');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ─────────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setChangingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Password change failed');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink-900">My Profile</h1>
        <p className="text-sm text-ink-500 mt-1">Update your name, avatar, and password.</p>
      </header>

      {/* Profile Info Card */}
      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-ink-900 flex items-center gap-2">
          <User className="h-4 w-4 text-brand-700" />
          Profile Information
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-brand-100 overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-brand-700">
                  {(fullName || user?.email || 'A')[0].toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-700 text-white flex items-center justify-center shadow hover:bg-brand-800 transition"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-900">{fullName || 'No name set'}</p>
            <p className="text-xs text-ink-500">{user?.email}</p>
            {uploading && <p className="text-xs text-brand-700 mt-1">Uploading…</p>}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-ink-700 mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-xl bg-surface-muted border-0 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-xs font-medium text-ink-700 mb-1">Email (cannot change)</label>
          <input
            type="email"
            value={user?.email ?? ''}
            readOnly
            className="w-full rounded-xl bg-surface-muted border-0 px-4 py-2.5 text-sm text-ink-400 cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="btn-primary w-full sm:w-auto disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </div>

      {/* Change Password Card */}
      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-ink-900 flex items-center gap-2">
          <Key className="h-4 w-4 text-brand-700" />
          Change Password
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-ink-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-xl bg-surface-muted border-0 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full rounded-xl bg-surface-muted border-0 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
            />
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          disabled={changingPw || !newPassword}
          className="btn-primary w-full sm:w-auto disabled:opacity-60"
        >
          <Key className="h-4 w-4" />
          {changingPw ? 'Changing…' : 'Change Password'}
        </button>
      </div>
    </div>
  );
}
