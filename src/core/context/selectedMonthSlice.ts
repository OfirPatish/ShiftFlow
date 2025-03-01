"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SelectedMonthContextType {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  isCurrentMonth: boolean;
  resetToCurrentMonth: () => void;
}

const SelectedMonthContext = createContext<SelectedMonthContextType | undefined>(undefined);

export function SelectedMonthProvider({ children }: { children: ReactNode }) {
  // Start with the current month
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => {
    const today = new Date();
    // Create a new date set to the 1st day of the current month
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Helper to check if the selected month is the current month
  const isCurrentMonth = (): boolean => {
    const today = new Date();
    return selectedMonth.getFullYear() === today.getFullYear() && selectedMonth.getMonth() === today.getMonth();
  };

  // Navigate to the next month
  const goToNextMonth = () => {
    setSelectedMonth((currentDate) => {
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    });
  };

  // Navigate to the previous month
  const goToPreviousMonth = () => {
    setSelectedMonth((currentDate) => {
      const previousMonth = new Date(currentDate);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      return previousMonth;
    });
  };

  // Reset to the current month
  const resetToCurrentMonth = () => {
    const today = new Date();
    setSelectedMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return React.createElement(
    SelectedMonthContext.Provider,
    {
      value: {
        selectedMonth,
        setSelectedMonth,
        goToNextMonth,
        goToPreviousMonth,
        isCurrentMonth: isCurrentMonth(),
        resetToCurrentMonth,
      },
    },
    children
  );
}

export function useSelectedMonth() {
  const context = useContext(SelectedMonthContext);
  if (context === undefined) {
    throw new Error("useSelectedMonth must be used within a SelectedMonthProvider");
  }
  return context;
}
