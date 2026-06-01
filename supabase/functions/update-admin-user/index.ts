// Ambient declarations for the Deno and npm import used in the Edge Function
declare const Deno: any;
declare module 'npm:@supabase/supabase-js@2' {
  export function createClient(...args: any[]): any;
}

/**
 * supabase/functions/update-admin-user/index.ts
 *
 * Supabase Edge Function to update a user's profile and/or password.
 * This uses the service_role key (safe server-side only).
 *
 * Deploy with:
 *   supabase functions deploy update-admin-user
 *
 * Required env vars in Supabase Dashboard → Functions → Secrets:
 *   SUPABASE_URL = your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY = your service role key (server-side only)
 *   SUPABASE_ANON_KEY = your anon/public key
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const adminSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

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

    const { user_id, email, password, full_name } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ error: 'user_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Validate password if provided ---
    if (password && password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // --- Update auth.users (email and/or password) if provided ---
    const authUpdates: any = {};
    if (email) authUpdates.email = email;
    if (password) authUpdates.password = password;

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await adminSupabase.auth.admin.updateUserById(
        user_id,
        authUpdates,
      );
      if (authError) throw authError;
    }

    // --- Update profiles table (full_name and/or email) ---
    const profileUpdates: any = {};
    if (full_name !== undefined) profileUpdates.full_name = full_name;
    if (email) profileUpdates.email = email;

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await adminSupabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user_id);

      if (profileError) {
        // If profile row doesn't exist yet, upsert it
        if (profileError.code === 'PGRST116' || profileError.message?.includes('0 rows')) {
          await adminSupabase.from('profiles').upsert({
            id: user_id,
            ...profileUpdates,
            role: 'admin',
          });
        } else {
          throw profileError;
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});