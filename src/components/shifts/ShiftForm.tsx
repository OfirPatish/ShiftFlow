import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Shift, ShiftFormData } from '@/types/shifts';
import { TextArea } from '@/components/ui/TextArea';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useEmployers } from '@/hooks/useEmployers';
import { useSettings } from '@/hooks/useSettings';
import { format } from 'date-fns';

// Import new components and utilities
import { ShiftFormDateTime } from './ShiftFormDateTime';
import { ShiftFormActions } from './ShiftFormActions';
import { validateDateTimeInputs, processFormData } from './ShiftFormValidation';

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

  const [isOvernightShift, setIsOvernightShift] = useState<boolean>(() => {
    // If editing a shift, detect if it's overnight by checking if end time is earlier than start time
    if (shift && shift.startTime && shift.endTime) {
      const startDate = new Date(shift.startTime);
      const endDate = new Date(shift.endTime);

      const startHours = startDate.getHours();
      const startMinutes = startDate.getMinutes();
      const endHours = endDate.getHours();
      const endMinutes = endDate.getMinutes();

      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;

      return endTotalMinutes < startTotalMinutes;
    }
    return false;
  });

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
            // Always prioritize the user's selected rate from settings
            if (defaultRateId) {
              const userSelectedRate = data.find((rate: any) => rate._id === defaultRateId);
              if (userSelectedRate) {
                setValue('rateId', userSelectedRate._id);
                return;
              }
            }

            // If no user selected rate, fallback to employer's default rate
            const employerDefaultRate = data.find((rate: any) => rate.isDefault);
            setValue('rateId', employerDefaultRate?._id || data[0]._id);
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

  // Form submission handler
  const onFormSubmit = handleSubmit(async (formData) => {
    try {
      setApiError(null);
      setIsSubmitting(true);

      // Validate inputs using the extracted utility
      const isValid = validateDateTimeInputs(
        startDate,
        startTime,
        endTime,
        isOvernightShift,
        setError,
        clearErrors,
        setDateError
      );

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      // Process form data using the extracted utility
      const processedData = processFormData(
        formData,
        startDate,
        startTime,
        endTime,
        isOvernightShift
      );

      await onSubmit(processedData);
    } catch (error: any) {
      setApiError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      {/* Display API errors if any */}
      <ErrorMessage message={apiError} />

      <div className="space-y-6">
        {/* Hidden employer and rate fields */}
        <input type="hidden" {...register('employerId')} />
        <input type="hidden" {...register('rateId')} />

        {/* Date and Time Fields Component */}
        <ShiftFormDateTime
          startDate={startDate}
          setStartDate={setStartDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          isOvernightShift={isOvernightShift}
          setIsOvernightShift={setIsOvernightShift}
          dateError={dateError}
          setDateError={setDateError}
          errors={errors}
          clearErrors={clearErrors}
        />

        {/* Notes */}
        <TextArea
          label="Notes (Optional)"
          id="notes"
          rows={3}
          placeholder="Any additional details about this shift"
          {...register('notes')}
        />

        {/* Form action buttons */}
        <ShiftFormActions
          shift={shift}
          onDelete={onDelete}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          externalIsSubmitting={externalIsSubmitting}
        />
      </div>
    </form>
  );
}
