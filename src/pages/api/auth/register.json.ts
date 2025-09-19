import type { APIRoute } from 'astro'
import { getSupabaseClient } from '../../../lib/supabase/server'

export const POST: APIRoute = async ({ request }) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      coffeePreferences,
      newsletter
    } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return new Response(
        JSON.stringify({ error: 'Email, password, first name, and last name are required' }),
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null
        },
        emailRedirectTo: `${request.headers.get('origin')}/auth/verify-email`
      }
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      )
    }

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email,
            phone: phone || null,
            address: address || null,
            coffee_preferences: coffeePreferences || [],
            newsletter_subscription: newsletter || false,
            created_at: new Date().toISOString()
          }
        ])

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        // Don't fail the registration if profile creation fails
      }
    }

    return new Response(
      JSON.stringify({
        user: data.user,
        message: 'Registration successful. Please check your email to verify your account.'
      }),
      { status: 201 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}