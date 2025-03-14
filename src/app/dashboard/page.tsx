'use client';

import { startOfMonth, endOfMonth } from 'date-fns';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FullPageSpinner } from '@/components/common/LoadingSpinner';
import { useShifts } from '@/hooks/useShifts';
import { showErrorToast } from '@/lib/notificationToasts';
import { calculateMonthlyTotals } from '@/lib/shiftCalculator';
import { MonthlyStats } from '@/types/dashboard';
import DashboardContent from '@/components/dashboard/DashboardContent';
import EmptyState from '@/components/dashboard/EmptyState';
import ErrorState from '@/components/dashboard/ErrorState';

export default function Dashboard() {
  const router = useRouter();
  const { shifts, isLoading: apiLoading, fetchShifts, error } = useShifts();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [fetchError, setFetchError] = useState<string | null>(null);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track if this is the initial load
  const initialLoadRef = useRef(true);

  // Separate state for UI loading and data loading
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    totalHours: 0,
    totalEarnings: 0,
    regularHours: 0,
    overtimeHours: 0,
    overtimeEarnings: 0,
    shiftsCount: 0,
  });

  const [previousMonthStats, setPreviousMonthStats] = useState<MonthlyStats>({
    totalHours: 0,
    totalEarnings: 0,
    regularHours: 0,
    overtimeHours: 0,
    overtimeEarnings: 0,
    shiftsCount: 0,
  });

  // Handle initial loading with minimum display time
  useEffect(() => {
    // Start with loading state
    if (initialLoadRef.current) {
      document.documentElement.classList.add('loading');

      // Minimum display time for the spinner (1 second)
      const minDisplayTimer = setTimeout(() => {
        if (!apiLoading) {
          setIsLoading(false);
          document.documentElement.classList.remove('loading');
          initialLoadRef.current = false;
        }
      }, 1000);

      // Safety timeout to prevent infinite loading (5 seconds)
      const safetyTimer = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          document.documentElement.classList.remove('loading');
          initialLoadRef.current = false;
        }
      }, 5000);

      return () => {
        clearTimeout(minDisplayTimer);
        clearTimeout(safetyTimer);
      };
    }
  }, [apiLoading, isLoading]);

  // Handle subsequent data fetches
  useEffect(() => {
    if (!initialLoadRef.current) {
      if (apiLoading) {
        setIsLoading(true);
        document.documentElement.classList.add('loading');

        // Clear any existing timeout
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      } else {
        // Minimum display time (800ms) for loading indicator even if data fetches quickly
        loadingTimeoutRef.current = setTimeout(() => {
          setIsLoading(false);
          document.documentElement.classList.remove('loading');
        }, 800);
      }
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [apiLoading]);

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('loading');
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Add check for authentication errors
  useEffect(() => {
    if (error) {
      if (error.includes('Unauthorized') || error.includes('401')) {
        // Handle authentication error by redirecting to login
        showErrorToast('Your session has expired. Please log in again.');
        router.push('/login');
      } else {
        // Show error in UI
        setFetchError(error);
      }
    }
  }, [error, router]);

  // Fetch shifts data on mount or when selected month changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get start and end dates for the selected month
        const startDate = startOfMonth(selectedMonth);
        const endDate = endOfMonth(selectedMonth);

        // Call the fetchShifts function with the date range
        await fetchShifts({
          startDate,
          endDate,
        });

        // Fetch previous month data for trend comparison
        const previousMonthDate = new Date(selectedMonth);
        previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
        const prevStartDate = startOfMonth(previousMonthDate);
        const prevEndDate = endOfMonth(previousMonthDate);

        // Fetch previous month data without triggering loading state
        try {
          // We use a separate fetch for previous month data without affecting loading state
          const prevMonthShifts = await fetch(
            `/api/shifts?startDate=${prevStartDate.toISOString()}&endDate=${prevEndDate.toISOString()}`
          )
            .then((res) => res.json())
            .then((data) => data.shifts || []);

          if (prevMonthShifts.length > 0) {
            const prevStats = calculateMonthlyTotals(prevMonthShifts);
            setPreviousMonthStats({
              ...prevStats,
              shiftsCount: prevMonthShifts.length,
            });
          }
        } catch (prevMonthError) {
          // Silently handle errors for previous month - we'll just use zero values
          // We don't show this error to the user as it's not critical
          // eslint-disable-next-line no-console
          console.warn('Failed to fetch previous month data', prevMonthError);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch shifts';
        setFetchError(errorMessage);
      }
    };

    fetchData();
  }, [fetchShifts, selectedMonth]);

  // Calculate monthly statistics when shifts change
  useEffect(() => {
    if (shifts) {
      try {
        const stats = calculateMonthlyTotals(shifts);
        setMonthlyStats({
          ...stats,
          shiftsCount: shifts.length,
        });
      } catch (error) {
        // Log error but don't show to user as the UI can still function
        // eslint-disable-next-line no-console
        console.error('Error calculating statistics', error);
      }
    }
  }, [shifts]);

  // Handle month change
  const handleMonthChange = (startDate: Date, endDate: Date, currentMonth: Date) => {
    setSelectedMonth(currentMonth);
  };

  // Handle retry on error
  const handleRetry = (startDate: Date, endDate: Date) => {
    setFetchError(null);
    fetchShifts({ startDate, endDate });
  };

  // Dashboard render logic with clear conditions
  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (fetchError) {
    return <ErrorState selectedMonth={selectedMonth} onRetry={handleRetry} />;
  }

  if (!shifts || shifts.length === 0) {
    return <EmptyState selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />;
  }

  // Dashboard content
  return (
    <DashboardContent
      shifts={shifts}
      monthlyStats={monthlyStats}
      previousMonthStats={previousMonthStats}
      selectedMonth={selectedMonth}
      onMonthChange={handleMonthChange}
    />
  );
}
