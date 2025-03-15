import { useState, useEffect, useCallback } from 'react';
import { showErrorToast } from '@/lib/utils/notificationToasts';
import { logError } from '@/lib/validation/errorHandlers';
import { Rate, RateFormData } from '@/types/models/rates';

export function useRates(employerId?: string) {
  const [rates, setRates] = useState<Rate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch rates with optional employer filter
  const fetchRates = useCallback(
    async (forEmployerId?: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Use the provided employerId or the one from the hook
        const filterEmployerId = forEmployerId || employerId;

        // Build URL with query parameters if employer filter is provided
        let url = '/api/rates';
        if (filterEmployerId) {
          url += `?employerId=${filterEmployerId}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch rates');
        }

        const data = await response.json();
        setRates(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        logError('Rates:Fetch', err);
        showErrorToast(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [employerId]
  );

  // Fetch a single rate by ID
  const fetchRateById = async (rateId: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/rates/${rateId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch rate');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logError('Rates:FetchById', err);
      throw err;
    }
  };

  // Create a new rate
  const createRate = async (formData: RateFormData) => {
    try {
      setError(null);

      const response = await fetch('/api/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData.error?.includes('already exists')) {
          throw new Error(`${errorData.error}. Please use a different name.`);
        }
        throw new Error(errorData.error || 'Failed to create rate');
      }

      const newRate = await response.json();

      setRates((prevRates) => {
        if (newRate.isDefault) {
          return [
            ...prevRates.map((rate) =>
              rate.employerId === newRate.employerId && rate._id !== newRate._id
                ? { ...rate, isDefault: false }
                : rate
            ),
            newRate,
          ];
        }
        return [...prevRates, newRate];
      });

      return newRate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logError('Rates:Create', err);
      throw err;
    }
  };

  // Update an existing rate
  const updateRate = async (id: string, formData: Partial<RateFormData>) => {
    try {
      setError(null);

      if (formData.isDefault === false) {
        const existingRate = rates.find((r) => r._id === id);
        if (existingRate?.isDefault) {
          const defaultRates = rates.filter(
            (r) => r.employerId === existingRate.employerId && r.isDefault
          );

          if (defaultRates.length <= 1) {
            throw new Error(
              'Cannot unset the only default rate. Set another rate as default first.'
            );
          }
        }
      }

      const response = await fetch(`/api/rates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData.error?.includes('already exists')) {
          throw new Error(`${errorData.error}. Please use a different name.`);
        }
        throw new Error(errorData.error || 'Failed to update rate');
      }

      const updatedRate = await response.json();

      setRates((prevRates) => {
        if (updatedRate.isDefault) {
          return prevRates.map((rate) =>
            rate._id === id
              ? updatedRate
              : rate.employerId === updatedRate.employerId
              ? { ...rate, isDefault: false }
              : rate
          );
        }
        return prevRates.map((rate) => (rate._id === id ? updatedRate : rate));
      });

      return updatedRate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logError('Rates:Update', err);
      throw err;
    }
  };

  // Delete a rate
  const deleteRate = async (id: string) => {
    try {
      setError(null);
      setIsSubmitting(true);

      const rateToDelete = rates.find((rate) => rate._id === id);
      if (!rateToDelete) {
        throw new Error('Rate not found');
      }

      // Check if this is a default rate and if there are other rates for the same employer
      if (rateToDelete.isDefault) {
        const otherRates = rates.filter(
          (rate) => rate.employerId === rateToDelete.employerId && rate._id !== id
        );

        if (otherRates.length === 0) {
          throw new Error('Cannot delete the only rate for this employer');
        }

        // Make another rate the default before deleting this one
        const newDefaultRate = otherRates[0];
        await updateRate(newDefaultRate._id, { isDefault: true });
      }

      const response = await fetch(`/api/rates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete rate');
      }

      // Clear the default rate setting if this was the default rate
      if (rateToDelete.isDefault) {
        await fetch('/api/settings', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ defaultRateId: null }),
        });
      }

      // Update local state
      setRates((prevRates) => prevRates.filter((rate) => rate._id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logError('Rates:Delete', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [fetchRates, employerId]);

  return {
    rates,
    isLoading,
    error,
    isSubmitting,
    fetchRates,
    fetchRateById,
    createRate,
    updateRate,
    deleteRate,
  };
}
