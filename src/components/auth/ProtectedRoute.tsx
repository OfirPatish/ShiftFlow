'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isRedirecting = useRef(false);

  useEffect(() => {
    // Check if the session is loading
    if (status === 'loading') return;

    // Prevent multiple redirects
    if (isRedirecting.current) return;

    // Case 1: No session - redirect to login
    if (!session) {
      isRedirecting.current = true;
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Case 2: Session exists but is expired
    if (session.expired) {
      isRedirecting.current = true;
      // Simply redirect to login rather than triggering another signOut
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [session, status, router, pathname]);

  // Show loading state while checking session
  if (status === 'loading' || isRedirecting.current) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show children only if authenticated and session is not expired
  return session && !session.expired ? <>{children}</> : null;
}
