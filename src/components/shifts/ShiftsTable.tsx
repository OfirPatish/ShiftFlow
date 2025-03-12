import { Shift } from '@/hooks/useShifts';
import ShiftRow from './ShiftRow';
import { useEffect, useState } from 'react';

interface ShiftsTableProps {
  shifts: Shift[];
  onShiftClick: (shift: Shift) => void;
}

export default function ShiftsTable({ shifts, onShiftClick }: ShiftsTableProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
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

  return (
    <div className="card overflow-hidden bg-gray-800/40 backdrop-blur-sm border border-gray-700/40 shadow-xl">
      {/* Table header */}
      <div className="sticky top-0 z-10 bg-gray-800/60 backdrop-blur-md px-4 py-3 text-xs font-medium text-gray-400 grid grid-cols-12 border-b border-gray-700/30">
        <div className="col-span-5 sm:col-span-2">DATE</div>
        <div className={`${isMobile ? 'hidden' : 'col-span-2'}`}>TIME</div>
        <div className={`${isMobile ? 'hidden' : 'col-span-2'}`}>STATUS</div>
        <div className="col-span-3 sm:col-span-2">HOURS</div>
        <div className="col-span-3 sm:col-span-3">EARNINGS</div>
        <div className="col-span-1">ACTIONS</div>
      </div>

      <div className="divide-y divide-gray-700/20">
        {shifts.map((shift) => (
          <ShiftRow key={shift._id} shift={shift} onClick={onShiftClick} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}
