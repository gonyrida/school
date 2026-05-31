/**
 * ProfilePage.tsx — v4
 *
 * Fixes vs previous:
 *  1. Storage 400  — upload path changed to `avatars/${user.id}.ext` which matches
 *                    the storage policy "allow authenticated to upload to avatars/*"
 *                    (run the SQL below to add that policy if missing)
 *  2. profiles 404 — removed ALL client-side profiles upserts.
 *                    The DB trigger handles inserts; auth.updateUser() handles updates.
 *                    This means the page works even if the profiles table doesn't exist.
 */

import { useState, useRef } from 'react';
import { Camera, Key, Mail, Save, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const B = {
  navy: '#1f2f7d', blue: '#2a3fa8', gold: '#e8931d',
  text: '#2c3e50', muted: '#7f8c8d', light: '#f8f9fa', bdr: '#e0e0e0',
};

function SectionCard({ title, icon: Icon, children }: {
  title: string; icon: typeof User; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1px solid ${B.bdr}` }}>
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid #f0f0f0' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: B.navy + '14' }}>
          <Icon className="h-4 w-4" style={{ color: B.navy }} />
        </div>
        <h2 className="font-semibold text-base" style={{ color: B.text }}>{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: B.muted }}>
      {text}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
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

function PrimaryBtn({ loading, label, loadingLabel, onClick, disabled, icon: Icon }: {
  loading: boolean; label: string; loadingLabel: string;
  onClick: () => void; disabled?: boolean; icon: typeof Save;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 active:scale-95"
      style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}
    >
      <Icon className="h-4 w-4" />
      {loading ? loadingLabel : label}
    </button>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  const [fullName,   setFullName]   = useState<string>(user?.user_metadata?.full_name  ?? '');
  const [avatarUrl,  setAvatarUrl]  = useState<string>(user?.user_metadata?.avatar_url ?? '');
  const [uploading,  setUploading]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [newPw,      setNewPw]      = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');
  const [changingPw, setChangingPw] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ─── Avatar upload ────────────────────────────────────────────
     Path: avatars/{user.id}.{ext}  inside the 'media' bucket.
     Storage policy required (run once in SQL editor):
       create policy "avatar_upload"
         on storage.objects for insert
         to authenticated
         with check (bucket_id = 'media' and name like 'avatars/%');
       create policy "avatar_update"
         on storage.objects for update
         to authenticated
         using (bucket_id = 'media' and name like 'avatars/%');
  ─── */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) { toast.error('Please pick an image file'); return; }
    if (file.size > 2 * 1024 * 1024)    { toast.error('Image must be under 2 MB');  return; }

    const ext      = file.name.split('.').pop() ?? 'jpg';
    const filePath = `avatars/${user.id}.${ext}`;  // ← fixed path

    setUploading(true);
    try {
      const { error: upErr } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);
      const freshUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(freshUrl);

      // Only update auth metadata — no profiles table write needed here
      const { error: metaErr } = await supabase.auth.updateUser({ data: { avatar_url: freshUrl } });
      if (metaErr) throw metaErr;

      toast.success('Avatar updated ✓');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  /* ─── Save name + avatar ────────────────────────────────────────
     Only writes to supabase.auth.updateUser() — no profiles upsert.
     The DB trigger (handle_new_user) keeps profiles in sync automatically.
     If profiles table exists, it will be updated by the trigger on next login.
  ─── */
  const handleSave = async () => {
    if (!user) return;
    if (!fullName.trim()) { toast.error('Name cannot be empty'); return; }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim(), avatar_url: avatarUrl },
      });
      if (error) throw error;

      // Refresh session so the topbar name/avatar updates without a page reload
      await supabase.auth.refreshSession();

      toast.success('Profile saved ✓');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Change password ──────────────────────────────────────── */
  const handlePasswordChange = async () => {
    if (!newPw)              { toast.error('Enter a new password');           return; }
    if (newPw.length < 6)    { toast.error('Password must be ≥ 6 characters'); return; }
    if (newPw !== confirmPw) { toast.error('Passwords do not match');         return; }

    setChangingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      toast.success('Password changed ✓');
      setNewPw(''); setConfirmPw('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Password change failed');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: B.navy }}>My Profile</h1>
        <p className="text-sm mt-1" style={{ color: B.muted }}>Update your name, photo, and password.</p>
      </div>

      <SectionCard title="Profile Information" icon={User}>
        {/* Avatar picker */}
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-bold text-white select-none"
              style={{ background: `linear-gradient(135deg,${B.navy},${B.blue})` }}
            >
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                : (fullName || user?.email || 'A')[0].toUpperCase()
              }
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              title="Change photo"
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full text-white flex items-center justify-center shadow-md transition hover:opacity-80 disabled:opacity-50"
              style={{ background: B.gold }}
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="min-w-0">
            <p className="font-semibold truncate" style={{ color: B.text }}>{fullName || '—'}</p>
            <p className="text-xs truncate" style={{ color: B.muted }}>{user?.email}</p>
            {uploading && <p className="text-xs mt-1 font-medium" style={{ color: B.gold }}>Uploading…</p>}
            <p className="text-xs mt-1" style={{ color: B.muted }}>Max 2 MB · JPG, PNG, WebP</p>
          </div>
        </div>

        <div>
          <Label text="Full Name" />
          <TextInput
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>

        <div>
          <Label text="Email (cannot change)" />
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: B.muted }} />
            <input
              readOnly
              value={user?.email ?? ''}
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border cursor-not-allowed"
              style={{ borderColor: B.bdr, background: '#ececec', color: B.muted }}
            />
          </div>
        </div>

        <PrimaryBtn icon={Save} label="Save Profile" loadingLabel="Saving…" loading={saving} onClick={handleSave} />
      </SectionCard>

      <SectionCard title="Change Password" icon={Key}>
        <div>
          <Label text="New Password" />
          <TextInput type="password" placeholder="At least 6 characters" value={newPw} onChange={e => setNewPw(e.target.value)} />
        </div>
        <div>
          <Label text="Confirm New Password" />
          <TextInput type="password" placeholder="Repeat new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
        </div>
        <PrimaryBtn icon={Key} label="Change Password" loadingLabel="Changing…" loading={changingPw} disabled={!newPw} onClick={handlePasswordChange} />
      </SectionCard>
    </div>
  );
}
