/**
 * supabase/functions/create-admin-user/index.ts
 *
 * Deploy: supabase functions deploy create-admin-user
 *
 * Required secret (set in Supabase Dashboard → Functions → Secrets):
 *   SUPABASE_SERVICE_ROLE_KEY = your service_role key
 *
 * This function:
 *  1. Verifies the calling user is authenticated
 *  2. Uses the service_role key to call auth.admin.createUser()
 *     — identical to the Supabase Auth dashboard "Add user" button
 *  3. Upserts a row in public.profiles so the user appears in the list
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
    }

    // Admin client (service_role — never sent to the browser)
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Anon client — verify the caller is a real logged-in user
    const callerClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
    }

    const { email, password, full_name, role } = await req.json() as {
      email: string; password: string; full_name: string; role: 'admin' | 'editor';
    };

    if (!email || !password || !full_name) {
      return new Response(JSON.stringify({ error: 'email, password, and full_name are required' }), {
        status: 400, headers: CORS,
      });
    }

    // Create the user in Supabase Auth
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,          // auto-confirm — user can log in immediately
      user_metadata: { full_name, role },
    });
    if (error) throw error;

    // Upsert into profiles so the user appears in the management table
    await adminClient.from('profiles').upsert({
      id:               data.user.id,
      email:            data.user.email,
      full_name,
      role:             role ?? 'editor',
      created_at:       new Date().toISOString(),
      last_sign_in_at:  null,
    }, { onConflict: 'id' });

    return new Response(JSON.stringify({ user: { id: data.user.id, email: data.user.email } }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
