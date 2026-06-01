// supabase/functions/delete-admin-user/index.ts

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

Deno.serve(async (req: Request) => {
  // Handle browser preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Method not allowed',
      }),
      {
        status: 405,
        headers: corsHeaders,
      }
    );
  }

  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
        }),
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    const adminSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const callerSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Verify current user
    const {
      data: { user },
      error: userError,
    } = await callerSupabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
        }),
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    const body = await req.json();
    const userId = body.userId;

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'User ID is required',
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Prevent deleting yourself
    if (user.id === userId) {
      return new Response(
        JSON.stringify({
          error: 'You cannot delete your own account',
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Delete from Auth
    const { error: deleteError } =
      await adminSupabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      throw deleteError;
    }

    // Delete profile record (optional if cascading)
    await adminSupabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin deleted successfully',
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Delete user error:', error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});