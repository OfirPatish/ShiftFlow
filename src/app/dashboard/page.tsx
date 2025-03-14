'use client';

import { useState, useEffect } from 'react';
import { useShifts } from '@/hooks/useShifts';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { calculateMonthlyTotals } from '@/lib/shiftCalculator';
import { showErrorToast, showInfoToast } from '@/lib/notificationToasts';
import { FullPageSpinner } from '@/components/common/LoadingSpinner';
import { useRouter } from 'next/navigation';

// Import components
import DashboardContent from '@/components/dashboard/DashboardContent';
import EmptyState from '@/components/dashboard/EmptyState';
import ErrorState from '@/components/dashboard/ErrorState';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// Import types
import { MonthlyStats } from '@/types/dashboard';

export default function Dashboard() {
  const router = useRouter();
  const { shifts, isLoading: apiLoading, fetchShifts, error } = useShifts();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Statistics state
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    totalEarnings: 0,
    totalHours: 0,
    regularHours: 0,
    overtimeHours: 0,
    overtimeEarnings: 0,
    shiftsCount: 0,
  });
  const [previousMonthStats, setPreviousMonthStats] = useState<MonthlyStats>({
    totalEarnings: 0,
    totalHours: 0,
    regularHours: 0,
    overtimeHours: 0,
    overtimeEarnings: 0,
    shiftsCount: 0,
  });

  // Controlled loading state that ensures minimum display time
  const [isLoading, setIsLoading] = useState(true);
  const minLoadingTime = 1000; // 1 second

  // Add check for authentication errors
  useEffect(() => {
    if (error) {
      if (error.includes('Unauthorized') || error.includes('401')) {
        showErrorToast('Your session has expired. Redirecting to login...');
        // Give time for the toast to be displayed before redirect
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        // Always display errors as toast notifications
        showErrorToast(`Error: ${error}`);
      }
    }
  }, [error, router]);

  // Fetch shifts when the selected month changes
  useEffect(() => {
    const currentMonthStart = startOfMonth(selectedMonth);
    const currentMonthEnd = endOfMonth(selectedMonth);

    setFetchError(null);

    // Fetch current month data with error handling
    const fetchData = async () => {
      try {
        await fetchShifts({
          startDate: currentMonthStart,
          endDate: currentMonthEnd,
        });
      } catch (error) {
        // Error is already handled in the useShifts hook
      }
    };

    fetchData();
    fetchPreviousMonthData();
  }, [fetchShifts, selectedMonth]);

  // Fetch previous month data for comparison
  const fetchPreviousMonthData = async () => {
    try {
      // In a production app, you would make an actual API call here
      // For now, we'll simulate it with a timeout and dummy data
      setTimeout(() => {
        // This is just a placeholder. In a real app, you would call your API
        const previousMonthData = {
          totalEarnings: 0,
          totalHours: 0,
          regularHours: 0,
          overtimeHours: 0,
          overtimeEarnings: 0,
          shiftsCount: 0,
        };

        // If we have shifts data, calculate some comparison stats
        if (shifts && shifts.length > 0) {
          previousMonthData.totalEarnings = monthlyStats.totalEarnings * 0.9;
          previousMonthData.totalHours = monthlyStats.totalHours * 0.85;
          previousMonthData.regularHours = monthlyStats.regularHours * 0.9;
          previousMonthData.overtimeHours = monthlyStats.overtimeHours * 0.7;
          previousMonthData.overtimeEarnings = (monthlyStats.overtimeEarnings || 0) * 0.7;
          previousMonthData.shiftsCount = Math.max(0, monthlyStats.shiftsCount - 2);
        }

        setPreviousMonthStats(previousMonthData);
      }, 500);
    } catch (error: any) {
      // Log for debugging but use toast for user feedback
      showErrorToast(`Error with previous month data: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle month change
  const handleMonthChange = (startDate: Date, endDate: Date, currentMonth: Date) => {
    setSelectedMonth(currentMonth);
    showInfoToast(`Viewing shifts for ${format(currentMonth, 'MMMM yyyy')}`);
  };

  // Handle loading state with minimum display time
  useEffect(() => {
    if (apiLoading) {
      setIsLoading(true);
    } else {
      // When API loading is done, wait for minimum display time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [apiLoading, minLoadingTime]);

  // Calculate monthly stats whenever shifts change
  useEffect(() => {
    if (shifts && shifts.length > 0) {
      // Calculate monthly totals
      const { totalEarnings, totalHours, regularHours, overtimeHours } =
        calculateMonthlyTotals(shifts);

      // Calculate overtime earnings (total - regular)
      const regularEarnings = shifts.reduce((total, shift) => total + shift.regularEarnings, 0);
      const overtimeEarnings = totalEarnings - regularEarnings;

      setMonthlyStats({
        totalEarnings,
        totalHours,
        regularHours,
        overtimeHours,
        overtimeEarnings,
        shiftsCount: shifts.length,
      });
    } else {
      // Reset stats if no shifts
      setMonthlyStats({
        totalEarnings: 0,
        totalHours: 0,
        regularHours: 0,
        overtimeHours: 0,
        overtimeEarnings: 0,
        shiftsCount: 0,
      });
    }
  }, [shifts]);

  // Handle retry action from error state
  const handleRetry = (startDate: Date, endDate: Date) => {
    fetchShifts({
      startDate,
      endDate,
    });
  };

  // Always show loading indicator first
  if (isLoading) {
    return <FullPageSpinner />;
  }

  // Replace the fetchError error display with a more user-friendly empty state
  if (fetchError) {
    showErrorToast(`Error loading your shifts: ${fetchError}`);
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-16 xl:px-24 py-8">
        <DashboardHeader selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />
        <ErrorState selectedMonth={selectedMonth} onRetry={handleRetry} />
      </div>
    );
  }

  // After loading, show either empty state or dashboard content
  if (!shifts || shifts.length === 0) {
    return <EmptyState selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />;
  }

  // Show dashboard content if there are shifts
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
