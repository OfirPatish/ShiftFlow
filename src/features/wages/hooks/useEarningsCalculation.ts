"use client";

import { useWageStore } from "../../../core/context/wageSlice";
import { TimeEntry, ShiftCalculation } from "../../../core/types/shift";
import { calculateShiftHours } from "../utils/earningsCalculations";

/**
 * Custom hook that provides earnings calculation functionality
 * Connects to the wage store and provides methods for calculating earnings
 */
export const useEarningsCalculation = () => {
  const { wageConfig } = useWageStore();

  /**
   * Calculate earnings for a shift based on start and end time
   */
  const calculateEarnings = (startTime: TimeEntry, endTime: TimeEntry): ShiftCalculation => {
    return calculateShiftHours(startTime, endTime, wageConfig);
  };

  /**
   * Calculate monthly earnings based on total hours
   */
  const calculateMonthlyEarnings = (regularHours: number, overtime125Hours: number, overtime150Hours: number) => {
    const regularEarnings = regularHours * wageConfig.baseHourlyRate;
    const overtime125Earnings = overtime125Hours * wageConfig.baseHourlyRate * 1.25;
    const overtime150Earnings = overtime150Hours * wageConfig.baseHourlyRate * 1.5;

    return {
      regular: regularEarnings,
      overtime125: overtime125Earnings,
      overtime150: overtime150Earnings,
      total: regularEarnings + overtime125Earnings + overtime150Earnings,
    };
  };

  return {
    wageConfig,
    calculateEarnings,
    calculateMonthlyEarnings,
  };
};
