"use client";

import React from "react";
import { formatCurrency } from "../utils/earningsCalculations";

interface EarningsBreakdownProps {
  title: string;
  regularHours: number;
  overtime125Hours: number;
  overtime150Hours: number;
  regularEarnings: number;
  overtime125Earnings: number;
  overtime150Earnings: number;
  totalEarnings: number;
}

export function EarningsBreakdown({
  title,
  regularHours,
  overtime125Hours,
  overtime150Hours,
  regularEarnings,
  overtime125Earnings,
  overtime150Earnings,
  totalEarnings,
}: EarningsBreakdownProps) {
  const totalHours = regularHours + overtime125Hours + overtime150Hours;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">
          {title}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hours breakdown */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
              Hours Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Regular (100%)</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {regularHours.toFixed(2)}h
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Overtime (125%)</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {overtime125Hours.toFixed(2)}h
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Overtime (150%)</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {overtime150Hours.toFixed(2)}h
                </span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2 transition-colors duration-300">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Total Hours</span>
                  <span className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {totalHours.toFixed(2)}h
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings breakdown */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
              Earnings Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Regular (100%)</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {formatCurrency(regularEarnings)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Overtime (125%)</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {formatCurrency(overtime125Earnings)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Overtime (150%)</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {formatCurrency(overtime150Earnings)}
                </span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2 transition-colors duration-300">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Total Earnings
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 transition-colors duration-300">
                    {formatCurrency(totalEarnings)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
