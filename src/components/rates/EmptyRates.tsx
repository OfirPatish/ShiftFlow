import EmptyState from '@/components/core/feedback/EmptyState';

export default function EmptyRates() {
  return (
    <EmptyState
      title="No Rates Found"
      message="You haven't added any rates yet. Use the 'Add Rate' button above to get started."
    />
  );
}
