import React from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  isValid,
  isSameMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarClock } from 'lucide-react';
import { logError } from '@/lib/validation/errorHandlers';

interface MonthSelectorProps {
  currentDate: Date;
  onChange: (dates: { start: Date; end: Date; current: Date }) => void;
  className?: string;
}

export default function MonthSelector({
  currentDate,
  onChange,
  className = '',
}: MonthSelectorProps) {
  // Ensure we have a valid date
  const safeDate = isValid(currentDate) ? currentDate : new Date();
  const isCurrentMonth = isSameMonth(safeDate, new Date());

  const handlePreviousMonth = () => {
    try {
      const previousMonth = subMonths(safeDate, 1);
      const start = startOfMonth(previousMonth);
      const end = endOfMonth(previousMonth);
      onChange({ start, end, current: previousMonth });
    } catch (error) {
      logError('MonthSelector.handlePreviousMonth', error);
    }
  };

  const handleNextMonth = () => {
    try {
      const nextMonth = addMonths(safeDate, 1);
      const start = startOfMonth(nextMonth);
      const end = endOfMonth(nextMonth);
      onChange({ start, end, current: nextMonth });
    } catch (error) {
      logError('MonthSelector.handleNextMonth', error);
    }
  };

  const handleCurrentMonth = () => {
    try {
      const now = new Date();
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      onChange({ start, end, current: now });
    } catch (error) {
      logError('MonthSelector.handleCurrentMonth', error);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center space-x-1.5">
        <button
          onClick={handlePreviousMonth}
          className="p-1.5 rounded-md hover:bg-gray-800/50 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>
        <button
          onClick={handleCurrentMonth}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors min-w-[120px] sm:min-w-[140px] ${
            isCurrentMonth
              ? 'text-primary-400 bg-primary-400/10'
              : 'text-gray-300 hover:bg-gray-800/50'
          }`}
        >
          {format(safeDate, 'MMMM yyyy')}
        </button>
        <button
          onClick={handleNextMonth}
          className="p-1.5 rounded-md hover:bg-gray-800/50 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      {!isCurrentMonth && (
        <button
          onClick={handleCurrentMonth}
          className="mt-1.5 flex items-center justify-center text-xs text-primary-400 hover:text-primary-300 transition-colors py-0.5 px-2 rounded-md hover:bg-primary-400/5"
        >
          <CalendarClock className="w-3 h-3 mr-1" />
          Current month
        </button>
      )}
    </div>
  );
}
