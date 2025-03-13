import React from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSelectorProps {
  currentDate: Date;
  onChange: (startDate: Date, endDate: Date, currentMonth: Date) => void;
  className?: string;
}

export default function MonthSelector({
  currentDate,
  onChange,
  className = '',
}: MonthSelectorProps) {
  const handlePreviousMonth = () => {
    const previousMonth = subMonths(currentDate, 1);
    const start = startOfMonth(previousMonth);
    const end = endOfMonth(previousMonth);
    onChange(start, end, previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    const start = startOfMonth(nextMonth);
    const end = endOfMonth(nextMonth);
    onChange(start, end, nextMonth);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    // Only change if we're not already on the current month
    if (!isSameMonth(currentDate, now)) {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      onChange(start, end, now);
    }
  };

  // Format the current month/year for display
  const formattedMonth = format(currentDate, 'MMMM yyyy');

  // Check if current selection is the current month
  const isCurrentMonth = isSameMonth(currentDate, new Date());

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={handlePreviousMonth}
        className="h-10 w-10 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-200 transition-colors touch-manipulation active:bg-gray-600"
        aria-label="Previous month"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center mx-3 sm:mx-2 min-w-[140px]">
        <span className="text-gray-100 font-medium text-base sm:text-base">{formattedMonth}</span>
        {!isCurrentMonth && (
          <button
            onClick={handleCurrentMonth}
            className="text-xs text-primary-400 hover:text-primary-300 py-1 touch-manipulation active:text-primary-500"
          >
            Back to current month
          </button>
        )}
      </div>

      <button
        onClick={handleNextMonth}
        className="h-10 w-10 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-200 transition-colors touch-manipulation active:bg-gray-600"
        aria-label="Next month"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
