import type { APIRoute } from 'astro'
import { getSupabaseClient } from '../../../lib/supabase/server'

export const GET: APIRoute = async ({ request }) => {
  try {
    const { supabase } = getSupabaseClient(request)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 401 }
      )
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError)
    }

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          ...profile
        }
      }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}