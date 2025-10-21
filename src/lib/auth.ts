import { auth as clerkAuth } from "@clerk/nextjs/server";

const hasClerkKeys = 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

/**
 * Conditional auth helper that works with or without Clerk configured
 * Returns userId if authenticated, or "dev-user" if running without auth
 */
export async function auth() {
  if (hasClerkKeys) {
    return await clerkAuth();
  }
  
  // If no auth configured, return a development user
  return { userId: "dev-user" };
}

