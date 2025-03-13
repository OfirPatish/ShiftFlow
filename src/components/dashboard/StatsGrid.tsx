import StatsCard from './StatsCard';
import { getCurrencySymbol } from '@/lib/currencyFormatter';

interface MonthlyStats {
  totalEarnings: number;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  overtimeEarnings?: number;
  shiftsCount: number;
}

interface StatsGridProps {
  monthlyStats: MonthlyStats;
  previousMonthStats: MonthlyStats;
}

/**
 * Grid of statistics cards for the dashboard
 */
export default function StatsGrid({ monthlyStats, previousMonthStats }: StatsGridProps) {
  return (
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
          value={`${getCurrencySymbol()}${Math.round(monthlyStats.totalEarnings).toLocaleString()}`}
          accentColor="green"
          details={[
            {
              label: 'Regular',
              value: `${getCurrencySymbol()}${Math.round(
                monthlyStats.totalEarnings - (monthlyStats.overtimeEarnings || 0)
              ).toLocaleString()}`,
            },
            {
              label: 'Overtime',
              value: `${getCurrencySymbol()}${Math.round(
                monthlyStats.overtimeEarnings || 0
              ).toLocaleString()}`,
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
  );
}
