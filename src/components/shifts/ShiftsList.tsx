import { Shift } from '@/types/models/shifts';
import { useEffect, useState } from 'react';
import { ShiftCard } from './ShiftCard';

interface ShiftsListProps {
  shifts: Shift[];
  onShiftClick: (shift: Shift) => void;
}

export default function ShiftsList({ shifts, onShiftClick }: ShiftsListProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile for responsive adjustments
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // If no shifts, show empty state
  if (shifts.length === 0) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/40 rounded-xl shadow-md py-8 px-4 text-center">
        <div className="text-gray-400">No shifts found for the selected period</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-2">
      {shifts.map((shift) => (
        <ShiftCard key={shift._id} shift={shift} onClick={onShiftClick} isMobile={isMobile} />
      ))}
    </div>
  );
}
