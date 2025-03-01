import React from "react";
import { useSelectedMonth } from "../../../../core/context/selectedMonthSlice";
import { MonthPicker } from "../../../common/components";
import Link from "next/link";

export function NoShiftsDisplay() {
  const { selectedMonth, isCurrentMonth } = useSelectedMonth();

  // Format month name for display
  const monthName = selectedMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm h-full">
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
            {monthName} Shifts
          </h2>
        </div>

        {/* Add month picker below the header */}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <MonthPicker />
        </div>
      </div>
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500 dark:text-indigo-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="mb-3 text-slate-700 dark:text-slate-300 text-lg">
          {isCurrentMonth ? "No shifts recorded yet for this month" : `No shifts recorded for ${monthName}`}
        </p>
        <p className="text-sm mb-8 text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {isCurrentMonth
            ? "Go to the Shifts page to add your first shift"
            : "Use the month selector above to navigate to a different month"}
        </p>

        {isCurrentMonth && (
          <Link
            href="/shifts"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Shift
          </Link>
        )}
      </div>
    </div>
  );
}
