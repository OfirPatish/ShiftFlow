import EmptyState from '@/components/common/EmptyState';

interface EmptyRatesProps {
  onAddAction?: () => void;
}

export default function EmptyRates({ onAddAction }: EmptyRatesProps) {
  return (
    <EmptyState
      title="No Rates Found"
      message="You haven't added any rates yet. Use the 'Add Rate' button above to get started."
    />
  );
}
