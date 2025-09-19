import type { APIRoute } from 'astro'
import { getSupabaseClient } from '../../../lib/supabase/server'

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.headers.get('origin')}/auth/reset-password`
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Password reset email sent successfully' }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}