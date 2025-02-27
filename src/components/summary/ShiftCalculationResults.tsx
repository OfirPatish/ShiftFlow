import React from "react";
import { ShiftCalculation } from "../../types/shift";
import { formatCurrency } from "../../utils/calculations";

interface ShiftCalculationResultsProps {
  calculation: ShiftCalculation;
}

export function ShiftCalculationResults({ calculation }: ShiftCalculationResultsProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-100 dark:border-gray-600">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Calculation Results</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Base Hours (100%):</span>
          <span className="font-mono text-gray-900 dark:text-gray-100">{calculation.baseHours}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Overtime 125% (hours 8-10):</span>
          <span className="font-mono text-gray-900 dark:text-gray-100">{calculation.overtime125Hours}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Overtime 150% (hours 10+):</span>
          <span className="font-mono text-gray-900 dark:text-gray-100">{calculation.overtime150Hours}</span>
        </div>
        <div className="flex items-center justify-between font-semibold">
          <span className="text-gray-900 dark:text-gray-100">Total Hours:</span>
          <span className="font-mono text-gray-900 dark:text-gray-100">{calculation.totalHours}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Base Pay:</span>
            <span className="font-mono text-gray-900 dark:text-gray-100 tabular-nums">
              {formatCurrency(calculation.earnings.base)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">OT Pay (125%):</span>
            <span className="font-mono text-gray-900 dark:text-gray-100 tabular-nums">
              {formatCurrency(calculation.earnings.overtime125)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">OT Pay (150%):</span>
            <span className="font-mono text-gray-900 dark:text-gray-100 tabular-nums">
              {formatCurrency(calculation.earnings.overtime150)}
            </span>
          </div>
          <div className="flex items-center justify-between font-semibold pt-1 border-t border-gray-200 dark:border-gray-600">
            <span className="text-gray-900 dark:text-gray-100">Total Earnings:</span>
            <span className="font-mono text-gray-900 dark:text-gray-100 tabular-nums">
              {formatCurrency(calculation.earnings.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
