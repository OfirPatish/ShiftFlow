import React from 'react';
import { DatePickerWheel } from '@/components/ui/DatePickerWheel';
import { TimePickerWheel } from '@/components/ui/TimePickerWheel';
import { UseFormClearErrors } from 'react-hook-form';
import { ShiftFormData } from '@/hooks/useShifts';

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
}) => {
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
        error={!!dateError}
        helperText={dateError || ''}
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
          helperText={errors.startTime ? 'Start time is required' : ''}
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
          helperText={
            errors.endTime ? errors.endTime.message?.toString() || 'End time is required' : ''
          }
          required
        />
      </div>

      {/* Overnight Shift Checkbox */}
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="overnightShift"
          checked={isOvernightShift}
          onChange={(e) => {
            setIsOvernightShift(e.target.checked);
            // Clear end time errors when overnight status changes
            clearErrors('endTime');
          }}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded bg-gray-700"
        />
        <label htmlFor="overnightShift" className="ml-2 block text-sm text-gray-300">
          Overnight Shift (ends the next day)
        </label>
      </div>
    </>
  );
};
