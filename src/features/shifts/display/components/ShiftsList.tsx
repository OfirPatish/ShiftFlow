import React, { useState } from "react";
import { Shift } from "../../../../core/types/shift";
import { ShiftDetailCard } from "./ShiftDetailCard";

interface ShiftsListProps {
  shifts: Record<string, Shift[]>;
  groupByWeek: boolean;
  onEdit: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;
}

export const ShiftsList: React.FC<ShiftsListProps> = ({ shifts, groupByWeek, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const shiftsPerPage = 10;

  // Flatten shifts for pagination
  const allShifts = Object.entries(shifts).reduce<Array<{ weekLabel: string; shift: Shift }>>(
    (acc, [weekLabel, weekShifts]) => {
      const weekItems = weekShifts.map((shift) => ({ weekLabel, shift }));
      return [...acc, ...weekItems];
    },
    []
  );

  // Calculate total pages
  const totalShifts = allShifts.length;
  const totalPages = Math.ceil(totalShifts / shiftsPerPage);

  // Get current page shifts
  const indexOfLastShift = currentPage * shiftsPerPage;
  const indexOfFirstShift = indexOfLastShift - shiftsPerPage;
  const currentShifts = allShifts.slice(indexOfFirstShift, indexOfLastShift);

  // Group current page shifts by week
  const currentPageShifts = currentShifts.reduce<Record<string, Shift[]>>((acc, { weekLabel, shift }) => {
    if (!acc[weekLabel]) {
      acc[weekLabel] = [];
    }
    acc[weekLabel].push(shift);
    return acc;
  }, {});

  // Pagination controls
  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

  return (
    <div className="flex flex-col">
      <div>
        {Object.entries(currentPageShifts).map(([weekLabel, weekShifts]) => (
          <div key={weekLabel}>
            {groupByWeek && (
              <div className="px-5 py-2 bg-slate-100 dark:bg-slate-700/40 border-y border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <h3 className="font-medium text-sm text-slate-700 dark:text-slate-300">{weekLabel}</h3>
              </div>
            )}
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {weekShifts.map((shift) => (
                <ShiftDetailCard key={shift.id} shift={shift} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-5 py-3 bg-slate-50 dark:bg-slate-700/20 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === 1
                ? "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            }`}
          >
            Previous
          </button>

          <span className="text-sm text-slate-600 dark:text-slate-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === totalPages
                ? "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
