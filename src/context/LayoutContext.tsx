'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LayoutContextType {
  isMobile: boolean;
  isHydrated: boolean;
}

// Default values based on whether we're in a browser or server environment
const defaultIsMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : true;

const defaultContext: LayoutContextType = {
  isMobile: defaultIsMobile,
  isHydrated: false,
};

const LayoutContext = createContext<LayoutContextType>(defaultContext);

export function useLayout() {
  return useContext(LayoutContext);
}

export function LayoutProvider({ children }: { children: ReactNode }) {
  // Initialize with more accurate value if possible
  const [isMobile, setIsMobile] = useState(defaultIsMobile);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    // Mark as hydrated immediately during the first client-side render
    setIsHydrated(true);

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check to ensure current value is accurate
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        isMobile,
        isHydrated,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
