"use client";

import { useState, useEffect } from "react";
import { Shift, MonthlyShiftSummary } from "../types/shift";
import { calculateShiftHours } from "../../features/shifts/utils/shiftCalculations";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the shape of our shifts state
interface ShiftsState {
  shifts: Shift[];
  addShift: (shift: Shift) => void;
  editShift: (shiftId: string, updatedShift: Shift) => void;
  deleteShift: (shiftId: string) => void;
  getMonthlyShifts: (year: number, month: number) => Shift[];
  getMonthlyShiftSummary: (year: number, month: number, baseHourlyRate: number) => MonthlyShiftSummary;
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

// Create the shifts store with persistence
export const useShiftsStore = create<ShiftsState>()(
  persist(
    (set, get) => ({
      shifts: [],

      addShift: (shift: Shift) => set((state) => ({ shifts: [...state.shifts, shift] })),

      editShift: (shiftId: string, updatedShift: Shift) =>
        set((state) => ({
          shifts: state.shifts.map((shift) => (shift.id === shiftId ? updatedShift : shift)),
        })),

      deleteShift: (shiftId: string) =>
        set((state) => ({
          shifts: state.shifts.filter((shift) => shift.id !== shiftId),
        })),

      getMonthlyShifts: (year: number, month: number) => {
        const { shifts } = get();
        return shifts.filter((shift) => {
          const shiftDate = new Date(shift.date);
          return shiftDate.getFullYear() === year && shiftDate.getMonth() === month;
        });
      },

      getMonthlyShiftSummary: (year: number, month: number, baseHourlyRate: number): MonthlyShiftSummary => {
        const monthlyShifts = get().getMonthlyShifts(year, month);

        if (monthlyShifts.length === 0) {
          return defaultMonthlyShiftSummary;
        }

        const summary = monthlyShifts.reduce(
          (acc, shift) => {
            // Add hours
            acc.totalHours.base += shift.calculatedHours.base;
            acc.totalHours.overtime += shift.calculatedHours.overtime;
            acc.totalHours.total += shift.calculatedHours.total;

            // Add earnings
            const baseEarnings = shift.calculatedHours.base * baseHourlyRate;
            const overtimeEarnings = shift.totalEarnings - baseEarnings;

            acc.earnings.base += baseEarnings;
            acc.earnings.overtime += overtimeEarnings;
            acc.earnings.total += shift.totalEarnings;

            return acc;
          },
          {
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
          } as MonthlyShiftSummary
        );

        // Round to 2 decimal places for display
        summary.totalHours.base = parseFloat(summary.totalHours.base.toFixed(2));
        summary.totalHours.overtime = parseFloat(summary.totalHours.overtime.toFixed(2));
        summary.totalHours.total = parseFloat(summary.totalHours.total.toFixed(2));

        summary.earnings.base = parseFloat(summary.earnings.base.toFixed(2));
        summary.earnings.overtime = parseFloat(summary.earnings.overtime.toFixed(2));
        summary.earnings.total = parseFloat(summary.earnings.total.toFixed(2));

        return summary;
      },
    }),
    {
      name: "shifts-storage",
    }
  )
);
