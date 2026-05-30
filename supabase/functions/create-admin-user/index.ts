// Ambient declarations for the Deno and npm import used in the Edge Function
declare const Deno: any;
// Use module name without version for TypeScript augmentation to avoid
// "module cannot be found" errors in the type checker.
declare module 'npm:@supabase/supabase-js@2' {
  export function createClient(...args: any[]): any;
}

/**
 * supabase/functions/create-admin-user/index.ts
 *
 * Supabase Edge Function to create a user with admin role.
 * This uses the service_role key (safe server-side only).
 *
 * Deploy with:
 *   supabase functions deploy create-admin-user
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

    const { email, password, full_name, role } = await req.json();

    const { data, error } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role },
    });

    if (error) throw error;

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
