/**
 * Shift Calculation and Time Utilities
 *
 * This file provides the core business logic for calculating work hours,
 * overtime, and earnings based on the application's business rules.
 * It handles time arithmetic, wage calculations, and overtime tiers
 * according to Israeli labor standards.
 */

/**
 * Result structure for shift calculations containing hours and earnings breakdowns
 *
 * This interface defines the expected output format for shift calculations,
 * including a breakdown of hours by rate tier and the corresponding earnings.
 */
export interface ShiftCalculationResult {
  regularHours: number; // Regular hours (first 8 hours, base rate)
  overtimeHours1: number; // First overtime tier (typically hours 8-10, 125% rate)
  overtimeHours2: number; // Second overtime tier (typically hours 10+, 150% rate)
  totalHours: number; // Total hours worked
  regularEarnings: number; // Earnings for regular hours
  overtimeEarnings1: number; // Earnings for first overtime tier
  overtimeEarnings2: number; // Earnings for second overtime tier
  totalEarnings: number; // Total earnings for the shift
}

// Fixed overtime multipliers as constants
const OVERTIME_RATE_1_MULTIPLIER = 1.25; // 125% for hours 8-10
const OVERTIME_RATE_2_MULTIPLIER = 1.5; // 150% for hours beyond 10

/**
 * Calculates detailed shift earnings with overtime tiers
 *
 * This is the primary function for computing shift financials according to
 * Israeli overtime rules. It breaks down hours into three tiers:
 * 1. Regular hours (first 8 hours): Paid at the base rate (100%)
 * 2. First overtime tier (hours 8-10): Paid at 125% (fixed)
 * 3. Second overtime tier (hours 10+): Paid at 150% (fixed)
 *
 * The calculation accounts for breaks (unpaid time) and handles validation
 * of input dates and times.
 *
 * @param startTime - Shift start time
 * @param endTime - Shift end time
 * @param breakDuration - Unpaid break time in minutes
 * @param baseRate - Base hourly pay rate
 * @returns Detailed breakdown of hours and earnings by rate tier
 *
 * @throws Error if start/end times are invalid or if break exceeds shift duration
 */
export function calculateShiftEarnings(
  startTime: Date,
  endTime: Date,
  breakDuration: number, // in minutes
  baseRate: number
): ShiftCalculationResult {
  // Ensure dates are valid
  if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
    throw new Error('Invalid start or end time');
  }

  // Ensure end time is after start time
  if (endTime.getTime() <= startTime.getTime()) {
    throw new Error('End time must be after start time');
  }

  // Calculate total work minutes (excluding break)
  const totalMinutes = (endTime.getTime() - startTime.getTime()) / 60000 - breakDuration;

  // Handle negative duration after break (shouldn't happen, but just in case)
  if (totalMinutes < 0) {
    throw new Error('Break duration exceeds shift duration');
  }

  // Convert minutes to hours
  const totalHours = totalMinutes / 60;

  // Calculate hours in each rate tier
  const regularHours = Math.min(8, totalHours);
  const overtimeHours1 = Math.max(0, Math.min(2, totalHours - 8)); // Hours between 8-10
  const overtimeHours2 = Math.max(0, totalHours - 10); // Hours beyond 10

  // Calculate earnings for each tier
  const regularEarnings = regularHours * baseRate;
  const overtimeEarnings1 = overtimeHours1 * (baseRate * OVERTIME_RATE_1_MULTIPLIER);
  const overtimeEarnings2 = overtimeHours2 * (baseRate * OVERTIME_RATE_2_MULTIPLIER);

  return {
    regularHours,
    overtimeHours1,
    overtimeHours2,
    totalHours,
    regularEarnings,
    overtimeEarnings1,
    overtimeEarnings2,
    totalEarnings: regularEarnings + overtimeEarnings1 + overtimeEarnings2,
  };
}

/**
 * Aggregates multiple shifts to calculate monthly totals
 *
 * Use this function to summarize earnings and hours across multiple shifts,
 * such as for monthly reports or pay period totals.
 *
 * @param shifts - Array of shift calculation results to aggregate
 * @returns Object containing summarized hours and earnings
 */
export function calculateMonthlyTotals(shifts: ShiftCalculationResult[]): {
  totalHours: number;
  totalEarnings: number;
  regularHours: number;
  overtimeHours: number;
  overtimeEarnings1: number;
  overtimeEarnings2: number;
  shiftsCount: number;
} {
  return shifts.reduce(
    (acc, shift) => {
      return {
        totalHours: acc.totalHours + shift.totalHours,
        totalEarnings: acc.totalEarnings + shift.totalEarnings,
        regularHours: acc.regularHours + shift.regularHours,
        overtimeHours: acc.overtimeHours + shift.overtimeHours1 + shift.overtimeHours2,
        overtimeEarnings1: acc.overtimeEarnings1 + shift.overtimeEarnings1,
        overtimeEarnings2: acc.overtimeEarnings2 + shift.overtimeEarnings2,
        shiftsCount: acc.shiftsCount + 1,
      };
    },
    {
      totalHours: 0,
      totalEarnings: 0,
      regularHours: 0,
      overtimeHours: 0,
      overtimeEarnings1: 0,
      overtimeEarnings2: 0,
      shiftsCount: 0,
    }
  );
}

/**
 * Rounds a monetary amount to 2 decimal places
 *
 * Use this function when displaying currency values to ensure
 * consistent decimal precision.
 *
 * @param amount - The monetary amount to round
 * @returns The amount rounded to 2 decimal places
 */
export function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * Formats hours as a human-readable string
 *
 * Converts decimal hours to a format with hours and minutes.
 * Example: 8.5 hours becomes "8h 30m"
 *
 * @param hours - Number of hours (can include fractional part)
 * @returns Formatted hours string (e.g., "8h 30m" or "8h")
 */
export function formatHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes}m`;
}

/**
 * Formats minutes as a human-readable duration
 *
 * Converts minutes to a format with hours and minutes.
 * Example: 135 minutes becomes "2h 15m"
 *
 * @param minutes - Number of minutes
 * @returns Formatted duration string (e.g., "2h 15m", "45m", or "2h")
 */
export function formatDurationFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Calculates the duration between two times in minutes
 *
 * Simple utility to get the time difference in minutes.
 *
 * @param startTime - Start time
 * @param endTime - End time
 * @returns Duration in minutes (rounded to nearest minute)
 */
export function calculateDurationInMinutes(startTime: Date, endTime: Date): number {
  return Math.round((endTime.getTime() - startTime.getTime()) / 60000);
}
