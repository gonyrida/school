/**
 * ProfilePage.tsx  — brand-guideline refresh
 * Colors: Navy #1f2f7d · Blue #2a3fa8 · Gold #e8931d · Text #2c3e50
 */

import { useState, useRef } from 'react';
import { User, Camera, Key, Save, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const BRAND = {
  navy: '#1f2f7d',
  blue: '#2a3fa8',
  gold: '#e8931d',
  text: '#2c3e50',
  muted: '#7f8c8d',
  light: '#f8f9fa',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
        style={{ color: BRAND.muted }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function InputBase({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none transition"
      style={{
        borderColor: '#e0e0e0',
        background: BRAND.light,
        color: BRAND.text,
        ...style,
      }}
      onFocus={e => (e.currentTarget.style.borderColor = BRAND.navy)}
      onBlur={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
    />
  );
}

function Card({ title, icon: Icon, children }: {
  title: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
      <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: BRAND.navy + '12' }}>
          <Icon className="h-4 w-4" style={{ color: BRAND.navy }} />
        </div>
        <h2 className="font-semibold text-base" style={{ color: BRAND.text }}>{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName]   = useState(user?.user_metadata?.full_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [newPassword, setNewPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPw, setChangingPw] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${ext}`;
    setUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from('media').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
      toast.success('Avatar updated');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: avatarUrl },
      });
      if (error) throw error;
      await supabase.from('profiles')
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq('id', user.id);
      toast.success('Profile saved ✓');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Min. 6 characters'); return; }
    setChangingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password changed ✓');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Change failed');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold" style={{ color: BRAND.navy }}>My Profile</h1>
        <p className="text-sm mt-1" style={{ color: BRAND.muted }}>Update your name, avatar, and password.</p>
      </header>

      {/* ── Profile info ── */}
      <Card title="Profile Information" icon={User}>
        {/* Avatar picker */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})` }}
            >
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                : (fullName || user?.email || 'A')[0].toUpperCase()
              }
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full text-white flex items-center justify-center shadow transition hover:opacity-80"
              style={{ background: BRAND.gold }}
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: BRAND.text }}>{fullName || 'No name set'}</p>
            <p className="text-xs" style={{ color: BRAND.muted }}>{user?.email}</p>
            {uploading && <p className="text-xs mt-1" style={{ color: BRAND.gold }}>Uploading…</p>}
          </div>
        </div>

        <Field label="Full Name">
          <InputBase
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </Field>

        <Field label="Email (read-only)">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: BRAND.muted }} />
            <input
              readOnly
              value={user?.email ?? ''}
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border cursor-not-allowed"
              style={{ borderColor: '#e0e0e0', background: '#f0f0f0', color: BRAND.muted }}
            />
          </div>
        </Field>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})` }}
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </Card>

      {/* ── Change password ── */}
      <Card title="Change Password" icon={Key}>
        <Field label="New Password">
          <InputBase
            type="password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </Field>
        <Field label="Confirm New Password">
          <InputBase
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </Field>
        <button
          onClick={handlePasswordChange}
          disabled={changingPw || !newPassword}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})` }}
        >
          <Key className="h-4 w-4" />
          {changingPw ? 'Changing…' : 'Change Password'}
        </button>
      </Card>
    </div>
  );
}
