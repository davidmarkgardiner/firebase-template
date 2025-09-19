import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, url, redirect }) => {
  try {
    // This callback is handled by Supabase Auth automatically
    // The redirect URL is configured in Supabase dashboard
    return redirect('/auth/login?message=Authentication successful')
  } catch (error) {
    return redirect('/auth/login?error=Authentication failed')
  }
}