import React, { useEffect, useState, useRef } from 'react';
import { DatePickerWheel } from '@/components/ui/DatePickerWheel';
import { TimePickerWheel } from '@/components/ui/TimePickerWheel';
import { UseFormClearErrors } from 'react-hook-form';
import { ShiftFormData } from '@/types/shifts';
import { startOfDay, endOfDay } from 'date-fns';

interface ShiftFormDateTimeProps {
  startDate: string;
  setStartDate: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  isOvernightShift: boolean;
  setIsOvernightShift: (value: boolean) => void;
  dateError: string | null;
  setDateError: (error: string | null) => void;
  errors: any;
  clearErrors: UseFormClearErrors<ShiftFormData>;
  isEditMode: boolean;
}

export const ShiftFormDateTime: React.FC<ShiftFormDateTimeProps> = ({
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isOvernightShift,
  setIsOvernightShift,
  dateError,
  setDateError,
  errors,
  clearErrors,
  isEditMode,
}) => {
  const [dateWarning, setDateWarning] = useState<string | null>(null);
  const warningRef = useRef<HTMLInputElement>(null);

  // Check if a shift already exists on the selected date
  useEffect(() => {
    // Skip this check if we're in edit mode
    if (isEditMode) {
      setDateWarning(null);
      setDateError(null); // Also clear any date errors when in edit mode
      return;
    }

    const checkExistingShifts = async () => {
      if (!startDate) return;

      // Convert the date string to a Date object
      const date = new Date(startDate);
      if (isNaN(date.getTime())) return;

      // Create start and end of day for the selected date
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      try {
        // Build URL with query parameters
        const params = new URLSearchParams();
        params.append('startDate', dayStart.toISOString());
        params.append('endDate', dayEnd.toISOString());

        const response = await fetch(`/api/shifts?${params.toString()}`);

        if (response.ok) {
          const shifts = await response.json();

          if (Array.isArray(shifts) && shifts.length > 0) {
            const warning =
              'You already have a shift on this day. Only one shift per day is allowed.';
            setDateWarning(warning);
            setDateError(warning); // Immediately set the error to prevent form submission
          } else {
            setDateWarning(null);
            // Only clear the error if it was related to an existing shift
            if (dateError && dateError.includes('already have a shift on this day')) {
              setDateError(null);
            }
          }
        }
      } catch (error) {
        console.error('Error checking for existing shifts:', error);
      }
    };

    checkExistingShifts();
  }, [startDate, isEditMode, dateError, setDateError]);

  return (
    <>
      {/* Date Input */}
      <DatePickerWheel
        label="Shift Date"
        id="shiftDate"
        value={startDate}
        onChange={(value) => {
          setStartDate(value);
          // Clear date error when user enters a valid date
          if (value) {
            setDateError(null);
          } else {
            setDateError('Date is required');
          }
        }}
        error={!!dateError || !!dateWarning}
        helperText={dateError || dateWarning || ''}
        required
      />

      {/* Time Inputs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Start Time */}
        <TimePickerWheel
          label="Start Time"
          id="startTime"
          value={startTime}
          onChange={(value) => {
            setStartTime(value);
            // Clear any time-related errors when user updates the time
            clearErrors('startTime');
            clearErrors('endTime'); // Clear end time errors too as the relationship has changed
          }}
          error={!!errors.startTime}
          helperText={errors.startTime?.message || ''}
          required
        />

        {/* End Time */}
        <TimePickerWheel
          label="End Time"
          id="endTime"
          value={endTime}
          onChange={(value) => {
            setEndTime(value);
            // Clear any time-related errors when user updates the time
            clearErrors('endTime');
          }}
          error={!!errors.endTime}
          helperText={errors.endTime?.message || ''}
          required
        />
      </div>

      {/* Overnight Shift Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="overnightShift"
          checked={isOvernightShift}
          onChange={(e) => {
            setIsOvernightShift(e.target.checked);
            // Clear any time-related errors when overnight setting changes
            clearErrors('endTime');
          }}
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="overnightShift" className="text-sm text-gray-600">
          Overnight Shift (if end time is before start time)
        </label>
      </div>
    </>
  );
};
