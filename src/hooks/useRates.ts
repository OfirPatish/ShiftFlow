import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { showErrorToast } from '@/lib/notificationToasts';
import { logError } from '@/lib/errorHandlers';
import { Rate, RateFormData } from '@/types/rates';

export function useRates(employerId?: string) {
  const [rates, setRates] = useState<Rate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        // Toast notifications for user-facing errors
        showErrorToast(errorMessage);
        console.error('Error fetching rates:', err);
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
      // Log the error but don't show toast as the caller is expected to handle the error display
      logError('Rates', err);
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
        // Check if this is a duplicate rate error
        if (response.status === 400 && errorData.error?.includes('already exists')) {
          throw new Error(`${errorData.error}. Please use a different name.`);
        }
        throw new Error(errorData.error || 'Failed to create rate');
      }

      const newRate = await response.json();

      // Update the local state with the new rate
      setRates((prevRates) => {
        // If the new rate is default, update any other rates for this employer
        if (newRate.isDefault) {
          return [
            ...prevRates.map((rate) =>
              rate.employerId === newRate.employerId && rate._id !== newRate._id
                ? { ...rate, isDefault: false }
                : rate
            ),
            newRate, // Add to the end (right side)
          ];
        }

        return [...prevRates, newRate]; // Add to the end (right side)
      });

      return newRate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      // Log the error but don't show toast as the caller is expected to handle the error display
      logError('Rates', err);
      throw err;
    }
  };

  // Update an existing rate
  const updateRate = async (id: string, formData: Partial<RateFormData>) => {
    try {
      setError(null);

      // If trying to unset a default rate, check if it's the only default rate
      if (formData.isDefault === false) {
        const existingRate = rates.find((r) => r._id === id);
        if (existingRate?.isDefault) {
          // Count how many default rates exist for this employer
          const defaultRates = rates.filter(
            (r) => r.employerId === existingRate.employerId && r.isDefault
          );

          // If this is the only default rate, prevent the update
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
        // Check if this is a duplicate rate error
        if (response.status === 400 && errorData.error?.includes('already exists')) {
          throw new Error(`${errorData.error}. Please use a different name.`);
        }
        throw new Error(errorData.error || 'Failed to update rate');
      }

      const updatedRate = await response.json();

      // Update the local state
      setRates((prevRates) => {
        // If the updated rate's default status changed, we need to update other rates
        if (updatedRate.isDefault) {
          return prevRates.map((rate) =>
            rate._id === id
              ? updatedRate
              : rate.employerId === updatedRate.employerId
              ? { ...rate, isDefault: false }
              : rate
          );
        } else {
          return prevRates.map((rate) => (rate._id === id ? updatedRate : rate));
        }
      });

      return updatedRate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      // We don't show toast here as the caller is expected to handle the error display
      console.error('Error updating rate:', err);
      throw err;
    }
  };

  // Delete a rate
  const deleteRate = async (id: string) => {
    try {
      setError(null);

      // Find the rate to check if it's default
      const rateToDelete = rates.find((rate) => rate._id === id);

      // Prevent deleting default rates (double-check on client-side)
      if (rateToDelete?.isDefault) {
        throw new Error('Cannot delete default rate');
      }

      const response = await fetch(`/api/rates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete rate');
      }

      // Update the local state by filtering out the deleted rate
      setRates((prevRates) => prevRates.filter((rate) => rate._id !== id));

      return true;
    } catch (err) {
      // Don't set error state for validation errors, just throw them
      console.error('Error deleting rate:', err);
      throw err;
    }
  };

  // Load rates on component mount or when employerId changes
  useEffect(() => {
    fetchRates();
  }, [fetchRates, employerId]);

  return {
    rates,
    isLoading,
    error,
    fetchRates,
    fetchRateById,
    createRate,
    updateRate,
    deleteRate,
  };
}
