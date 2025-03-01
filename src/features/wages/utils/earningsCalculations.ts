"use client";

import { TimeEntry, ShiftCalculation, WageConfig } from "../../../core/types/shift";

/**
 * Calculates shift hours and earnings based on Israeli labor laws:
 * - First 8 hours: regular pay
 * - Hours 8-10: 125% pay
 * - Hours 10+: 150% pay
 *
 * @param startTime shift start time
 * @param endTime shift end time
 * @param wageConfig wage configuration containing base hourly rate
 * @returns ShiftCalculation object with detailed breakdown of hours and earnings
 */
export const calculateShiftHours = (
  startTime: TimeEntry,
  endTime: TimeEntry,
  wageConfig: WageConfig
): ShiftCalculation => {
  const totalHoursDecimal = convertTimeToDecimal(endTime) - convertTimeToDecimal(startTime);

  // Calculate base hours (first 8 hours)
  const baseHoursDecimal = Math.min(8, totalHoursDecimal);

  // Calculate overtime 125% (hours 8-10)
  const overtime125Decimal = Math.min(2, Math.max(0, totalHoursDecimal - 8));

  // Calculate overtime 150% (hours 10+)
  const overtime150Decimal = Math.max(0, totalHoursDecimal - 10);

  // Total overtime hours
  const totalOvertimeDecimal = overtime125Decimal + overtime150Decimal;

  // Calculate earnings
  const baseEarnings = baseHoursDecimal * wageConfig.baseHourlyRate;
  const overtime125Earnings = overtime125Decimal * wageConfig.baseHourlyRate * 1.25;
  const overtime150Earnings = overtime150Decimal * wageConfig.baseHourlyRate * 1.5;
  const totalOvertimeEarnings = overtime125Earnings + overtime150Earnings;

  return {
    baseHours: baseHoursDecimal,
    overtimeHours: totalOvertimeDecimal,
    overtime125Hours: overtime125Decimal,
    overtime150Hours: overtime150Decimal,
    totalHours: totalHoursDecimal,
    earnings: {
      base: baseEarnings,
      overtime125: overtime125Earnings,
      overtime150: overtime150Earnings,
      total: baseEarnings + totalOvertimeEarnings,
    },
  };
};

/**
 * Formats a number as Israeli currency (ILS/₪)
 * @param amount number to format
 * @returns formatted string with shekel symbol and 2 decimal places
 */
export const formatCurrency = (amount: number): string => {
  // Format the number in English
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // Add the Hebrew shekel symbol
  return `₪${formattedNumber}`;
};

/**
 * Converts a time entry (hours and minutes) to decimal hours
 * @param time TimeEntry object containing hours and minutes
 * @returns number representing decimal hours (e.g., 1:30 becomes 1.5)
 */
export const convertTimeToDecimal = (time: TimeEntry): number => {
  return time.hours + time.minutes / 60;
};
