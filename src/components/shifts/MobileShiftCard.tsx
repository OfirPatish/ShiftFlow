import { Shift } from '@/hooks/useShifts';
import { Clock, MoreHorizontal } from 'lucide-react';
import { getCurrencySymbol } from '@/lib/currencyFormatter';

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
      className="relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/40 rounded-xl shadow-md overflow-hidden hover:bg-gray-700/30 active:bg-gray-700/50 transition-colors touch-manipulation"
      onClick={() => onClick(shift)}
    >
      <div className="px-4 pt-3 pb-2 flex justify-between items-start">
        <div>
          <div className="text-base font-medium text-gray-100 mb-0.5">{dayDateDisplay}</div>
          <div className="flex items-center text-xs text-gray-400 mb-1">
            <Clock className="h-3 w-3 mr-1" />
            <span>{timeRange}</span>

            {shift.breakDuration > 0 && (
              <span className="ml-2 text-xs text-gray-500">({shift.breakDuration}m break)</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className="text-base font-medium text-gray-100">
              {shift.totalHours.toFixed(1)}
            </span>
            {hasOvertime && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-sm bg-yellow-900/30 text-yellow-400 border border-yellow-800/30">
                OT
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-primary-400">
              {getCurrencySymbol()}
              {earningsAmount}
            </span>
          </div>
        </div>
      </div>

      <button
        className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-700/50"
        aria-label="Edit shift"
        onClick={(e) => {
          e.stopPropagation();
          onClick(shift);
        }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}
