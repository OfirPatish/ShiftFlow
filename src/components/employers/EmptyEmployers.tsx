import EmptyState from '@/components/core/feedback/EmptyState';

interface EmptyEmployersProps {
  onAddAction?: () => void;
}

export default function EmptyEmployers({ onAddAction }: EmptyEmployersProps) {
  return (
    <EmptyState
      title="No Employers Found"
      message="You haven't added any employers yet. Use the 'Add Employer' button above to get started."
    />
  );
}
