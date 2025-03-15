/**
 * Authentication Helper Utilities
 *
 * This file provides utility functions for working with authentication in Next.js,
 * primarily focused on server-side authentication checks, session management,
 * and route protection. These helpers simplify authentication logic in route handlers
 * and Server Components.
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/api/authConfig';
import { redirect } from 'next/navigation';

/**
 * Retrieves the current user session on the server
 *
 * This is the primary method to get the authenticated user's session data
 * from server components or API routes. It uses the configuration defined
 * in authConfig.ts.
 *
 * @returns The current session object, or null if not authenticated
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Protects routes by requiring authentication
 *
 * Use this in server components or page layouts that should only be accessible
 * to authenticated users. If the user is not authenticated, they will be
 * automatically redirected to the login page.
 *
 * @param redirectTo - Optional custom redirect URL (defaults to /auth/login)
 * @returns The session object if authenticated
 * @throws Redirects to login page if not authenticated (never returns null)
 */
export async function requireAuth(redirectTo = '/auth/login') {
  const session = await getSession();

  if (!session) {
    redirect(redirectTo);
  }

  return session;
}

/**
 * Checks if the user is currently authenticated
 *
 * Unlike requireAuth, this function doesn't redirect; it just returns a boolean
 * indicating authentication status. Use this when you need to conditionally render
 * content based on authentication without forcing a redirect.
 *
 * @returns True if the user is authenticated, false otherwise
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}
