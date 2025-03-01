"use client";

import React from "react";
import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";
import { useSelectedMonth } from "../../../core/context/selectedMonthSlice";

interface MonthPickerProps {
  className?: string;
  compact?: boolean;
}

export function MonthPicker({ className = "", compact = false }: MonthPickerProps) {
  const { selectedMonth, goToNextMonth, goToPreviousMonth, isCurrentMonth, resetToCurrentMonth } = useSelectedMonth();

  // Format the month name
  const monthYear = selectedMonth.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={goToPreviousMonth}
        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      </button>

      <div className="flex items-center">
        {!compact && <CalendarCheck className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />}
        <span className="font-medium text-slate-800 dark:text-slate-200">{monthYear}</span>
        {!isCurrentMonth && (
          <button
            onClick={resetToCurrentMonth}
            className="ml-2 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md text-slate-700 dark:text-slate-300 transition-colors"
            aria-label="Reset to current month"
          >
            Today
          </button>
        )}
      </div>

      <button
        onClick={goToNextMonth}
        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="Next month"
      >
        <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      </button>
    </div>
  );
}
