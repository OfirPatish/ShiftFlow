import { MonthlyStats } from '@/types/ui/dashboard';
import StatsGrid from './StatsGrid';
import QuickTips from './QuickTips';
import TaxBracketChart from './TaxBracketChart';
import { format, isValid } from 'date-fns';
import PageLayout from '@/components/layout/templates/PageLayout';
import MonthSelector from '@/components/core/selectors/MonthSelector';

interface DashboardContentProps {
  monthlyStats: MonthlyStats;
  previousMonthStats: MonthlyStats;
  selectedMonth: Date;
  onMonthChange: (dates: { start: Date; end: Date; current: Date }) => void;
}

export default function DashboardContent({
  monthlyStats,
  previousMonthStats,
  selectedMonth,
  onMonthChange,
}: DashboardContentProps) {
  const formattedMonth = format(selectedMonth, 'MMMM yyyy');
  const safeDate = isValid(selectedMonth) ? selectedMonth : new Date();

  return (
    <PageLayout
      title="Dashboard"
      subtitle={`${formattedMonth} Overview`}
      actionElement={
        <div className="flex items-center gap-4">
          <MonthSelector currentDate={safeDate} onChange={onMonthChange} />
        </div>
      }
      maxContentWidth="4xl"
    >
      <div className="p-0">
        {/* Stats Cards Grid */}
        <div className="mb-6">
          <StatsGrid monthlyStats={monthlyStats} previousMonthStats={previousMonthStats} />
        </div>

        {/* Dashboard Analysis Sections */}
        <div className="mb-6">
          <section className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/20 rounded-lg p-5 hover:bg-gray-800/30 transition-all duration-300">
            <QuickTips monthlyStats={monthlyStats} />
          </section>
        </div>

        <div>
          <section className="bg-gradient-to-br from-gray-800/30 to-gray-800/10 backdrop-blur-sm border border-gray-700/30 rounded-lg p-5 shadow-lg">
            <TaxBracketChart monthlyIncome={monthlyStats.totalEarnings} />
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
