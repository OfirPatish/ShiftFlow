import React from "react";
import { formatCurrency } from "../../utils/calculations";
import { useShifts } from "../../context/shiftsContext";
import { useWage } from "../../context/wageContext";

export function MonthlySummary() {
  const { getMonthlyShiftSummary, shifts } = useShifts();
  const { wageConfig } = useWage();
  const monthlySummary = getMonthlyShiftSummary(new Date().getFullYear(), new Date().getMonth());

  return (
    <div className="theme-card p-6">
      <h2 className="text-xl font-semibold mb-4 theme-text-primary">Monthly Summary</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3 theme-text-primary">Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="theme-text-secondary min-w-[90px]">Base (100%):</span>
                <span className="font-mono theme-text-primary">{monthlySummary.totalHours.base}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="theme-text-secondary min-w-[90px]">Overtime:</span>
                <span className="font-mono theme-text-primary">{monthlySummary.totalHours.overtime}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold pt-1 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <span className="theme-text-primary">Total:</span>
                <span className="font-mono theme-text-primary">{monthlySummary.totalHours.total}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3 theme-text-primary">Earnings</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="theme-text-secondary">Base:</span>
                <span className="font-mono theme-text-primary tabular-nums">
                  {formatCurrency(monthlySummary.earnings.base)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="theme-text-secondary">Overtime:</span>
                <span className="font-mono theme-text-primary tabular-nums">
                  {formatCurrency(monthlySummary.earnings.overtime)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold pt-1 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <span className="theme-text-primary">Total:</span>
                <span className="font-mono theme-text-primary tabular-nums">
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
