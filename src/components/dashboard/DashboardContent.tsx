import { Shift } from '@/types/shifts';
import { MonthlyStats } from '@/types/dashboard';
import StatsGrid from './StatsGrid';
import QuickTips from './QuickTips';
import TaxBracketChart from './TaxBracketChart';
import DashboardHeader from './DashboardHeader';

interface DashboardContentProps {
  shifts: Shift[];
  monthlyStats: MonthlyStats;
  previousMonthStats: MonthlyStats;
  selectedMonth: Date;
  onMonthChange: (startDate: Date, endDate: Date, currentMonth: Date) => void;
}

export default function DashboardContent({
  shifts,
  monthlyStats,
  previousMonthStats,
  selectedMonth,
  onMonthChange,
}: DashboardContentProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-8">
      <DashboardHeader selectedMonth={selectedMonth} onMonthChange={onMonthChange} />

      {/* Stats Cards Grid */}
      <StatsGrid monthlyStats={monthlyStats} previousMonthStats={previousMonthStats} />

      {/* Quick Tips Section */}
      <QuickTips monthlyStats={monthlyStats} />

      {/* Tax Bracket Chart */}
      {shifts.length > 0 && <TaxBracketChart monthlyIncome={monthlyStats.totalEarnings} />}
    </div>
  );
}
