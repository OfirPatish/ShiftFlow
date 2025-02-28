import React from "react";
import { TimeEntry } from "../../types/shift";
import { TimeInput } from "../common/TimeInput";

interface NewShiftFormProps {
  date: string;
  startTime: TimeEntry;
  endTime: TimeEntry;
  validationErrors: string[];
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeChange: (type: "start" | "end", field: "hours" | "minutes", value: string) => void;
  onCalculate: () => void;
}

export function NewShiftForm({
  date,
  startTime,
  endTime,
  validationErrors,
  onDateChange,
  onTimeChange,
  onCalculate,
}: NewShiftFormProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold theme-text-primary">Add New Shift</h2>
        <p className="text-sm theme-text-secondary mt-1">Enter the details of your work shift below</p>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded transition-colors duration-300">
          <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 transition-colors duration-300">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block font-medium mb-2 theme-text-primary">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Date
            </span>
          </label>
          <input
            type="date"
            value={date}
            onChange={onDateChange}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
          />
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 transition-colors duration-300">
          <div className="grid grid-cols-2 gap-6">
            <TimeInput
              label={
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Start Time
                </span>
              }
              value={startTime}
              onChange={(field, value) => onTimeChange("start", field, value)}
            />
            <TimeInput
              label={
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  End Time
                </span>
              }
              value={endTime}
              onChange={(field, value) => onTimeChange("end", field, value)}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-3 transition-colors duration-300">
          <button
            onClick={onCalculate}
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Calculate Shift
          </button>
        </div>
      </div>
    </div>
  );
}
