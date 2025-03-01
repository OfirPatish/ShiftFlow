import React from "react";
import { MonthPicker } from "../../../common/components";

interface ShiftCollectionHeaderProps {
  shiftCount: number;
  groupByWeek: boolean;
  toggleGrouping: () => void;
}

export const ShiftCollectionHeader: React.FC<ShiftCollectionHeaderProps> = ({
  shiftCount,
  groupByWeek,
  toggleGrouping,
}) => {
  return (
    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          This Month&apos;s Shifts ({shiftCount})
        </h2>
        <div className="flex items-center">
          <button
            onClick={toggleGrouping}
            className="text-sm mr-4 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
          >
            <span className="mr-1">{groupByWeek ? "Disable" : "Enable"} Week Groups</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Month picker below the header */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <MonthPicker />
      </div>
    </div>
  );
};
