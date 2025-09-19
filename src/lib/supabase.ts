import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr'

export const createSupabaseBrowserClient = () =>
  createBrowserClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
  )

export const createSupabaseServerClient = (request: Request) => {
  const response = new Response()

  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.headers.get('cookie')
          if (cookie) {
            const value = cookie
              .split('; ')
              .find(row => row.startsWith(`${name}=`))
              ?.split('=')[1]
            return value
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          response.headers.set('Set-Cookie', `${name}=${value}; Path=/; ${options.sameSite ? `SameSite=${options.sameSite}` : ''}`)
        },
        remove(name: string, options: CookieOptions) {
          response.headers.set('Set-Cookie', `${name}=; Path=/; Max-Age=0; ${options.sameSite ? `SameSite=${options.sameSite}` : ''}`)
        },
      },
    }
  )

  return { supabase, response }
}