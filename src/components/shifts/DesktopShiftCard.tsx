import { Shift } from '@/hooks/useShifts';
import { Clock, MoreHorizontal, Calendar } from 'lucide-react';
import { getCurrencySymbol } from '@/lib/currencyFormatter';

interface DesktopShiftCardProps {
  shift: Shift;
  onClick: (shift: Shift) => void;
  fullDateDisplay: string;
  timeRange: string;
  hourlyRateDisplay: string;
  earningsAmount: string;
  hasOvertime: boolean;
}

export function DesktopShiftCard({
  shift,
  onClick,
  fullDateDisplay,
  timeRange,
  hourlyRateDisplay,
  earningsAmount,
  hasOvertime,
}: DesktopShiftCardProps) {
  return (
    <div
      className={`relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/40 rounded-xl shadow-md overflow-hidden hover:bg-gray-700/30 active:bg-gray-700/50 transition-colors ${
        hasOvertime ? 'border-l-4' : ''
      }`}
      style={hasOvertime ? { borderLeftColor: '#FBBF24' } : undefined}
    >
      <div
        className="grid grid-cols-12 gap-2 items-center px-6 py-4 cursor-pointer"
        onClick={() => onClick(shift)}
      >
        {/* Date & Time Section - Left */}
        <div className="col-span-5 flex items-center space-x-3">
          <div className="bg-gray-800/70 backdrop-blur-sm p-2 rounded-lg flex items-center justify-center w-10 h-10">
            <Calendar className="h-5 w-5 text-gray-300" />
          </div>
          <div>
            <div className="text-base font-medium text-gray-100">{fullDateDisplay}</div>
            <div className="flex items-center text-sm text-gray-400 mt-0.5">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{timeRange}</span>
              {shift.breakDuration > 0 && (
                <span className="ml-2 text-xs text-gray-500">· {shift.breakDuration}m break</span>
              )}
            </div>
          </div>
        </div>

        {/* Hours Section - Middle */}
        <div className="col-span-3 flex items-center">
          <div className="text-xl font-medium text-gray-100">
            {shift.totalHours.toFixed(1)}
            <span className="text-sm text-gray-400 ml-1">hrs</span>
          </div>
        </div>

        {/* Earnings Section - Right */}
        <div className="col-span-3">
          <span className="text-xl font-medium text-primary-400">
            {getCurrencySymbol()}
            {earningsAmount}
          </span>
        </div>

        {/* Actions - Far Right */}
        <div className="col-span-1 flex justify-end">
          <button
            className="text-gray-500 hover:text-gray-300 transition-colors p-1.5 rounded-full hover:bg-gray-700/50"
            aria-label="Edit shift"
            onClick={(e) => {
              e.stopPropagation();
              onClick(shift);
            }}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
