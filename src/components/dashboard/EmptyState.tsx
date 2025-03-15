import WelcomeTutorial from './WelcomeTutorial';
import PageLayout from '@/components/layout/templates/PageLayout';
import MonthSelector from '@/components/core/selectors/MonthSelector';
import { isValid } from 'date-fns';

interface EmptyStateProps {
  selectedMonth: Date;
  onMonthChange: (dates: { start: Date; end: Date; current: Date }) => void;
}

export default function EmptyState({ selectedMonth, onMonthChange }: EmptyStateProps) {
  const safeDate = isValid(selectedMonth) ? selectedMonth : new Date();

  return (
    <PageLayout
      title="Dashboard"
      subtitle="Your shift tracking overview"
      actionElement={null}
      bottomAction={<MonthSelector currentDate={safeDate} onChange={onMonthChange} />}
    >
      <WelcomeTutorial />
    </PageLayout>
  );
}
