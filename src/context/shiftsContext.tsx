"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Shift, MonthlyShiftSummary } from "../types/shift";
import {
  parseTimeString,
  convertTimeToDecimal,
  convertDecimalToTime,
  calculateShiftHours,
} from "../utils/calculations";
import { useWage } from "./wageContext";

interface ShiftsContextType {
  shifts: Shift[];
  addShift: (shift: Shift) => void;
  editShift: (shiftId: string, updatedShift: Shift) => void;
  deleteShift: (shiftId: string) => void;
  getMonthlyShifts: (year: number, month: number) => Shift[];
  getMonthlyShiftSummary: (year: number, month: number) => MonthlyShiftSummary;
}

const defaultMonthlyShiftSummary: MonthlyShiftSummary = {
  totalHours: {
    base: 0,
    overtime: 0,
    total: 0,
  },
  earnings: {
    base: 0,
    overtime: 0,
    total: 0,
  },
};

const ShiftsContext = createContext<ShiftsContextType | undefined>(undefined);

export function ShiftsProvider({ children }: { children: ReactNode }) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { wageConfig } = useWage();

  useEffect(() => {
    // Load shifts from localStorage only once on client side
    const savedShifts = localStorage.getItem("shifts");
    if (savedShifts) {
      setShifts(JSON.parse(savedShifts));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // Only save to localStorage if we've initialized
    if (isInitialized) {
      localStorage.setItem("shifts", JSON.stringify(shifts));
    }
  }, [shifts, isInitialized]);

  const addShift = (shift: Shift) => {
    setShifts((prev) => [...prev, shift]);
  };

  const editShift = (shiftId: string, updatedShift: Shift) => {
    setShifts((prev) => prev.map((shift) => (shift.id === shiftId ? { ...updatedShift, id: shiftId } : shift)));
  };

  const deleteShift = (shiftId: string) => {
    setShifts((prev) => prev.filter((shift) => shift.id !== shiftId));
  };

  const getMonthlyShifts = (year: number, month: number) => {
    return shifts.filter((shift) => {
      const shiftDate = new Date(shift.date);
      return shiftDate.getFullYear() === year && shiftDate.getMonth() === month;
    });
  };

  const getMonthlyShiftSummary = (year: number, month: number): MonthlyShiftSummary => {
    if (!isInitialized) return defaultMonthlyShiftSummary;

    const monthlyShifts = getMonthlyShifts(year, month);
    if (monthlyShifts.length === 0) return defaultMonthlyShiftSummary;

    // Calculate total hours and earnings using current wage config
    const totals = monthlyShifts.reduce(
      (acc, shift) => {
        // Recalculate with current wage config
        const calculation = calculateShiftHours(shift.startTime, shift.endTime, wageConfig);

        return {
          hours: {
            base: acc.hours.base + calculation.baseHours,
            overtime: acc.hours.overtime + calculation.overtimeHours,
            total: acc.hours.total + calculation.totalHours,
          },
          earnings: {
            base: acc.earnings.base + calculation.earnings.base,
            overtime: acc.earnings.overtime + (calculation.earnings.overtime125 + calculation.earnings.overtime150),
            total: acc.earnings.total + calculation.earnings.total,
          },
        };
      },
      {
        hours: { base: 0, overtime: 0, total: 0 },
        earnings: { base: 0, overtime: 0, total: 0 },
      }
    );

    return {
      totalHours: totals.hours,
      earnings: totals.earnings,
    };
  };

  return (
    <ShiftsContext.Provider
      value={{
        shifts,
        addShift,
        editShift,
        deleteShift,
        getMonthlyShifts,
        getMonthlyShiftSummary,
      }}
    >
      {children}
    </ShiftsContext.Provider>
  );
}

export function useShifts() {
  const context = useContext(ShiftsContext);
  if (context === undefined) {
    throw new Error("useShifts must be used within a ShiftsProvider");
  }
  return context;
}
