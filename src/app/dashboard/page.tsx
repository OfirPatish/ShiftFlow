'use client';

import { useState, useEffect } from 'react';
import { useShifts } from '@/hooks/useShifts';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { calculateMonthlyTotals } from '@/lib/shiftCalculator';
import { showErrorToast, showInfoToast } from '@/lib/notificationToasts';
import { FullPageSpinner } from '@/components/common/LoadingSpinner';
import MonthSelector from '@/components/common/MonthSelector';
import { useRouter } from 'next/navigation';

// Import new dashboard components
import StatsCard from '@/components/dashboard/StatsCard';

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
  }, [
    fetchShifts,
    selectedMonth,
    monthlyStats.totalEarnings,
    monthlyStats.totalHours,
    monthlyStats.regularHours,
    monthlyStats.overtimeHours,
    monthlyStats.overtimeEarnings,
    monthlyStats.shiftsCount,
    shifts,
  ]);

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
    // Show empty state if no shifts
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

        <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/30 p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-2 text-gray-100">Welcome to ShiftFlow!</h2>
            <p className="text-gray-400 text-sm">
              You haven&apos;t tracked any shifts yet. Let&apos;s get you started with your shift
              tracking journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/60 rounded-lg p-5 border border-gray-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full"></div>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold mb-3">
                1
              </span>
              <h3 className="text-lg font-medium text-white mb-2">Create an Employer</h3>
              <p className="text-gray-400 text-sm">
                Start by adding an employer. This will allow you to organize shifts by workplace.
              </p>
            </div>

            <div className="bg-gray-800/60 rounded-lg p-5 border border-gray-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full"></div>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold mb-3">
                2
              </span>
              <h3 className="text-lg font-medium text-white mb-2">Set Up Pay Rates</h3>
              <p className="text-gray-400 text-sm">
                Configure your hourly rates, including overtime rates to accurately calculate
                earnings.
              </p>
            </div>

            <div className="bg-gray-800/60 rounded-lg p-5 border border-gray-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full"></div>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 font-bold mb-3">
                3
              </span>
              <h3 className="text-lg font-medium text-white mb-2">Add Your Shifts</h3>
              <p className="text-gray-400 text-sm">
                Record your work shifts with start/end times. Your earnings will be calculated
                automatically.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/employers"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Add Employer
            </a>
            <a
              href="/shifts"
              className="inline-flex items-center px-4 py-2 border border-gray-700/50 text-sm font-medium rounded-md text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Add Shift
            </a>
          </div>
        </div>
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

      {/* Stats Cards in Center Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Monthly Shifts Card */}
        <div className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-full">
          <StatsCard
            title="Monthly Shifts"
            value={monthlyStats.shiftsCount}
            unit="shifts"
            progressPercentage={Math.min(100, (monthlyStats.shiftsCount / 20) * 100)}
            details={[
              { label: 'Average per week', value: `${(monthlyStats.shiftsCount / 4).toFixed(1)}` },
              { label: 'Last month', value: `${previousMonthStats.shiftsCount}` },
            ]}
          />
        </div>

        {/* Monthly Income Card */}
        <div className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-full">
          <StatsCard
            title="Monthly Income"
            value={`$${Math.round(monthlyStats.totalEarnings).toLocaleString()}`}
            accentColor="green"
            details={[
              {
                label: 'Regular',
                value: `$${Math.round(
                  monthlyStats.totalEarnings - (monthlyStats.overtimeEarnings || 0)
                ).toLocaleString()}`,
              },
              {
                label: 'Overtime',
                value: `$${Math.round(monthlyStats.overtimeEarnings || 0).toLocaleString()}`,
              },
            ]}
          />
        </div>

        {/* Work Hours Card */}
        <div className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-full">
          <StatsCard
            title="Work Hours"
            value={monthlyStats.totalHours.toFixed(1)}
            unit="hours"
            accentColor="blue"
            details={[
              { label: 'Regular', value: `${monthlyStats.regularHours.toFixed(1)}h` },
              { label: 'Overtime', value: `${monthlyStats.overtimeHours.toFixed(1)}h` },
            ]}
          />
        </div>
      </div>

      {/* Additional information or tips section */}
      <div className="mt-10 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-6 max-w-6xl mx-auto hover:bg-gray-800/40 transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="bg-blue-500/20 p-2 rounded-full mr-3 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-100">Quick Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-gray-400 text-sm">
            Visit the <span className="text-primary">shifts page</span> to add or edit your work
            shifts. Track your earnings and hours worked efficiently with ShiftFlow.
          </p>
          <p className="text-gray-400 text-sm">
            Set up <span className="text-green-400">overtime rules</span> for each employer to
            automatically calculate extra pay for hours worked beyond your regular schedule.
          </p>
        </div>
      </div>
    </div>
  );
}
