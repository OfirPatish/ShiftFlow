import { Shift } from '@/types/models/shifts';
import { Clock, MoreHorizontal, Calendar } from 'lucide-react';
import { getCurrencySymbol } from '@/lib/utils/currencyFormatter';

interface MobileShiftCardProps {
  shift: Shift;
  onClick: (shift: Shift) => void;
  dayDateDisplay: string;
  timeRange: string;
  earningsAmount: string;
  hasOvertime: boolean;
}

export function MobileShiftCard({
  shift,
  onClick,
  dayDateDisplay,
  timeRange,
  earningsAmount,
  hasOvertime,
}: MobileShiftCardProps) {
  return (
    <div
      className={`relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/40 rounded-xl shadow-md overflow-hidden hover:bg-gray-700/30 active:bg-gray-700/50 transition-colors cursor-pointer ${
        hasOvertime ? 'border-l-4' : ''
      }`}
      style={hasOvertime ? { borderLeftColor: '#FBBF24' } : undefined}
      onClick={() => onClick(shift)}
    >
      <div className="px-4 py-3 flex items-center">
        <div className="bg-gray-800/70 backdrop-blur-sm p-1.5 rounded-lg flex items-center justify-center mr-2.5">
          <Calendar className="h-4 w-4 text-gray-300" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="text-base font-medium text-gray-100">{dayDateDisplay}</div>
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-100 mr-1.5">
                {shift.totalHours.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-0.5">
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              <span>{timeRange}</span>
              {shift.breakDuration > 0 && (
                <span className="ml-1.5 text-xs text-gray-500">· {shift.breakDuration}m</span>
              )}
            </div>

            <div className="text-sm font-medium text-primary-400">
              {getCurrencySymbol()}
              {earningsAmount}
            </div>
          </div>
        </div>

        <button
          className="ml-2 text-gray-500 hover:text-gray-300 transition-colors p-1.5 rounded-full hover:bg-gray-700/50"
          aria-label="Edit shift"
          onClick={(e) => {
            e.stopPropagation();
            onClick(shift);
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
