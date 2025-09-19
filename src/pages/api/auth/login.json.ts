import type { APIRoute } from 'astro'
import { getSupabaseClient } from '../../../lib/supabase/server'

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 401 }
      )
    }

    return new Response(
      JSON.stringify({
        user: data.user,
        session: data.session,
        message: 'Login successful'
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