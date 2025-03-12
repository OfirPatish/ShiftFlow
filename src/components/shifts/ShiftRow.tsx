import { format } from 'date-fns';
import { Shift } from '@/hooks/useShifts';
import { Clock, MoreHorizontal, DollarSign } from 'lucide-react';

interface ShiftRowProps {
  shift: Shift;
  onClick: (shift: Shift) => void;
  isMobile?: boolean;
}

export default function ShiftRow({ shift, onClick, isMobile = false }: ShiftRowProps) {
  // Handle populated or non-populated employer and rate objects
  const employer =
    typeof shift.employerId === 'object' && shift.employerId
      ? shift.employerId
      : { name: 'Unknown', color: '#718096' };
  const rate = typeof shift.rateId === 'object' ? shift.rateId : null;

  // Format dates
  const startDate = new Date(shift.startTime);
  const endDate = new Date(shift.endTime);

  // Format day and date for display (e.g. "Mon, Mar 10")
  const dayDateDisplay = format(startDate, 'EEE, MMM d');

  // Format time range
  const timeRange = `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: rate?.currency || 'ILS',
    }).format(amount);
  };

  // Check if shift has overtime hours
  const hasOvertime = shift.overtimeHours1 > 0 || shift.overtimeHours2 > 0;

  return (
    <div className="group/row hover:bg-gray-800/40 transition-all">
      <div className="grid grid-cols-12 items-center px-4 py-3">
        {/* Date column (with time on mobile) */}
        <div className="col-span-5 sm:col-span-2 flex flex-col">
          <div className="text-sm font-medium text-gray-100">{dayDateDisplay}</div>
          {isMobile && (
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <span>{timeRange}</span>
            </div>
          )}
        </div>

        {/* Time column - hidden on mobile */}
        {!isMobile && (
          <div className="col-span-2 flex items-center">
            <div className="text-xs text-gray-500 flex items-center">
              <span>{timeRange}</span>
            </div>
            {/* Show break duration as a tooltip or small text */}
            {shift.breakDuration > 0 && (
              <span className="ml-2 text-xs text-gray-500 whitespace-nowrap">
                ({shift.breakDuration}m break)
              </span>
            )}
          </div>
        )}

        {/* Status badge - hidden on mobile */}
        {!isMobile && (
          <div className="col-span-2 flex items-center">
            {hasOvertime ? (
              <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-yellow-900/30 text-yellow-400 border border-yellow-800/30">
                Overtime
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-emerald-900/30 text-emerald-400 border border-emerald-800/30">
                Regular
              </span>
            )}
          </div>
        )}

        {/* Hours */}
        <div className="col-span-3 sm:col-span-2 flex items-center">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-200 group-hover/row:text-primary-300 transition-colors">
              {isMobile ? shift.totalHours.toFixed(1) : `${shift.totalHours.toFixed(1)} hrs`}
            </span>
          </div>
        </div>

        {/* Earnings */}
        <div className="col-span-3 sm:col-span-3 flex items-center">
          <div className="flex items-center">
            <span className="text-sm font-medium text-primary-400 group-hover/row:text-primary-300 transition-colors">
              {formatCurrency(shift.totalEarnings)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-1 flex items-center">
          <button
            onClick={() => onClick(shift)}
            className="text-gray-500 hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-700/30"
            aria-label="Edit shift"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
