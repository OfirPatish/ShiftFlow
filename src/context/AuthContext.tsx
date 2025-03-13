'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface AuthContextProps {
  children: ReactNode;
}

// This component will monitor the session status globally
function SessionMonitor({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasHandledExpiration = useRef(false);

  useEffect(() => {
    // Only check when session data is loaded and user is authenticated
    if (status === 'loading' || !session) return;

    // If session is expired and we haven't handled it yet
    if (session.expired && !hasHandledExpiration.current) {
      hasHandledExpiration.current = true;
      toast.error('Your session has expired. Please sign in again.');

      // Properly sign out the user to clear the session
      signOut({ redirect: false }).then(() => {
        router.push('/auth/login');
      });
    }
  }, [session, status, router]);

  return <>{children}</>;
}

export function AuthProvider({ children }: AuthContextProps) {
  return (
    <SessionProvider refetchInterval={300} refetchWhenOffline={false} refetchOnWindowFocus={true}>
      <SessionMonitor>{children}</SessionMonitor>
    </SessionProvider>
  );
}
