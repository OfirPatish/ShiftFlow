import React, { useState, useEffect } from 'react';
import LoadingSpinner, { FullPageSpinner } from './LoadingSpinner';

interface LoadingContainerProps {
  isLoading: boolean;
  children: React.ReactNode;
  height?: string;
  label?: string;
  className?: string;
  minDisplayTime?: number;
}

/**
 * A container component that shows children or a loading spinner
 * Useful for replacing skeleton loaders throughout the application
 */
export default function LoadingContainer({
  isLoading,
  children,
  height = 'min-h-[200px]',
  label = 'Loading...',
  className = '',
  minDisplayTime = 800,
}: LoadingContainerProps) {
  const [shouldShow, setShouldShow] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldShow(true);

      // If loading stops, we still want to show the spinner for the minimum time
    } else if (!isLoading && shouldShow) {
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, minDisplayTime);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minDisplayTime, shouldShow]);

  if (shouldShow) {
    return (
      <div
        className={`${height} w-full flex items-center justify-center overflow-hidden ${className}`}
      >
        <LoadingSpinner size="sm" color="white" />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * A page loading container that shows a centered loader on the entire content area
 */
export function PageLoadingContainer({
  isLoading,
  children,
  label = 'Loading...',
  minDisplayTime = 800,
}: LoadingContainerProps) {
  const [shouldShow, setShouldShow] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldShow(true);
    } else if (!isLoading && shouldShow) {
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, minDisplayTime);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minDisplayTime, shouldShow]);

  if (shouldShow) {
    // Use the FullPageSpinner component instead of custom implementation
    return <FullPageSpinner />;
  }

  return <>{children}</>;
}

/**
 * A section loading container that shows a centered loader with a backdrop
 * over the section content area
 */
export function SectionLoadingContainer({
  isLoading,
  children,
  label = 'Loading data...',
  minDisplayTime = 800,
}: LoadingContainerProps) {
  const [shouldShow, setShouldShow] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldShow(true);
    } else if (!isLoading && shouldShow) {
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, minDisplayTime);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minDisplayTime, shouldShow]);

  return (
    <div className="relative overflow-hidden">
      {children}

      {shouldShow && (
        <div className="absolute inset-0 bg-transparent rounded-lg flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" />
        </div>
      )}
    </div>
  );
}
