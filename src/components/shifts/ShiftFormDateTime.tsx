import React, { useEffect } from 'react';
import { DatePicker } from '@/components/ui/forms/DatePicker';
import { TimePicker } from '@/components/ui/forms/TimePicker';
import { UseFormClearErrors, FieldErrors } from 'react-hook-form';
import { ShiftFormData } from '@/types/models/shifts';

interface ShiftFormDateTimeProps {
  startDate: string;
  setStartDate: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  dateError: string | null;
  setDateError: (error: string | null) => void;
  errors: FieldErrors<ShiftFormData>;
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
  dateError,
  setDateError,
  errors,
  clearErrors,
  isEditMode,
}) => {
  // Clear errors in edit mode
  useEffect(() => {
    if (isEditMode) {
      setDateError(null);
    }
  }, [isEditMode, setDateError]);

  return (
    <>
      {/* Date Input */}
      <DatePicker
        label="Shift Date"
        id="shiftDate"
        value={startDate}
        onChange={(value: string) => {
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
        <TimePicker
          label="Start Time"
          id="startTime"
          value={startTime}
          onChange={(value: string) => {
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
        <TimePicker
          label="End Time"
          id="endTime"
          value={endTime}
          onChange={(value: string) => {
            setEndTime(value);
            // Clear any time-related errors when user updates the time
            clearErrors('endTime');
          }}
          error={!!errors.endTime}
          helperText={errors.endTime?.message || ''}
          required
        />
      </div>
    </>
  );
};
