import React from "react";
import { TimeEntry } from "../../types/shift";

interface EditShiftModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editDate: string;
  editStartTime: TimeEntry;
  editEndTime: TimeEntry;
  validationErrors: string[];
  onDateChange: (value: string) => void;
  onTimeChange: (type: "start" | "end", field: "hours" | "minutes", value: string) => void;
}

export function EditShiftModal({
  show,
  onClose,
  onSave,
  editDate,
  editStartTime,
  editEndTime,
  validationErrors,
  onDateChange,
  onTimeChange,
}: EditShiftModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md transition-colors duration-300">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold theme-text-primary mb-4">Edit Shift</h2>

          {validationErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded transition-colors duration-300">
              <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 transition-colors duration-300">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block font-medium theme-text-primary mb-2">
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
                value={editDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 transition-colors duration-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium theme-text-primary mb-2">
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
                </label>
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={editStartTime.hours}
                    onChange={(e) => onTimeChange("start", "hours", e.target.value)}
                    className="w-20 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-center transition-colors duration-300"
                    placeholder="HH"
                  />
                  <span className="text-xl font-medium theme-text-primary">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={editStartTime.minutes}
                    onChange={(e) => onTimeChange("start", "minutes", e.target.value)}
                    className="w-20 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-center transition-colors duration-300"
                    placeholder="MM"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium theme-text-primary mb-2">
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
                </label>
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={editEndTime.hours}
                    onChange={(e) => onTimeChange("end", "hours", e.target.value)}
                    className="w-20 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-center transition-colors duration-300"
                    placeholder="HH"
                  />
                  <span className="text-xl font-medium theme-text-primary">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={editEndTime.minutes}
                    onChange={(e) => onTimeChange("end", "minutes", e.target.value)}
                    className="w-20 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-center transition-colors duration-300"
                    placeholder="MM"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 order-1 sm:order-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
