// Ambient declarations for the Deno and npm import used in the Edge Function
declare const Deno: any;
declare module 'npm:@supabase/supabase-js@2' {
  export function createClient(...args: any[]): any;
}

/**
 * supabase/functions/list-admin-users/index.ts
 *
 * Supabase Edge Function to list ALL users from auth.users
 * using the service_role key (required — anon key cannot list users).
 *
 * Deploy with:
 *   supabase functions deploy list-admin-users
 *
 * Required env vars (auto-injected in Supabase-hosted functions):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   SUPABASE_ANON_KEY
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Verify the caller is an authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const callerSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: callerData, error: callerError } = await callerSupabase.auth.getUser();
    if (callerError || !callerData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Use service role to list ALL auth users (admin API)
    const adminSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Fetch up to 1000 users (paginate if needed for larger datasets)
    const { data: authData, error: authError } = await adminSupabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authError) throw authError;

    // 3. Also fetch profiles for full_name data
    const { data: profiles } = await adminSupabase
      .from('profiles')
      .select('id, full_name, role');

    const profileMap: Record<string, { full_name: string | null; role: string }> = {};
    if (profiles) {
      for (const p of profiles) {
        profileMap[p.id] = { full_name: p.full_name, role: p.role ?? 'admin' };
      }
    }

    // 4. Merge auth users with profile data
    const users = (authData?.users ?? []).map((u: any) => ({
      id: u.id,
      email: u.email ?? '',
      full_name:
        profileMap[u.id]?.full_name ??
        u.user_metadata?.full_name ??
        u.raw_user_meta_data?.full_name ??
        null,
      role: profileMap[u.id]?.role ?? u.user_metadata?.role ?? 'admin',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
    }));

    // Sort by created_at descending
    users.sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return new Response(JSON.stringify({ users }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});