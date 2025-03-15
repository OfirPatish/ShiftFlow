'use client';

import { SessionProvider, useSession, signOut, SignOutResponse } from 'next-auth/react';
import { ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { logError } from '@/lib/validation/errorHandlers';

interface AuthContextProps {
  children: ReactNode;
}

// Key used for storing logout timestamp in localStorage
const LOGOUT_EVENT_KEY = 'shiftflow_logout_timestamp';

// This component will monitor the session status globally
function SessionMonitor({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasHandledExpiration = useRef(false);

  // Check on first load if a logout occurred in another tab
  useEffect(() => {
    if (status === 'loading' || !session) return;

    try {
      const lastLogout = localStorage.getItem(LOGOUT_EVENT_KEY);
      if (lastLogout) {
        // Clear the logout timestamp immediately to prevent repeated logouts
        localStorage.removeItem(LOGOUT_EVENT_KEY);

        // If there's a logout timestamp in localStorage, we should sign out
        // This handles the case where a tab was inactive when logout happened in other tabs
        toast('Your session was ended in another tab');
        router.push('/auth/login');
      }
    } catch (error) {
      // Handle localStorage errors (private browsing mode, etc.)
      logError('AuthContext', error);
    }
  }, [session, status, router]);

  useEffect(() => {
    // Only check when session data is loaded and user is authenticated
    if (status === 'loading' || !session) return;

    // If session is expired and we haven't handled it yet
    if (session.expired && !hasHandledExpiration.current) {
      hasHandledExpiration.current = true;
      toast.error('Your session has expired. Please sign in again.');

      // Instead of calling signOut directly, just redirect to login
      router.push('/auth/login');
    }
  }, [session, status, router]);

  // Listen for logout events across tabs
  useEffect(() => {
    // Handler for when a user signs out in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOGOUT_EVENT_KEY && session && !session.expired) {
        // Clear the logout event key
        try {
          localStorage.removeItem(LOGOUT_EVENT_KEY);
        } catch (error) {
          logError('AuthContext', error);
        }

        // Another tab triggered a logout
        toast('You have been signed out in another tab');

        // Signal this tab is being redirected to prevent flash of content
        hasHandledExpiration.current = true;

        // Simply redirect to login instead of calling signOut again
        router.push('/auth/login');
      }
    };

    // Set up listener for storage events
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [session, router]);

  return <>{children}</>;
}

// Wrap signOut to broadcast logout event to other tabs
export const broadcastSignOut = (options?: Parameters<typeof signOut>[0]) => {
  try {
    // Set timestamp in localStorage to trigger storage event in other tabs
    localStorage.setItem(LOGOUT_EVENT_KEY, Date.now().toString());
  } catch (error) {
    logError('AuthContext', error);
  }

  // Delay the sign out to ensure the localStorage event is propagated first
  return new Promise<SignOutResponse | undefined>((resolve) => {
    setTimeout(() => {
      signOut({
        ...options,
        // Force redirect to be handled by signOut itself rather than manual navigation
        redirect: options?.redirect !== false,
        callbackUrl: options?.callbackUrl || '/',
      }).then(resolve);
    }, 10);
  });
};

export function AuthProvider({ children }: AuthContextProps) {
  return (
    <SessionProvider refetchInterval={300} refetchWhenOffline={false} refetchOnWindowFocus={true}>
      <SessionMonitor>{children}</SessionMonitor>
    </SessionProvider>
  );
}
