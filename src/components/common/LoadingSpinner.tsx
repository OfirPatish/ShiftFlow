import React, { useEffect } from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  fullPage?: boolean;
  label?: string;
}

/**
 * A dedicated full page spinner that prevents scrollbars
 * Use this component for page-level loading states
 */
export function FullPageSpinner({
  size = 'md',
  color = 'white',
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
}) {
  // Always apply the loading class to HTML element
  useEffect(() => {
    document.documentElement.classList.add('loading');

    // Dispatch custom event for any other components to react
    window.dispatchEvent(new Event('app-loading-started'));

    return () => {
      document.documentElement.classList.remove('loading');

      // Dispatch event when loading ends
      window.dispatchEvent(new Event('app-loading-ended'));
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      style={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'hidden',
      }}
    >
      <LoadingSpinner size={size} color={color} />
    </div>
  );
}

/**
 * A versatile loading spinner component with different sizes and options
 */
export default function LoadingSpinner({
  size = 'sm',
  color = 'white',
  fullPage = false,
  label,
}: LoadingSpinnerProps) {
  // Determine sizes based on prop
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  // Determine color based on prop
  const colorClasses = {
    primary: 'text-primary-500',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  // Apply loading class to HTML element when fullPage is true
  useEffect(() => {
    if (fullPage) {
      document.documentElement.classList.add('loading');

      // Dispatch custom event for any other components to react
      window.dispatchEvent(new Event('app-loading-started'));

      return () => {
        document.documentElement.classList.remove('loading');

        // Dispatch event when loading ends
        window.dispatchEvent(new Event('app-loading-ended'));
      };
    }
  }, [fullPage]);

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );

  // If fullPage is true, center in the page with a semi-transparent backdrop
  if (fullPage) {
    return (
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        style={{
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          overflowY: 'hidden',
        }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * A loading overlay for containers with relative positioning
 */
export function LoadingOverlay({
  label,
  color = 'white',
}: {
  label?: string;
  color?: 'primary' | 'white' | 'gray';
}) {
  return (
    <div className="absolute inset-0 bg-transparent z-10 flex items-center justify-center">
      <LoadingSpinner size="sm" color={color} />
    </div>
  );
}
