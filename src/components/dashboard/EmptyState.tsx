import WelcomeTutorial from './WelcomeTutorial';
import DashboardHeader from './DashboardHeader';

interface EmptyStateProps {
  selectedMonth: Date;
  onMonthChange: (startDate: Date, endDate: Date, currentMonth: Date) => void;
}

export default function EmptyState({ selectedMonth, onMonthChange }: EmptyStateProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-8">
      <DashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        emptyState={true}
      />

      <WelcomeTutorial />
    </div>
  );
}
