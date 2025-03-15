import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEmployers } from '@/hooks/api/useEmployers';
import { Rate, RateFormData } from '@/types/models/rates';
import { format } from 'date-fns';
import { Check, Trash2, Building2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/buttons/Button';
import LoadingSpinner from '@/components/core/feedback/LoadingSpinner';
import { getCurrencySymbol } from '@/lib/utils/currencyFormatter';
import { logError } from '@/lib/validation/errorHandlers';

interface RateFormProps {
  rate?: Rate;
  employerId?: string;
  onSubmit: (data: RateFormData) => Promise<void>;
  onDelete?: (rateId: string) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function RateForm({
  rate,
  employerId,
  onSubmit,
  onDelete,
  onCancel,
  isSubmitting = false,
}: RateFormProps) {
  const { employers, isLoading: loadingEmployers } = useEmployers();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RateFormData>({
    defaultValues: {
      employerId: rate ? rate.employerId : employerId || '',
      name: rate?.name || '',
      baseRate: rate?.baseRate || 0,
      currency: 'ILS',
      effectiveDate: format(new Date(), 'yyyy-MM-dd'),
      isDefault: rate?.isDefault || false,
    },
  });

  // Watch form values for UI updates
  const selectedEmployerId = watch('employerId');

  // Form submission handler
  const submitHandler = async (data: RateFormData) => {
    try {
      setIsLoading(true);
      data.effectiveDate = new Date();
      data.currency = 'ILS';
      await onSubmit(data);
    } catch (error) {
      logError('RateForm:Submit', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Find the selected employer for color display
  const selectedEmployer = employers.find((e) => e._id === selectedEmployerId);
  const employerColor = selectedEmployer?.color || '#3B82F6';

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* Form fields with improved styling */}
      <div className="space-y-5">
        {/* Employer selector - only show dropdown for new rates */}
        {!rate && !employerId && (
          <div className="relative">
            <label
              htmlFor="employerId"
              className="flex items-center text-sm font-medium text-gray-100 mb-1.5"
            >
              <Building2 className="h-4 w-4 mr-1.5" />
              Employer
            </label>
            <div className="relative">
              <select
                id="employerId"
                {...register('employerId', { required: 'Employer is required' })}
                className={`w-full bg-gray-800/80 border ${
                  errors.employerId ? 'border-red-500' : 'border-gray-700'
                } rounded-lg py-2.5 pl-4 pr-8 text-white appearance-none`}
                disabled={loadingEmployers}
              >
                <option value="">Select an employer</option>
                {employers.map((employer) => (
                  <option key={employer._id} value={employer._id}>
                    {employer.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3 pointer-events-none">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedEmployer ? employerColor : 'transparent' }}
                />
              </div>
            </div>
            {errors.employerId && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <span className="mr-1">•</span>
                {errors.employerId.message}
              </p>
            )}
          </div>
        )}

        {/* Display employer name as read-only when editing */}
        {(rate || employerId) && selectedEmployer && (
          <div className="relative">
            <label className="flex items-center text-sm font-medium text-gray-100 mb-1.5">
              <Building2 className="h-4 w-4 mr-1.5" />
              Employer
            </label>
            <div className="flex items-center p-2.5 bg-gray-800/60 border border-gray-700 rounded-lg">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: employerColor }}
              />
              <span className="text-white">{selectedEmployer.name}</span>
            </div>
          </div>
        )}

        {/* Rate name field */}
        <div>
          <label
            htmlFor="name"
            className="flex items-center text-sm font-medium text-gray-100 mb-1.5"
          >
            <Tag className="h-4 w-4 mr-1.5" />
            Rate Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="e.g., Standard Rate"
            {...register('name', { required: 'Rate name is required' })}
            className={`w-full bg-gray-800/80 border ${
              errors.name ? 'border-red-500' : 'border-gray-700'
            } rounded-lg py-2.5 px-4 text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <span className="mr-1">•</span>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Rate fields in a grid for better layout */}
        <div className="grid grid-cols-1 gap-5">
          {/* Base hourly rate field - centered container */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="baseRate"
              className="flex items-center justify-center text-sm font-medium text-gray-100 mb-1.5"
            >
              Base Hourly Rate ({getCurrencySymbol()})
            </label>
            <div className="relative w-full max-w-xs">
              <input
                type="number"
                id="baseRate"
                step="0.01"
                min="0"
                {...register('baseRate', {
                  required: 'Base rate is required',
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'Base rate cannot be negative',
                  },
                })}
                className={`w-full bg-gray-800/80 border ${
                  errors.baseRate ? 'border-red-500' : 'border-gray-700'
                } rounded-lg py-2.5 px-4 text-white text-center focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors text-xl font-medium`}
              />
              {errors.baseRate && (
                <p className="mt-1 text-sm text-red-500 flex items-center justify-center">
                  <span className="mr-1">•</span>
                  {errors.baseRate.message}
                </p>
              )}
            </div>
          </div>

          {/* Hidden currency field (always ILS) */}
          <input type="hidden" {...register('currency')} value="ILS" />
        </div>

        {/* Default rate toggle - disabled if already default */}
        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              id="isDefault"
              type="checkbox"
              {...register('isDefault')}
              disabled={rate?.isDefault}
              className={`focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-600 rounded bg-gray-700 ${
                rate?.isDefault ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="isDefault"
              className={`font-medium text-gray-300 ${
                rate?.isDefault ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              {rate?.isDefault ? 'Default rate' : 'Set as default rate'}
            </label>
            <p className="text-gray-500">
              {rate?.isDefault
                ? 'This is currently the default rate. Select another rate as default to change.'
                : 'This rate will be used by default for new shifts'}
            </p>
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-3">
        {onDelete && rate && (
          <Button
            type="button"
            variant="danger"
            onClick={() => onDelete(rate._id)}
            disabled={isLoading || rate.isDefault}
            className="flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isLoading} className="flex items-center">
          {isLoading ? <LoadingSpinner size="sm" /> : <Check className="h-4 w-4 mr-1.5" />}
          {rate ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
