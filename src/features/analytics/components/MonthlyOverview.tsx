"use client";

import React, { useState, useEffect } from "react";
import { useShiftsStore } from "../../../core/context/shiftsSlice";
import { useSelectedMonth } from "../../../core/context/selectedMonthSlice";
import { useWageStore } from "../../../core/context/wageSlice";
import { MonthlyShiftSummary } from "../../../core/types/shift";
import { CalendarDays, Clock, DollarSign, TrendingUp } from "lucide-react";

// Default empty summary for server-side rendering
const defaultSummary: MonthlyShiftSummary = {
  totalHours: { base: 0, overtime: 0, total: 0 },
  earnings: { base: 0, overtime: 0, total: 0 },
};

export function MonthlyOverview() {
  const { selectedMonth } = useSelectedMonth();
  const { getMonthlyShiftSummary } = useShiftsStore();
  const { wageConfig } = useWageStore();
  const [summary, setSummary] = useState<MonthlyShiftSummary>(defaultSummary);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on client-side to prevent hydration mismatch
    setIsClient(true);

    const clientSummary = getMonthlyShiftSummary(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      wageConfig.baseHourlyRate
    );

    setSummary(clientSummary);
  }, [selectedMonth, wageConfig.baseHourlyRate, getMonthlyShiftSummary]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format the month name
  const monthName = selectedMonth.toLocaleString("default", { month: "long" });
  const year = selectedMonth.getFullYear();

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-md p-6 border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
            {monthName} {year} Overview
          </h2>
        </div>
        <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            {summary.totalHours.total.toFixed(1)} hours
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hours section */}
        <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700 transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">
              Hours Breakdown
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400 transition-colors duration-300">Regular Hours</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  {summary.totalHours.base.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-400 dark:bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(summary.totalHours.base / Math.max(0.1, summary.totalHours.total)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  Overtime Hours
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  {summary.totalHours.overtime.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-amber-400 dark:bg-amber-500 h-2 rounded-full"
                  style={{ width: `${(summary.totalHours.overtime / Math.max(0.1, summary.totalHours.total)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
                  Total Hours
                </span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                  {summary.totalHours.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings section */}
        <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700 transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">
              Earnings Breakdown
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  Regular Earnings
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  {formatCurrency(summary.earnings.base)}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-emerald-400 dark:bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${(summary.earnings.base / Math.max(0.1, summary.earnings.total)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  Overtime Earnings
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  {formatCurrency(summary.earnings.overtime)}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-purple-400 dark:bg-purple-500 h-2 rounded-full"
                  style={{ width: `${(summary.earnings.overtime / Math.max(0.1, summary.earnings.total)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
                  Total Earnings
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
                  {formatCurrency(summary.earnings.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rate information */}
      <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-100 dark:border-indigo-800/30">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
            Current Hourly Rate: {formatCurrency(wageConfig.baseHourlyRate)}/hr
          </span>
        </div>
      </div>
    </div>
  );
}
