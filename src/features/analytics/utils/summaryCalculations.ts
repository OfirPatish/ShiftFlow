import { Shift, MonthlyShiftSummary } from "../../../core/types/shift";

/**
 * Default empty summary object
 */
export const defaultSummary: MonthlyShiftSummary = {
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

/**
 * Calculate summary statistics for an array of shifts
 */
export function calculateSummaryFromShifts(shifts: Shift[], baseHourlyRate: number): MonthlyShiftSummary {
  if (shifts.length === 0) {
    return defaultSummary;
  }

  const summary = shifts.reduce(
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
    { ...defaultSummary }
  );

  // Round to 2 decimal places for display
  summary.totalHours.base = parseFloat(summary.totalHours.base.toFixed(2));
  summary.totalHours.overtime = parseFloat(summary.totalHours.overtime.toFixed(2));
  summary.totalHours.total = parseFloat(summary.totalHours.total.toFixed(2));

  summary.earnings.base = parseFloat(summary.earnings.base.toFixed(2));
  summary.earnings.overtime = parseFloat(summary.earnings.overtime.toFixed(2));
  summary.earnings.total = parseFloat(summary.earnings.total.toFixed(2));

  return summary;
}

/**
 * Format a currency value
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format hours value as a string with 2 decimal places
 */
export function formatHours(hours: number): string {
  return hours.toFixed(2);
}
