import React, { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Shift, ShiftFormData } from '@/hooks/useShifts';
import { ReactNode } from 'react';
import { FormInput } from '@/components/ui/FormInput';
import { TextArea } from '@/components/ui/TextArea';
import { Check, Trash2 } from 'lucide-react';
import { TimeInput } from '@/components/ui/TimeInput';
import { Button } from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useEmployers } from '@/hooks/useEmployers';
import { useSettings } from '@/hooks/useSettings';
import { format, isBefore, parseISO } from 'date-fns';

interface ShiftFormProps {
  shift?: Shift;
  onSubmit: (data: ShiftFormData) => Promise<void>;
  onCancel?: () => void;
  onDelete?: (shiftId: string) => void;
  initialDate?: Date;
  isSubmitting?: boolean;
}

export default function ShiftForm({
  shift,
  onSubmit,
  onCancel,
  onDelete,
  initialDate,
  isSubmitting: externalIsSubmitting = false,
}: ShiftFormProps) {
  const { employers, isLoading: loadingEmployers } = useEmployers();
  const { defaultEmployerId, defaultRateId } = useSettings();
  const [rates, setRates] = useState<any[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Format date and time for the form
  const [startDate, setStartDate] = useState<string>(() => {
    if (shift && shift.startTime) {
      return format(new Date(shift.startTime), 'yyyy-MM-dd');
    } else if (initialDate) {
      return format(initialDate, 'yyyy-MM-dd');
    }
    return '';
  });

  const [startTime, setStartTime] = useState<string>(
    shift && shift.startTime ? format(new Date(shift.startTime), 'HH:mm') : ''
  );

  const [endTime, setEndTime] = useState<string>(
    shift && shift.endTime ? format(new Date(shift.endTime), 'HH:mm') : ''
  );

  // Date validation error state
  const [dateError, setDateError] = useState<string | null>(null);

  // Initialize the form with defaults or existing shift data
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    setError,
  } = useForm<ShiftFormData>({
    defaultValues: {
      // If editing a shift, use its values, otherwise use user defaults
      employerId:
        shift && shift.employerId
          ? typeof shift.employerId === 'object' && shift.employerId
            ? shift.employerId._id
            : (shift.employerId as string)
          : defaultEmployerId || '',
      rateId:
        shift && shift.rateId
          ? typeof shift.rateId === 'object' && shift.rateId
            ? shift.rateId._id
            : (shift.rateId as string)
          : defaultRateId || '',
      notes: shift?.notes || '',
    },
    mode: 'onChange',
  });

  const watchEmployerId = watch('employerId');

  // Auto-select default employer or first employer if creating new shift
  useEffect(() => {
    if (!shift && employers.length > 0 && !watchEmployerId) {
      // Priority: 1. User default employer from settings, 2. First employer in list
      setValue('employerId', defaultEmployerId || employers[0]._id);
    }
  }, [employers, shift, setValue, watchEmployerId, defaultEmployerId]);

  // Fetch rates when employer changes
  useEffect(() => {
    if (!watchEmployerId) {
      setRates([]);
      return;
    }

    const fetchRates = async () => {
      try {
        setRatesLoading(true);
        const response = await fetch(`/api/rates?employerId=${watchEmployerId}`);

        if (response.ok) {
          const data = await response.json();
          setRates(data);

          // Only auto-select rate if creating a new shift and no rate is selected yet
          if (!shift && data.length > 0 && !watch('rateId')) {
            // Check if user's default rate exists and belongs to this employer
            const userDefaultRate = defaultRateId
              ? data.find((rate: any) => rate._id === defaultRateId)
              : null;

            // Find employer's default rate
            const employerDefaultRate = data.find((rate: any) => rate.isDefault);

            // Set the most appropriate rate
            setValue('rateId', userDefaultRate?._id || employerDefaultRate?._id || data[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching rates:', error);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchRates();
  }, [watchEmployerId, setValue, shift, defaultRateId, watch]);

  // Combine date and time into a single datetime string
  const combineDateTime = (date: string, time: string): string => {
    if (!date || !time) return '';
    return `${date}T${time}`;
  };

  // Handler for date changes to clear errors when user fixes the input
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);

    // Clear date error when user enters a valid date
    if (value) {
      setDateError(null);
    } else {
      setDateError('Date is required');
    }
  };

  // Form submission handler
  const onFormSubmit = handleSubmit(async (formData) => {
    try {
      setApiError(null);
      clearErrors();
      setIsSubmitting(true);

      // Validate required fields
      let hasErrors = false;

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

      if (hasErrors) {
        setIsSubmitting(false);
        return;
      }

      // Set the combined datetime values before submission
      const data = {
        ...formData,
        startTime: combineDateTime(startDate, startTime),
        endTime: combineDateTime(startDate, endTime),
      };

      // Validate start time is before end time
      if (startTime && endTime) {
        const startDateTime = parseISO(data.startTime as string);
        const endDateTime = parseISO(data.endTime as string);

        if (!isBefore(startDateTime, endDateTime)) {
          setError('endTime', { message: 'End time must be after start time' });
          setIsSubmitting(false);
          return;
        }
      }

      await onSubmit(data);
    } catch (error: any) {
      setApiError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (shift && onDelete) {
      onDelete(shift._id);
    }
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      {/* Display API errors if any */}
      <ErrorMessage message={apiError} />

      <div className="space-y-6">
        {/* Hidden employer and rate fields */}
        <input type="hidden" {...register('employerId')} />
        <input type="hidden" {...register('rateId')} />

        {/* Date Input */}
        <FormInput
          label="Shift Date"
          type="date"
          id="shiftDate"
          value={startDate}
          onChange={handleDateChange}
          error={!!dateError}
          helperText={dateError || ''}
        />

        {/* Time Inputs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Start Time */}
          <TimeInput
            label="Start Time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            error={!!errors.startTime}
            helperText={errors.startTime ? 'Start time is required' : ''}
            required
          />

          {/* End Time */}
          <TimeInput
            label="End Time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            error={!!errors.endTime}
            helperText={
              errors.endTime ? errors.endTime.message?.toString() || 'End time is required' : ''
            }
            required
          />
        </div>

        {/* Notes */}
        <TextArea
          label="Notes (Optional)"
          id="notes"
          rows={3}
          placeholder="Any additional details about this shift"
          {...register('notes')}
        />

        {/* Form action buttons */}
        <div className="flex justify-end pt-4 mt-6 border-t border-gray-700/50">
          {/* Right side buttons */}
          <div className="flex space-x-3">
            {/* Delete button - only show when editing an existing shift */}
            {shift && onDelete && (
              <Button
                type="button"
                onClick={handleDeleteClick}
                variant="danger"
                disabled={isSubmitting || externalIsSubmitting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || externalIsSubmitting}
              isLoading={isSubmitting || externalIsSubmitting}
            >
              {!(isSubmitting || externalIsSubmitting) && <Check className="h-4 w-4 mr-2" />}
              {shift ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
