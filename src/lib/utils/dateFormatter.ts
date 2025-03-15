/**
 * Date Formatting Utilities
 *
 * This file provides a collection of functions for formatting dates and times
 * across the application. These utilities ensure consistent date and time
 * representation throughout the UI.
 */

import { format } from 'date-fns';

/**
 * Formats a date to display the day and abbreviated date
 *
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Mon, Jan 1")
 *
 * @example
 * // Returns "Mon, Jan 1"
 * formatDayDate(new Date(2023, 0, 1))
 */
export function formatDayDate(date: Date): string {
  return format(date, 'EEE, MMM d');
}

/**
 * Formats a date to display the full day and date
 *
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Monday, January 1, 2023")
 *
 * @example
 * // Returns "Monday, January 1, 2023"
 * formatFullDate(new Date(2023, 0, 1))
 */
export function formatFullDate(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Formats a time range from start and end dates
 *
 * @param startDate - The start date and time
 * @param endDate - The end date and time
 * @returns Formatted time range string (e.g., "09:00 - 17:00")
 *
 * @example
 * // Returns "09:00 - 17:00"
 * formatTimeRange(
 *   new Date(2023, 0, 1, 9, 0),
 *   new Date(2023, 0, 1, 17, 0)
 * )
 */
export function formatTimeRange(startDate: Date, endDate: Date): string {
  return `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`;
}

/**
 * Formats hours with one decimal place
 *
 * @param hours - The hours value to format
 * @returns Formatted hours string (e.g., "8.5")
 *
 * @example
 * // Returns "8.5"
 * formatHours(8.5)
 */
export function formatHours(hours: number): string {
  return hours.toFixed(1);
}

/**
 * Formats a date for form inputs (YYYY-MM-DD)
 *
 * @param date - The date to format
 * @returns Formatted date string in YYYY-MM-DD format
 *
 * @example
 * // Returns "2023-01-01"
 * formatDateForInput(new Date(2023, 0, 1))
 */
export function formatDateForInput(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Formats a time for form inputs (HH:MM)
 *
 * @param date - The date containing the time to format
 * @returns Formatted time string in HH:MM format
 *
 * @example
 * // Returns "09:30"
 * formatTimeForInput(new Date(2023, 0, 1, 9, 30))
 */
export function formatTimeForInput(date: Date): string {
  return format(date, 'HH:mm');
}
