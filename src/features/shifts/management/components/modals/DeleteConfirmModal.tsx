import React from "react";
import { Shift } from "../../../../../core/types/shift";
import { formatDate, formatTime } from "../../utils";

interface DeleteConfirmModalProps {
  shift: Shift;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ shift, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-6 h-6 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Delete Shift</h3>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Are you sure you want to delete the shift on{" "}
            <span className="font-medium text-slate-800 dark:text-white">{formatDate(shift.date)}</span> from{" "}
            <span className="font-medium text-slate-800 dark:text-white">{formatTime(shift.startTime)}</span> to{" "}
            <span className="font-medium text-slate-800 dark:text-white">{formatTime(shift.endTime)}</span>
            ?
            <br />
            <span className="text-sm text-slate-500 dark:text-slate-400 mt-2 block">This action cannot be undone.</span>
          </p>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-full sm:w-auto px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Shift
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
