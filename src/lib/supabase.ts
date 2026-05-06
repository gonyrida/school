import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for the Norol Iman High School site.
 *
 * Provide your project URL and anon key in `.env.local`:
 *   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
 *   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
 *
 * If env vars are missing, the client is still created with empty strings so
 * the app boots in "static demo" mode using src/data/content.ts. Auth and
 * database calls will simply fail gracefully until you wire it up.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
