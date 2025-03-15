import { startOfMonth, endOfMonth } from 'date-fns';

interface ErrorStateProps {
  selectedMonth: Date;
  onRetry: (dates: { start: Date; end: Date }) => void;
}

export default function ErrorState({ selectedMonth, onRetry }: ErrorStateProps) {
  const handleRetry = () => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    onRetry({ start, end });
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-8 text-center">
      <p className="text-gray-300 mb-4">Unable to load your dashboard data</p>
      <button
        onClick={handleRetry}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
