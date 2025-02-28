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
import { NewShiftForm } from "./NewShiftForm";

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
    <div className="theme-card p-6">
      <NewShiftForm
        date={date}
        startTime={startTime}
        endTime={endTime}
        validationErrors={validationErrors}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
        onCalculate={calculateShift}
      />

      {calculation && (
        <div className="mt-6">
          <ShiftCalculationResults calculation={calculation} />
          <button
            onClick={saveShift}
            className="w-full mt-4 bg-green-500 dark:bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Save Shift
          </button>
        </div>
      )}
    </div>
  );
}
