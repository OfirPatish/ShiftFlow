import React, { useState } from "react";
import { Shift } from "../../../../core/types/shift";
import {
  formatTime,
  formatCurrency,
  calculateShiftHours,
  calculateTimeDifference,
  formatDate,
} from "../../management/utils/shiftUtils";
import { useWageStore } from "../../../../core/context/wageSlice";

interface ShiftDetailCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;
}

export function ShiftDetailCard({ shift, onEdit, onDelete }: ShiftDetailCardProps) {
  const wageConfig = useWageStore((state) => state.wageConfig);
  const earnings = calculateShiftHours(shift.startTime, shift.endTime, wageConfig).earnings;
  const [expanded, setExpanded] = useState(false);

  // Determine if we have overtime to display
  const hasOvertime = shift.calculatedHours.overtime > 0;
  const hasOvertime125 = shift.calculatedHours.overtime125 > 0;
  const hasOvertime150 = shift.calculatedHours.overtime150 > 0;

  return (
    <div className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex items-start cursor-pointer pr-2 flex-grow" onClick={() => setExpanded(!expanded)}>
          <svg
            className={`w-5 h-5 mr-2 mt-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0 transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <div className="flex-grow">
            <div className="flex flex-wrap justify-between items-baseline">
              <h3 className="text-base font-semibold text-slate-800 dark:text-white mr-3">{formatDate(shift.date)}</h3>
              <span className="text-sm font-mono font-medium text-indigo-600 dark:text-indigo-400">
                {formatCurrency(shift.totalEarnings)}
              </span>
            </div>
            <div className="mt-1 text-slate-600 dark:text-slate-300 text-sm flex items-center flex-wrap">
              <span className="font-medium">
                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
              </span>
              <span className="ml-2 text-xs">({calculateTimeDifference(shift.startTime, shift.endTime)})</span>

              {/* Show a visual indicator for overtime in collapsed state */}
              {(hasOvertime125 || hasOvertime150) && (
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                  OT
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1 ml-2 flex-shrink-0">
          <button
            onClick={() => onEdit(shift)}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            aria-label="Edit shift"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Delete shift"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="bg-slate-50 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-700 rounded-lg p-2">
            <h4 className="text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">Hours</h4>
            <div className="space-y-0.5 text-xs">
              <div className="grid grid-cols-[minmax(60px,_1fr)_auto] items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400">Base:</span>
                <span className="font-mono text-slate-800 dark:text-white tabular-nums text-right">
                  {shift.calculatedHours.base}
                </span>
              </div>
              {hasOvertime && (
                <div className="grid grid-cols-[minmax(60px,_1fr)_auto] items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400">Overtime:</span>
                  <span className="font-mono text-slate-800 dark:text-white tabular-nums text-right">
                    {shift.calculatedHours.overtime}
                  </span>
                </div>
              )}
              {hasOvertime125 && (
                <div className="grid grid-cols-[minmax(60px,_1fr)_auto] items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400">Overtime 125%:</span>
                  <span className="font-mono text-slate-800 dark:text-white tabular-nums text-right">
                    {shift.calculatedHours.overtime125}
                  </span>
                </div>
              )}
              {hasOvertime150 && (
                <div className="grid grid-cols-[minmax(60px,_1fr)_auto] items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400">Overtime 150%:</span>
                  <span className="font-mono text-slate-800 dark:text-white tabular-nums text-right">
                    {shift.calculatedHours.overtime150}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-[minmax(60px,_1fr)_auto] items-center gap-2 font-medium border-t border-slate-200 dark:border-slate-600 pt-1 mt-1">
                <span className="text-slate-700 dark:text-slate-300">Total:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 tabular-nums text-right">
                  {shift.calculatedHours.total}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-700 rounded-lg p-2">
            <h4 className="text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">Earnings</h4>
            <div className="space-y-0.5 text-xs">
              <div className="grid grid-cols-[minmax(60px,_1fr)_auto] items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400">Base:</span>
                <span className="font-mono text-slate-800 dark:text-white tabular-nums text-right">
                  {formatCurrency(earnings.base)}
                </span>
              </div>
              {hasOvertime125 && (
                <div className="grid grid-cols-[minmax(60px,_1fr)_auto] items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400">125%:</span>
                  <span className="font-mono text-slate-800 dark:text-white tabular-nums text-right">
                    {formatCurrency(earnings.overtime125)}
                  </span>
                </div>
              )}
              {hasOvertime150 && (
                <div className="grid grid-cols-[minmax(60px,_1fr)_auto] items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400">150%:</span>
                  <span className="font-mono text-slate-800 dark:text-white tabular-nums text-right">
                    {formatCurrency(earnings.overtime150)}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-[minmax(60px,_1fr)_auto] items-center gap-2 font-medium border-t border-slate-200 dark:border-slate-600 pt-1 mt-1">
                <span className="text-slate-700 dark:text-slate-300">Total:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 tabular-nums text-right">
                  {formatCurrency(shift.totalEarnings)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
