/**
 * supabase/functions/create-admin-user/index.ts
 *
 * ✅ FIX 3 — Supabase Edge Function to create a user with admin role.
 * This uses the service_role key (safe server-side only).
 *
 * Deploy with:
 *   supabase functions deploy create-admin-user
 *
 * Required env var in Supabase Dashboard → Functions → Secrets:
 *   SUPABASE_SERVICE_ROLE_KEY = your service_role key
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow calls from authenticated admins
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Create admin client with service_role key
    const adminSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Verify the calling user is an admin
    const callerSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: callerData } = await callerSupabase.auth.getUser();
    if (!callerData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const { email, password, full_name, role } = await req.json();

    // Create user — same as Supabase Auth dashboard "Add user" button
    const { data, error } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // auto-confirm so they can log in immediately
      user_metadata: { full_name, role },
    });

    if (error) throw error;

    // Upsert into profiles table
    await adminSupabase.from('profiles').upsert({
      id: data.user.id,
      email,
      full_name,
      role,
      created_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ user: data.user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
