import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Define role-based route mappings
const roleRoutes = {
  SUPERADMIN: '/superadmin/dashboard',
  ADMIN: '/admin/dashboard', 
  SERVICE_PROVIDER: '/sp/dashboard',
  USER: '/user/dashboard'
} as const

// Define protected routes for each role
const protectedRoutes = {
  SUPERADMIN: ['/superadmin'],
  ADMIN: ['/admin'],
  SERVICE_PROVIDER: ['/sp'],
  USER: ['/user']
} as const

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the session
  const session = await auth()
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/signin',
    '/auth/signup', 
    '/auth/forgot-password',
    '/auth/reset-password',
    '/api/auth',
    '/_next',
    '/favicon.ico'
  ]
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // If user is not authenticated, redirect to home
  if (!session?.user) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  const userRole = session.user.role as keyof typeof roleRoutes
  
  // Check if user is trying to access their dashboard
  const userDashboard = roleRoutes[userRole]
  if (pathname === userDashboard) {
    return NextResponse.next()
  }
  
  // Check if user is trying to access a protected route for their role
  const userProtectedRoutes = protectedRoutes[userRole]
  const isAccessingOwnRoute = userProtectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  if (isAccessingOwnRoute) {
    return NextResponse.next()
  }
  
  // Check if user is trying to access a protected route for a different role
  const isAccessingOtherRoleRoute = Object.values(protectedRoutes)
    .filter(routes => routes !== userProtectedRoutes)
    .some(routes => routes.some(route => pathname.startsWith(route)))
  
  if (isAccessingOtherRoleRoute) {
    // Redirect to their appropriate dashboard
    return NextResponse.redirect(new URL(userDashboard, request.url))
  }
  
  // If user is authenticated but accessing a non-protected route,
  // redirect them to their dashboard
  if (session.user) {
    return NextResponse.redirect(new URL(userDashboard, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
