'use client';

import { ReactNode } from 'react';
import Header from '@/components/layout/navigation/Header';
import Sidebar from '@/components/layout/navigation/Sidebar';
import BottomNav from '@/components/layout/navigation/BottomNav';
import { useLayout } from '@/context/LayoutContext';

// Create a simple context to track global loading state
import { createContext, useContext, useState } from 'react';

// Create a loading context
export const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {},
});

// Hook to use loading context
export const useLoading = () => useContext(LoadingContext);

// Loading provider component
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isMobile, isHydrated } = useLayout();
  const { isLoading } = useLoading();

  return (
    <LoadingProvider>
      <div
        className={`flex h-screen bg-theme ${isLoading ? 'overflow-hidden' : 'overflow-hidden'}`}
      >
        {/* Sidebar - only visible on desktop */}
        {/* Desktop: Show by default, hide only if explicitly on mobile after hydration */}
        {/* Mobile: Hide by default */}
        <div
          className={`fixed inset-y-0 left-0 z-30 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 w-64
            ${isHydrated && isMobile ? 'hidden' : 'hidden lg:block'} 
          `}
        >
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
          <Header />

          {/* Page content */}
          <div
            className={`flex-1 overflow-auto p-4 md:p-5 lg:p-6 transition-all duration-300 bg-theme ${
              isHydrated && isMobile ? 'pb-20' : ''
            }`}
          >
            <div className="mx-auto max-w-7xl w-full">
              <div className="mx-auto w-full h-full">{children}</div>
            </div>
          </div>

          {/* Bottom Navigation - only show on mobile */}
          <div className="lg:hidden">
            <BottomNav />
          </div>
        </div>
      </div>
    </LoadingProvider>
  );
};

export default MainLayout;
