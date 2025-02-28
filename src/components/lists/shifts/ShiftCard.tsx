import React from "react";
import { Shift } from "../../../types/shift";
import {
  formatTime,
  formatCurrency,
  calculateShiftHours,
  calculateTimeDifference,
  formatDate,
} from "../../../utils/calculations";
import { useWage } from "../../../context/wageContext";

interface ShiftCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;
}

export function ShiftCard({ shift, onEdit, onDelete }: ShiftCardProps) {
  const { wageConfig } = useWage();
  const earnings = calculateShiftHours(shift.startTime, shift.endTime, wageConfig).earnings;

  return (
    <div className="mx-3 mb-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 group relative overflow-hidden theme-transition">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-0 sm:justify-between mb-6">
          <div className="flex items-start sm:items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400 mt-1 sm:mt-0 theme-transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 theme-transition">
                {formatDate(shift.date)}
              </h3>
              <div className="mt-1">
                <span className="font-medium text-gray-800 dark:text-gray-200 theme-transition">
                  {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                </span>
                <span className="block sm:inline sm:ml-2 text-gray-500 dark:text-gray-400 theme-transition">
                  (Total: {calculateTimeDifference(shift.startTime, shift.endTime)})
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 absolute sm:static top-4 right-4">
            <button
              onClick={() => onEdit(shift)}
              className="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 theme-transition"
              aria-label="Edit shift"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(shift)}
              className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 theme-transition"
              aria-label="Delete shift"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 theme-transition">Hours</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 theme-transition">Base (100%):</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 theme-transition">
                  {shift.calculatedHours.base}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 theme-transition">Overtime (125%):</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 theme-transition">
                  {shift.calculatedHours.overtime125}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 theme-transition">Overtime (150%):</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 theme-transition">
                  {shift.calculatedHours.overtime150}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100 dark:border-gray-800 theme-transition">
                <span className="font-medium text-gray-700 dark:text-gray-300 theme-transition">Total:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 theme-transition">
                  {shift.calculatedHours.total}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 theme-transition">Earnings</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 theme-transition">Base:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 tabular-nums theme-transition">
                  {formatCurrency(earnings.base)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 theme-transition">125%:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 tabular-nums theme-transition">
                  {formatCurrency(earnings.overtime125)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 theme-transition">150%:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 tabular-nums theme-transition">
                  {formatCurrency(earnings.overtime150)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100 dark:border-gray-800 theme-transition">
                <span className="font-medium text-gray-700 dark:text-gray-300 theme-transition">Total:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 tabular-nums theme-transition">
                  {formatCurrency(earnings.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
