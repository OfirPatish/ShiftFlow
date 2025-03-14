import { UseFormSetError, UseFormClearErrors } from 'react-hook-form';
import { addDays, format } from 'date-fns';
import { ShiftFormData } from '@/hooks/useShifts';

// Validate date and time inputs
export const validateDateTimeInputs = (
  startDate: string,
  startTime: string,
  endTime: string,
  isOvernightShift: boolean,
  setError: UseFormSetError<ShiftFormData>,
  clearErrors: UseFormClearErrors<ShiftFormData>,
  setDateError: (error: string | null) => void
): boolean => {
  clearErrors();
  let hasErrors = false;

  // Validate required fields
  if (!startDate) {
    setDateError('Date is required');
    hasErrors = true;
  }

  if (!startTime) {
    setError('startTime', { message: 'Start time is required' });
    hasErrors = true;
  }

  if (!endTime) {
    setError('endTime', { message: 'End time is required' });
    hasErrors = true;
  }

  // If we already have basic validation errors, return early
  if (hasErrors) {
    return false;
  }

  // Validate start time is before end time
  if (startTime && endTime) {
    const [startHour, startMinute] = startTime.split(':').map((num) => parseInt(num, 10));
    const [endHour, endMinute] = endTime.split(':').map((num) => parseInt(num, 10));
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    // Check if the end time is exactly the same as start time
    if (startTotalMinutes === endTotalMinutes) {
      setError('endTime', { message: 'End time must be different from start time' });
      return false;
    }

    // For overnight shifts, we allow end time to be before or after start time
    // For non-overnight shifts, verify end time is after start time
    if (!isOvernightShift && endTotalMinutes <= startTotalMinutes) {
      setError('endTime', {
        message: 'End time must be after start time or check "Overnight Shift"',
      });
      return false;
    }
  }

  return true;
};

// Combine date and time into a single datetime string
export const combineDateTime = (date: string, time: string): string => {
  if (!date || !time) return '';
  return `${date}T${time}`;
};

// Process form data for submission
export const processFormData = (
  formData: ShiftFormData,
  startDate: string,
  startTime: string,
  endTime: string,
  isOvernightShift: boolean
): ShiftFormData => {
  // Set the combined datetime values before submission
  let data = {
    ...formData,
    startTime: combineDateTime(startDate, startTime),
    endTime: combineDateTime(startDate, endTime),
  };

  // For overnight shifts, adjust the end time to be on the next day
  if (isOvernightShift && startTime && endTime) {
    // Get start and end hour/minute values
    const [startHour, startMinute] = startTime.split(':').map((num) => parseInt(num, 10));
    const [endHour, endMinute] = endTime.split(':').map((num) => parseInt(num, 10));

    // Create proper date objects for comparison
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(startDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    // Always add one day for overnight shifts
    const nextDayEndDate = addDays(endDateTime, 1);

    // Update the endTime with the next day date
    data.endTime = format(nextDayEndDate, "yyyy-MM-dd'T'HH:mm");
  }

  return data;
};
