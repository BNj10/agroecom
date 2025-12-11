import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  if (path.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && path.startsWith('/dashboard')) {
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const userRole = profile?.role || 'farmer'

    const isAdminZone = path.startsWith('/dashboard/admin')
    const isLenderZone = path.startsWith('/dashboard/lender')
    const isOverview = path === '/dashboard/overview'

    if (isAdminZone && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (isLenderZone && userRole !== 'lender') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (isOverview && (userRole !== 'admin' && userRole !== 'lender')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}