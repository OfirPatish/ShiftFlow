import { Shift } from '@/hooks/useShifts';
import { MobileShiftCard } from './MobileShiftCard';
import { DesktopShiftCard } from './DesktopShiftCard';
import { formatCurrency, formatWithLeftSymbol } from '@/lib/currencyFormatter';
import { formatDayDate, formatFullDate, formatTimeRange } from '@/lib/dateFormatter';

interface ShiftCardProps {
  shift: Shift;
  onClick: (shift: Shift) => void;
  isMobile: boolean;
}

export function ShiftCard({ shift, onClick, isMobile }: ShiftCardProps) {
  // Format dates
  const startDate = new Date(shift.startTime);
  const endDate = new Date(shift.endTime);

  // Format day and date for display
  const dayDateDisplay = formatDayDate(startDate);

  // Format time range
  const timeRange = formatTimeRange(startDate, endDate);

  // Format hourly rate if available
  const rate = typeof shift.rateId === 'object' ? shift.rateId : null;
  const hourlyRateDisplay = rate ? formatWithLeftSymbol(rate.baseRate) : 'N/A';

  // Format earnings for display - without currency symbol
  const earningsAmount = formatCurrency(shift.totalEarnings);

  // Check if shift has overtime hours
  const hasOvertime = shift.overtimeHours1 > 0 || shift.overtimeHours2 > 0;

  const cardProps = {
    shift,
    onClick,
    dayDateDisplay,
    fullDateDisplay: dayDateDisplay, // Use same format for both views
    timeRange,
    hourlyRateDisplay,
    earningsAmount,
    hasOvertime,
  };

  return isMobile ? <MobileShiftCard {...cardProps} /> : <DesktopShiftCard {...cardProps} />;
}
