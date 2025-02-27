import React from "react";
import { formatCurrency } from "../../utils/calculations";
import { useShifts } from "../../context/shiftsContext";
import { useWage } from "../../context/wageContext";

export function MonthlySummary() {
  const { getMonthlyShiftSummary, shifts } = useShifts();
  const { wageConfig } = useWage();
  const monthlySummary = getMonthlyShiftSummary(new Date().getFullYear(), new Date().getMonth());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Monthly Summary</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 min-w-[90px]">Base (100%):</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">{monthlySummary.totalHours.base}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 min-w-[90px]">Overtime:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">{monthlySummary.totalHours.overtime}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold pt-1 border-t border-gray-100 dark:border-gray-700">
                <span className="text-gray-800 dark:text-gray-200">Total:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">{monthlySummary.totalHours.total}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">Earnings</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Base:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200 tabular-nums">
                  {formatCurrency(monthlySummary.earnings.base)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Overtime:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200 tabular-nums">
                  {formatCurrency(monthlySummary.earnings.overtime)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold pt-1 border-t border-gray-100 dark:border-gray-700">
                <span className="text-gray-800 dark:text-gray-200">Total:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200 tabular-nums">
                  {formatCurrency(monthlySummary.earnings.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
