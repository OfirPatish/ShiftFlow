import { TimeEntry, Shift } from "../types/shift";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateShift(
  date: string,
  startTime: TimeEntry,
  endTime: TimeEntry,
  existingShifts: Shift[] = [],
  currentShiftId?: string
): ValidationResult {
  const errors: string[] = [];

  // Validate date is not empty
  if (!date) {
    errors.push("Date is required");
  }

  // Convert times to minutes for comparison
  const startMinutes = startTime.hours * 60 + startTime.minutes;
  const endMinutes = endTime.hours * 60 + endTime.minutes;

  // Validate end time is after start time
  if (endMinutes <= startMinutes) {
    errors.push("End time must be after start time");
  }

  // Validate maximum shift duration (16 hours)
  const shiftDuration = endMinutes - startMinutes;
  if (shiftDuration > 16 * 60) {
    errors.push("Shift duration cannot exceed 16 hours");
  }

  // Check for overlapping shifts
  const shiftDate = new Date(date);
  const overlappingShift = existingShifts.find((shift) => {
    // Skip current shift when editing
    if (currentShiftId && shift.id === currentShiftId) {
      return false;
    }

    const existingDate = new Date(shift.date);
    if (
      existingDate.getFullYear() === shiftDate.getFullYear() &&
      existingDate.getMonth() === shiftDate.getMonth() &&
      existingDate.getDate() === shiftDate.getDate()
    ) {
      const existingStart = shift.startTime.hours * 60 + shift.startTime.minutes;
      const existingEnd = shift.endTime.hours * 60 + shift.endTime.minutes;

      // Check if shifts overlap
      return (
        (startMinutes >= existingStart && startMinutes < existingEnd) ||
        (endMinutes > existingStart && endMinutes <= existingEnd) ||
        (startMinutes <= existingStart && endMinutes >= existingEnd)
      );
    }
    return false;
  });

  if (overlappingShift) {
    errors.push("This shift overlaps with an existing shift");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
