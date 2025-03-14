import { format } from 'date-fns';
import MonthSelector from '@/components/common/MonthSelector';

interface DashboardHeaderProps {
  selectedMonth: Date;
  onMonthChange: (startDate: Date, endDate: Date, currentMonth: Date) => void;
  showTitle?: boolean;
  emptyState?: boolean;
}

export default function DashboardHeader({
  selectedMonth,
  onMonthChange,
  showTitle = true,
  emptyState = false,
}: DashboardHeaderProps) {
  // Format the current month for display
  const currentMonth = format(selectedMonth, 'MMMM yyyy');

  return (
    <div className={`${!emptyState ? 'relative' : ''} mb-8`}>
      {!emptyState && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg blur-xl opacity-50 -z-10"></div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 mb-1">Dashboard</h1>
          <p className="text-gray-400">
            {emptyState ? 'Your shift tracking overview' : `${currentMonth} Overview`}
          </p>
        </div>
        <MonthSelector
          currentDate={selectedMonth}
          onChange={onMonthChange}
          className="mt-4 md:mt-0"
        />
      </div>

      {!emptyState && (
        <div className="h-1 w-24 bg-gradient-to-r from-primary to-blue-500 rounded-full mb-4"></div>
      )}
    </div>
  );
}
