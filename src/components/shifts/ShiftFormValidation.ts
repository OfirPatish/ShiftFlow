import { UseFormSetError, UseFormClearErrors } from 'react-hook-form';
import { parseISO, isAfter, addDays, format } from 'date-fns';
import { ShiftFormData } from '@/types/shifts';

// Validate date and time inputs
export const validateDateTimeInputs = (
  startDate: string,
  startTime: string,
  endTime: string,
  setError: UseFormSetError<ShiftFormData>,
  clearErrors: UseFormClearErrors<ShiftFormData>,
  setDateError: (error: string | null) => void,
  dateWarning: string | null
): boolean => {
  // Note: Additional server-side validation will prevent creating shifts
  // on the same day to ensure shifts are spread across different calendar days.

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

  // Check if we have a date warning (existing shift on this day)
  if (dateWarning) {
    setDateError(dateWarning);
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

    // Verify end time is after start time
    if (endTotalMinutes <= startTotalMinutes) {
      setError('endTime', {
        message: 'End time must be after start time',
      });
      return false;
    }

    // Check if the shift is very short (less than 15 minutes)
    if (Math.abs(endTotalMinutes - startTotalMinutes) < 15) {
      setError('endTime', {
        message: 'Shift is less than 15 minutes. Please verify the times.',
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
  endTime: string
): ShiftFormData => {
  // Set the combined datetime values before submission
  let data = {
    ...formData,
    startTime: combineDateTime(startDate, startTime),
    endTime: combineDateTime(startDate, endTime),
  };

  return data;
};
