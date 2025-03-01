"use client";

import React from "react";
import { useWageStore } from "../../../core/context/wageSlice";

export function WageSettings() {
  const { wageConfig, updateWageConfig } = useWageStore();

  const handleWageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateWageConfig({ baseHourlyRate: value });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white transition-colors duration-300 flex items-center">
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Wage Settings
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
            Base Hourly Rate
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300">₪</span>
            </div>
            <input
              type="number"
              value={wageConfig.baseHourlyRate}
              onChange={handleWageChange}
              className="block w-full pl-8 pr-4 py-2.5 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              min="0"
              step="0.1"
              placeholder="Enter hourly rate"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 transition-colors duration-300">
            Overtime Rates
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center text-slate-600 dark:text-slate-400 transition-colors duration-300">
              <div className="w-3 h-3 bg-indigo-200 dark:bg-indigo-300 rounded-full mr-2.5 transition-colors duration-300"></div>
              <span>Regular hours (up to 8h): 100%</span>
            </div>
            <div className="flex items-center text-slate-600 dark:text-slate-400 transition-colors duration-300">
              <div className="w-3 h-3 bg-indigo-300 dark:bg-indigo-400 rounded-full mr-2.5 transition-colors duration-300"></div>
              <span>Overtime (8-10h): 125%</span>
            </div>
            <div className="flex items-center text-slate-600 dark:text-slate-400 transition-colors duration-300">
              <div className="w-3 h-3 bg-indigo-400 dark:bg-indigo-500 rounded-full mr-2.5 transition-colors duration-300"></div>
              <span>Overtime (10h+): 150%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
