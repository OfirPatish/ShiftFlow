import { TimeEntry, ShiftCalculation, WageConfig } from "../types/shift";

/**
 * Converts a time entry (hours and minutes) to decimal hours
 * @param time TimeEntry object containing hours and minutes
 * @returns number representing decimal hours (e.g., 1:30 becomes 1.5)
 */
export const convertTimeToDecimal = (time: TimeEntry): number => {
  return time.hours + time.minutes / 60;
};

/**
 * Converts decimal hours back to a formatted time string
 * @param decimal number of hours in decimal format (e.g., 1.5)
 * @returns formatted string in HH:MM format (e.g., "01:30")
 */
export const convertDecimalToTime = (decimal: number): string => {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

/**
 * Calculates the time difference between two TimeEntry objects
 * @param start starting time
 * @param end ending time
 * @returns formatted string representing the duration in HH:MM format
 */
export const calculateTimeDifference = (start: TimeEntry, end: TimeEntry): string => {
  const startDecimal = convertTimeToDecimal(start);
  const endDecimal = convertTimeToDecimal(end);
  const diffDecimal = endDecimal - startDecimal;
  return convertDecimalToTime(diffDecimal);
};

/**
 * Parses a time string in HH:MM format into a TimeEntry object
 * @param timeStr time string in "HH:MM" format
 * @returns TimeEntry object with hours and minutes
 */
export const parseTimeString = (timeStr: string): TimeEntry => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
};

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
 * Formats a TimeEntry object into a display-friendly time string
 * @param time TimeEntry object containing hours and minutes
 * @returns formatted string in HH:MM format (e.g., "09:30")
 */
export const formatTime = (time: TimeEntry): string => {
  const hours = String(time.hours).padStart(2, "0");
  const minutes = String(time.minutes).padStart(2, "0");
  return `${hours}:${minutes}`;
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
 * Formats a date string into DD/MM/YYYY format (Israeli standard)
 * @param dateStr date string in any valid format
 * @returns formatted date string in DD/MM/YYYY format
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}/${date.getFullYear()}`;
};

/**
 * Converts DD/MM/YYYY format to YYYY-MM-DD format
 * Useful for converting displayed dates to HTML date input format
 * @param dateStr date string in DD/MM/YYYY format
 * @returns date string in YYYY-MM-DD format
 */
export const formatDateForInput = (dateStr: string): string => {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

/**
 * Gets today's date in DD/MM/YYYY format (Israeli standard)
 * @returns today's date formatted as DD/MM/YYYY
 */
export const getTodayFormatted = (): string => {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}/${today.getFullYear()}`;
};

/**
 * Gets today's date in YYYY-MM-DD format for the date input
 * Note: HTML date inputs use YYYY-MM-DD format internally, but display format
 * will depend on user's browser/system locale settings
 */
export const getTodayForInput = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};
