import React, { useState, useEffect } from "react";
import { TimeEntry, ShiftCalculation } from "../../types/shift";
import {
  calculateShiftHours,
  formatTime,
  formatCurrency,
  getTodayForInput,
  formatDate,
} from "../../utils/calculations";
import { useWage } from "../../context/wageContext";
import { useShifts } from "../../context/shiftsContext";
import { validateShift } from "../../utils/validation";
import { ShiftCalculationResults } from "../summary/ShiftCalculationResults";
import { TimeInput } from "../common/TimeInput";

export function ShiftInputForm() {
  const { wageConfig } = useWage();
  const { addShift, shifts } = useShifts();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState<TimeEntry>({ hours: 0, minutes: 0 });
  const [endTime, setEndTime] = useState<TimeEntry>({ hours: 0, minutes: 0 });
  const [calculation, setCalculation] = useState<ShiftCalculation | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Set initial date on client side only
  useEffect(() => {
    const today = getTodayForInput();
    setDate(today);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    setDate(inputDate);
  };

  const handleTimeChange = (type: "start" | "end", field: "hours" | "minutes", value: string) => {
    const numValue = parseInt(value) || 0;
    const setter = type === "start" ? setStartTime : setEndTime;

    setter((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const calculateShift = () => {
    // Validate shift before calculating
    const validation = validateShift(date, startTime, endTime, shifts);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    const result = calculateShiftHours(startTime, endTime, wageConfig);
    setCalculation(result);
  };

  const saveShift = () => {
    if (!calculation || !date) return;

    // Validate again before saving
    const validation = validateShift(date, startTime, endTime, shifts);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    const newShift = {
      id: Date.now().toString(),
      date,
      startTime,
      endTime,
      calculatedHours: {
        base: calculation.baseHours,
        overtime: calculation.overtime125Hours + calculation.overtime150Hours,
        overtime125: calculation.overtime125Hours,
        overtime150: calculation.overtime150Hours,
        total: calculation.totalHours,
      },
      totalEarnings: calculation.earnings.total,
    };

    addShift(newShift);

    // Reset form
    setStartTime({ hours: 0, minutes: 0 });
    setEndTime({ hours: 0, minutes: 0 });
    setCalculation(null);
    setValidationErrors([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add New Shift</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter the details of your work shift below</p>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded">
          <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
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
            onChange={handleDateChange}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
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
              onChange={(field, value) => handleTimeChange("start", field, value)}
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
              onChange={(field, value) => handleTimeChange("end", field, value)}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-3">
          <button
            onClick={calculateShift}
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
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

          {calculation && (
            <button
              onClick={saveShift}
              className="w-full bg-green-500 dark:bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Save Shift
            </button>
          )}
        </div>
      </div>

      {calculation && <ShiftCalculationResults calculation={calculation} />}
    </div>
  );
}
