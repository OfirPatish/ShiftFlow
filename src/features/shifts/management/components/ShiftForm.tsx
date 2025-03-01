"use client";

import React, { useState } from "react";
import { useShiftFormValidation } from "../hooks";
import { useShiftsStore } from "../../../../core/context/shiftsSlice";
import { TimeEntry } from "../../../../core/types/shift";
import { calculateShiftHours } from "../../utils/shiftCalculations";
import { TimeInput } from "../../../ui/components/inputs";
import { useWageStore } from "../../../../core/context/wageSlice";

export function ShiftForm() {
  const { addShift } = useShiftsStore();
  const { errors, validate, resetErrors } = useShiftFormValidation();
  const wageConfig = useWageStore((state) => state.wageConfig);

  const [formData, setFormData] = useState({
    date: "",
    startTime: { hours: 9, minutes: 0 } as TimeEntry,
    endTime: { hours: 17, minutes: 0 } as TimeEntry,
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleTimeChange = (type: "startTime" | "endTime", field: "hours" | "minutes", value: string) => {
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [field]: parseInt(value) || 0,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate(formData)) {
      // Calculate shift hours and earnings
      const calculatedHours = calculateShiftHours(formData.startTime, formData.endTime, wageConfig);

      // Add shift if validation passes
      addShift({
        id: Math.random().toString(36).substr(2, 9),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        calculatedHours: {
          base: calculatedHours.baseHours,
          overtime: calculatedHours.overtimeHours,
          overtime125: calculatedHours.overtime125Hours,
          overtime150: calculatedHours.overtime150Hours,
          total: calculatedHours.totalHours,
        },
        totalEarnings: calculatedHours.earnings.total,
      });

      // Reset form
      setFormData({
        date: "",
        startTime: { hours: 9, minutes: 0 },
        endTime: { hours: 17, minutes: 0 },
      });

      resetErrors();
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Add New Shift</h2>

      {/* Error Summary */}
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
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Please correct the following errors:</h3>
          </div>
          <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 pl-2">
            {errors.date && <li>{errors.date}</li>}
            {errors.startTime && <li>{errors.startTime}</li>}
            {errors.endTime && <li>{errors.endTime}</li>}
            {errors.general && <li>{errors.general}</li>}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={handleDateChange}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-opacity-50 dark:bg-slate-700 dark:text-white ${
            errors.date
              ? "border-red-300 focus:border-red-300 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900"
              : "border-slate-300 focus:border-indigo-300 focus:ring-indigo-200 dark:border-slate-600 dark:focus:ring-indigo-900"
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Start Time */}
        <div>
          <TimeInput
            label="Start Time"
            value={formData.startTime}
            onChange={(field, value) => handleTimeChange("startTime", field, value)}
            hasError={!!errors.startTime}
          />
        </div>

        {/* End Time */}
        <div>
          <TimeInput
            label="End Time"
            value={formData.endTime}
            onChange={(field, value) => handleTimeChange("endTime", field, value)}
            hasError={!!errors.endTime}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
      >
        Add Shift
      </button>
    </form>
  );
}
