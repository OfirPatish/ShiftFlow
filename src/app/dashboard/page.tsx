'use client';

import { useState, useEffect } from 'react';
import { useShifts } from '@/hooks/useShifts';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { calculateMonthlyTotals } from '@/lib/shiftCalculator';
import { showErrorToast, showInfoToast } from '@/lib/notificationToasts';
import { FullPageSpinner } from '@/components/common/LoadingSpinner';
import MonthSelector from '@/components/common/MonthSelector';
import { useRouter } from 'next/navigation';
// Import our extracted components
import DashboardTutorial from '@/components/dashboard/DashboardTutorial';
import QuickTips from '@/components/dashboard/QuickTips';
import StatsGrid from '@/components/dashboard/StatsGrid';

interface MonthlyStats {
  totalEarnings: number;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  overtimeEarnings?: number;
  shiftsCount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { shifts, isLoading: apiLoading, fetchShifts, error } = useShifts();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [fetchError, setFetchError] = useState<string | null>(null);

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

    // In a real app, we would also fetch previous month data directly
    // Here we're simulating previous month data fetch
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

    fetchPreviousMonthData();
  }, [fetchShifts, selectedMonth]);

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

  // Always show loading indicator first
  if (isLoading) {
    return <FullPageSpinner />;
  }

  // Replace the fetchError error display with a more user-friendly empty state
  if (fetchError) {
    showErrorToast(`Error loading your shifts: ${fetchError}`);
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-16 xl:px-24 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 mb-1">Dashboard</h1>
            <p className="text-gray-400 text-sm">Your shift work overview</p>
          </div>
          <MonthSelector
            currentDate={selectedMonth}
            onChange={handleMonthChange}
            className="mt-4 sm:mt-0"
          />
        </div>

        <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-8 text-center">
          <p className="text-gray-300 mb-4">Unable to load your dashboard data</p>
          <button
            onClick={() => {
              const currentMonthStart = startOfMonth(selectedMonth);
              const currentMonthEnd = endOfMonth(selectedMonth);
              fetchShifts({
                startDate: currentMonthStart,
                endDate: currentMonthEnd,
              });
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // After loading, show either empty state or dashboard content
  if (!shifts || shifts.length === 0) {
    // Show empty state with tutorial if no shifts
    return (
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 mb-2">Dashboard</h1>
            <p className="text-gray-400">Your shift tracking overview</p>
          </div>
          <MonthSelector
            currentDate={selectedMonth}
            onChange={handleMonthChange}
            className="mt-4 md:mt-0"
          />
        </div>

        <DashboardTutorial />
      </div>
    );
  }

  // Current month name for display
  const currentMonth = format(selectedMonth, 'MMMM yyyy');

  // Show dashboard content if there are shifts
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-8">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg blur-xl opacity-50 -z-10"></div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
            <p className="text-gray-400">{currentMonth} Overview</p>
          </div>
          <MonthSelector
            currentDate={selectedMonth}
            onChange={handleMonthChange}
            className="mt-4 md:mt-0"
          />
        </div>

        <div className="h-1 w-32 bg-gradient-to-r from-primary to-blue-500 rounded-full mb-6"></div>
      </div>

      {/* Stats Cards Grid */}
      <StatsGrid monthlyStats={monthlyStats} previousMonthStats={previousMonthStats} />

      {/* Quick Tips Section */}
      <QuickTips />
    </div>
  );
}
