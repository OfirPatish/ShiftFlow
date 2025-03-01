"use client";

import React from "react";
import { Shift } from "../../../core/types/shift";

interface ShiftAnalyticsProps {
  shift: Shift;
}

export function ShiftAnalytics({ shift }: ShiftAnalyticsProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 transition-colors duration-300">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 transition-colors duration-300">
        Shift Analytics
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">Total Hours</span>
          <span className="font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
            {shift.calculatedHours.total.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">Base Hours</span>
          <span className="font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
            {shift.calculatedHours.base.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Overtime Hours
          </span>
          <span className="font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
            {shift.calculatedHours.overtime.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 my-2 transition-colors duration-300"></div>

        <div className="flex justify-between items-center font-semibold">
          <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300">
            Total Earnings
          </span>
          <span className="text-slate-800 dark:text-slate-100 transition-colors duration-300">
            ${shift.totalEarnings.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
