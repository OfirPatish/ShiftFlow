import React from "react";
import { TimeEntry, Shift } from "../../../../../core/types/shift";
import { TimeInput } from "../../../../ui/components/inputs";

interface EditShiftModalProps {
  shift: Shift;
  date: string;
  setDate: (date: string) => void;
  startTime: TimeEntry;
  endTime: TimeEntry;
  onTimeChange: (type: "start" | "end", field: "hours" | "minutes", value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  validationErrors: string[];
  errors?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    general?: string;
  };
}

export function EditShiftModal({
  shift,
  date,
  setDate,
  startTime,
  endTime,
  onTimeChange,
  onSave,
  onCancel,
  validationErrors,
  errors = {},
}: EditShiftModalProps) {
  // Use the structured errors object if available, otherwise fall back to checking the array
  const hasErrors = validationErrors.length > 0 || Object.keys(errors).length > 0;

  // First check the structured errors object, then fall back to the array-based checks
  const hasDateError =
    errors.date !== undefined || validationErrors.some((error) => error.includes("Date") || error.includes("date"));
  const hasStartTimeError =
    errors.startTime !== undefined || validationErrors.some((error) => error.includes("start time"));
  const hasEndTimeError = errors.endTime !== undefined || validationErrors.some((error) => error.includes("end time"));
  const hasGeneralError =
    errors.general !== undefined ||
    validationErrors.some(
      (error) =>
        !error.includes("Date") &&
        !error.includes("date") &&
        !error.includes("start time") &&
        !error.includes("end time")
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Edit Shift</h2>

          {hasErrors && (
            <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-md">
              <div className="flex items-center mb-1">
                <svg
                  className="w-5 h-5 text-red-500 dark:text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Please correct the following errors:
                </h3>
              </div>
              <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 pl-2">
                {errors.date && <li>{errors.date}</li>}
                {errors.startTime && <li>{errors.startTime}</li>}
                {errors.endTime && <li>{errors.endTime}</li>}
                {errors.general && <li>{errors.general}</li>}
                {/* Fall back to displaying array-based errors if we don't have the structured format */}
                {!Object.keys(errors).length && validationErrors.map((error, index) => <li key={index}>{error}</li>)}
              </ul>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                className={`block font-medium text-sm mb-2 ${
                  hasDateError ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className={`w-4 h-4 ${
                      hasDateError ? "text-red-500 dark:text-red-400" : "text-slate-500 dark:text-slate-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded text-slate-900 dark:text-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-opacity-50 ${
                  hasDateError
                    ? "border-red-300 dark:border-red-700 focus:border-red-400 focus:ring-red-200 dark:focus:ring-red-900"
                    : "border-slate-300 dark:border-slate-600 focus:border-indigo-400 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
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
                  hasError={hasStartTimeError}
                />
              </div>
              <div>
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
                  hasError={hasEndTimeError}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <button
                onClick={onCancel}
                className="w-full sm:w-auto px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 order-2 sm:order-1"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-500 dark:bg-indigo-600 text-white rounded hover:bg-indigo-600 dark:hover:bg-indigo-700 order-1 sm:order-2 transition-colors"
                type="button"
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
