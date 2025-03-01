/**
 * Utility functions for formatting and displaying shift data
 */
import { TimeEntry, ShiftCalculation, WageConfig } from "../../../../core/types/shift";

/**
 * Formats a date object or string into a localized string format
 * @param date Date object or date string
 * @returns Formatted date string (e.g., "Jan 15, 2023")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a time string or TimeEntry object into a more readable format
 * @param time Time string in 24-hour format (e.g., "14:30") or TimeEntry object
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(time: string | TimeEntry): string {
  if (!time) return "";

  let hours: string | number;
  let minutes: string | number;

  if (typeof time === "string") {
    [hours, minutes] = time.split(":");
  } else {
    hours = time.hours;
    minutes = time.minutes < 10 ? `0${time.minutes}` : time.minutes;
  }

  const hour = typeof hours === "string" ? parseInt(hours, 10) : hours;
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${period}`;
}

/**
 * Calculates the duration between start and end times
 * @param startTime Start time string in 24-hour format
 * @param endTime End time string in 24-hour format
 * @returns Duration in hours (with decimal)
 */
export function calculateDuration(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;

  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  // Handle overnight shifts
  const durationMinutes =
    endTotalMinutes < startTotalMinutes
      ? endTotalMinutes + 24 * 60 - startTotalMinutes
      : endTotalMinutes - startTotalMinutes;

  return parseFloat((durationMinutes / 60).toFixed(2));
}

/**
 * Calculates the duration between TimeEntry objects
 * @param startTime Start time as a TimeEntry
 * @param endTime End time as a TimeEntry
 * @returns Duration in hours (with decimal)
 */
export function calculateTimeEntryDuration(startTime: TimeEntry, endTime: TimeEntry): number {
  if (!startTime || !endTime) return 0;

  const startTotalMinutes = startTime.hours * 60 + startTime.minutes;
  const endTotalMinutes = endTime.hours * 60 + endTime.minutes;

  // Handle overnight shifts
  const durationMinutes =
    endTotalMinutes < startTotalMinutes
      ? endTotalMinutes + 24 * 60 - startTotalMinutes
      : endTotalMinutes - startTotalMinutes;

  return parseFloat((durationMinutes / 60).toFixed(2));
}

/**
 * Converts a TimeEntry to 24-hour format string
 * @param time TimeEntry object
 * @returns Time string in 24-hour format (e.g., "14:30")
 */
export function timeEntryToString(time: TimeEntry): string {
  if (!time) return "";
  const minutes = time.minutes < 10 ? `0${time.minutes}` : time.minutes;
  return `${time.hours}:${minutes}`;
}

/**
 * Calculates the hours and earnings for a shift based on start and end times
 * @param startTime Start time as a TimeEntry
 * @param endTime End time as a TimeEntry
 * @param wageConfig Wage configuration with hourly rate
 * @returns Calculated hours and earnings
 */
export function calculateShiftHours(
  startTime: TimeEntry,
  endTime: TimeEntry,
  wageConfig: WageConfig
): ShiftCalculation {
  if (!startTime || !endTime || !wageConfig?.baseHourlyRate) {
    return {
      baseHours: 0,
      overtimeHours: 0,
      overtime125Hours: 0,
      overtime150Hours: 0,
      totalHours: 0,
      earnings: {
        base: 0,
        overtime125: 0,
        overtime150: 0,
        total: 0,
      },
    };
  }

  const hourlyRate = wageConfig.baseHourlyRate;

  // Calculate total duration in hours
  const totalHours = calculateTimeEntryDuration(startTime, endTime);

  // Regular hours (first 8 hours)
  const baseHours = Math.min(totalHours, 8);

  // First level overtime (125% rate, hours 8-10)
  const overtime125Hours = totalHours > 8 ? Math.min(totalHours - 8, 2) : 0;

  // Second level overtime (150% rate, hours beyond 10)
  const overtime150Hours = totalHours > 10 ? totalHours - 10 : 0;

  // Total overtime hours
  const overtimeHours = overtime125Hours + overtime150Hours;

  // Calculate earnings
  const baseEarnings = baseHours * hourlyRate;
  const overtime125Earnings = overtime125Hours * hourlyRate * 1.25;
  const overtime150Earnings = overtime150Hours * hourlyRate * 1.5;
  const totalEarnings = baseEarnings + overtime125Earnings + overtime150Earnings;

  return {
    baseHours,
    overtimeHours,
    overtime125Hours,
    overtime150Hours,
    totalHours,
    earnings: {
      base: parseFloat(baseEarnings.toFixed(2)),
      overtime125: parseFloat(overtime125Earnings.toFixed(2)),
      overtime150: parseFloat(overtime150Earnings.toFixed(2)),
      total: parseFloat(totalEarnings.toFixed(2)),
    },
  };
}

/**
 * Formats a currency amount to a localized string
 * @param amount The amount to format
 * @returns Formatted currency string (e.g., "₪24.50")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculates and formats the time difference between two TimeEntry objects
 * @param startTime Start time as a TimeEntry
 * @param endTime End time as a TimeEntry
 * @returns Formatted time difference string (e.g., "8h 30m")
 */
export function calculateTimeDifference(startTime: TimeEntry, endTime: TimeEntry): string {
  if (!startTime || !endTime) return "0h 0m";

  const totalMinutes = calculateTimeEntryDuration(startTime, endTime) * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return `${hours}h ${minutes}m`;
}
