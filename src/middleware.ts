import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/studio(.*)'])

// Check if Clerk keys are properly configured
const hasClerkKeys = 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

export default function middleware(req: NextRequest) {
  // If Clerk is not configured, allow all routes
  if (!hasClerkKeys) {
    return NextResponse.next()
  }
  
  // If Clerk is configured, use Clerk middleware for protected routes
  return clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect()
  })(req)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
