import StatsCard from './StatsCard';
import { getCurrencySymbol } from '@/lib/utils/currencyFormatter';
import { MonthlyStats } from '@/types/ui/dashboard';

interface StatsGridProps {
  monthlyStats: MonthlyStats;
  previousMonthStats: MonthlyStats;
}

/**
 * Grid of statistics cards for the dashboard
 */
export default function StatsGrid({ monthlyStats, previousMonthStats }: StatsGridProps) {
  // Calculate comparison trends for key metrics
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { type: 'none', value: '0%' };
    const percentChange = ((current - previous) / previous) * 100;
    return {
      type: percentChange >= 0 ? 'up' : 'down',
      value: `${Math.abs(percentChange).toFixed(1)}%`,
    };
  };

  const earningsTrend = calculateTrend(
    monthlyStats.totalEarnings,
    previousMonthStats.totalEarnings
  );
  const hoursTrend = calculateTrend(monthlyStats.totalHours, previousMonthStats.totalHours);

  // Calculate overtime percentage
  const overtimePercentage =
    monthlyStats.totalHours > 0 ? (monthlyStats.overtimeHours / monthlyStats.totalHours) * 100 : 0;

  // Calculate average earnings per shift
  const avgEarningsPerShift =
    monthlyStats.shiftsCount > 0 ? monthlyStats.totalEarnings / monthlyStats.shiftsCount : 0;

  // Calculate average hours per shift
  const avgHoursPerShift =
    monthlyStats.shiftsCount > 0 ? monthlyStats.totalHours / monthlyStats.shiftsCount : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Monthly Income Card */}
      <div className="transition-all duration-300 hover:translate-y-[-4px] h-full">
        <StatsCard
          title="Monthly Income"
          value={`${getCurrencySymbol()}${Math.round(monthlyStats.totalEarnings).toLocaleString()}`}
          accentColor="green"
          trend={earningsTrend.type === 'none' ? undefined : (earningsTrend.type as 'up' | 'down')}
          trendValue={earningsTrend.type === 'none' ? undefined : earningsTrend.value}
          details={[
            {
              label: 'Regular',
              value: `${getCurrencySymbol()}${Math.round(
                monthlyStats.totalEarnings -
                  ((monthlyStats.overtimeEarnings1 || 0) + (monthlyStats.overtimeEarnings2 || 0))
              ).toLocaleString()}`,
            },
            {
              label: 'Overtime',
              value: `${getCurrencySymbol()}${Math.round(
                (monthlyStats.overtimeEarnings1 || 0) + (monthlyStats.overtimeEarnings2 || 0)
              ).toLocaleString()}`,
            },
          ]}
        />
      </div>

      {/* Work Hours Card */}
      <div className="transition-all duration-300 hover:translate-y-[-4px] h-full">
        <StatsCard
          title="Work Hours"
          value={monthlyStats.totalHours.toFixed(1)}
          unit="hours"
          accentColor="blue"
          trend={hoursTrend.type === 'none' ? undefined : (hoursTrend.type as 'up' | 'down')}
          trendValue={hoursTrend.type === 'none' ? undefined : hoursTrend.value}
          details={[
            { label: 'Regular', value: `${monthlyStats.regularHours.toFixed(1)}h` },
            { label: 'Overtime', value: `${monthlyStats.overtimeHours.toFixed(1)}h` },
            {
              label: 'OT Percentage',
              value: `${overtimePercentage.toFixed(1)}%`,
            },
          ]}
        />
      </div>

      {/* Key Metrics Card */}
      <div className="transition-all duration-300 hover:translate-y-[-4px] h-full">
        <StatsCard
          title="Efficiency Metrics"
          value={`${avgHoursPerShift.toFixed(1)}`}
          unit="hrs/shift"
          accentColor="primary"
          details={[
            {
              label: 'Total Shifts',
              value: monthlyStats.shiftsCount.toString(),
            },
            {
              label: 'Avg per Shift',
              value: `${getCurrencySymbol()}${Math.round(avgEarningsPerShift).toLocaleString()}`,
            },
            {
              label: 'Hourly Rate',
              value: `${getCurrencySymbol()}${(monthlyStats.totalHours > 0
                ? monthlyStats.totalEarnings / monthlyStats.totalHours
                : 0
              ).toFixed(2)}`,
            },
          ]}
        />
      </div>
    </div>
  );
}
