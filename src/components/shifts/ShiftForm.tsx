import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Shift, ShiftFormData } from '@/types/models/shifts';
import { TextArea } from '@/components/ui/forms/TextArea';
import { useSettings } from '@/hooks/api/useSettings';
import { format } from 'date-fns';
import { ShiftFormDateTime } from './ShiftFormDateTime';
import { ShiftFormActions } from './ShiftFormActions';
import { validateDateTimeInputs, processFormData } from './ShiftFormValidation';
import { toast } from 'react-hot-toast';

interface ShiftFormProps {
  shift?: Shift;
  onSubmit: (data: ShiftFormData) => Promise<void>;
  onDelete?: (shiftId: string) => void;
  initialDate?: Date;
  isSubmitting?: boolean;
}

export default function ShiftForm({
  shift,
  onSubmit,
  onDelete,
  initialDate,
  isSubmitting: externalIsSubmitting = false,
}: ShiftFormProps) {
  const { defaultEmployerId, defaultRateId, isLoading: settingsLoading } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [formInitialized, setFormInitialized] = useState(false);

  // Format date and time for the form
  const [startDate, setStartDate] = useState<string>(() => {
    if (shift && shift.startTime) {
      return format(new Date(shift.startTime), 'yyyy-MM-dd');
    } else if (initialDate) {
      return format(initialDate, 'yyyy-MM-dd');
    }
    return format(new Date(), 'yyyy-MM-dd');
  });

  const [startTime, setStartTime] = useState<string>(
    shift && shift.startTime
      ? format(new Date(shift.startTime), 'HH:mm')
      : format(new Date(), 'HH:mm')
  );

  const [endTime, setEndTime] = useState<string>(
    shift && shift.endTime ? format(new Date(shift.endTime), 'HH:mm') : format(new Date(), 'HH:mm')
  );

  // Date validation error state
  const [dateError, setDateError] = useState<string | null>(null);

  // Initialize the form with defaults or existing shift data
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    setValue,
  } = useForm<ShiftFormData>({
    defaultValues: {
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
  });

  // Update form values when settings are loaded
  useEffect(() => {
    if (!settingsLoading && !shift && !formInitialized) {
      if (defaultEmployerId) {
        setValue('employerId', defaultEmployerId);
      }
      if (defaultRateId) {
        setValue('rateId', defaultRateId);
      }
      setFormInitialized(true);
    }
  }, [settingsLoading, defaultEmployerId, defaultRateId, setValue, shift, formInitialized]);

  // Form submission handler
  const onFormSubmit = handleSubmit(async (formData) => {
    try {
      setApiError(null);
      setIsSubmitting(true);

      if (dateError) {
        setIsSubmitting(false);
        return;
      }

      const isValid = validateDateTimeInputs(
        startDate,
        startTime,
        endTime,
        setError,
        clearErrors,
        setDateError,
        null
      );

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      const processedData = processFormData(formData, startDate, startTime, endTime);

      // Ensure required fields are present
      if (!processedData.employerId || !processedData.rateId) {
        toast.error('Please select an employer and rate');
        setIsSubmitting(false);
        return;
      }

      await onSubmit(processedData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      {apiError && (
        <div className="p-3 text-center">
          <p className="text-red-600 font-medium">{apiError}</p>
        </div>
      )}

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
          dateError={dateError}
          setDateError={setDateError}
          errors={errors}
          clearErrors={clearErrors}
          isEditMode={!!shift}
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
          isSubmitting={isSubmitting}
          externalIsSubmitting={externalIsSubmitting}
        />
      </div>
    </form>
  );
}
