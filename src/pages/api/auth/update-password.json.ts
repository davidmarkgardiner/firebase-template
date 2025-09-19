import type { APIRoute } from 'astro'
import { getSupabaseClient } from '../../../lib/supabase/server'

export const POST: APIRoute = async ({ request }) => {
  try {
    const { password } = await request.json()

    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Password updated successfully' }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}