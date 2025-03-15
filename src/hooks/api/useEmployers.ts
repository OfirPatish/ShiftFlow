import { useState, useEffect, useCallback } from 'react';
import { showErrorToast } from '@/lib/utils/notificationToasts';
import { Employer, EmployerFormData } from '@/types/models/employers';
import { logError } from '@/lib/validation/errorHandlers';

export function useEmployers() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all employers
  const fetchEmployers = useCallback(async () => {
    if (isSubmitting) return; // Prevent fetching while submitting
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/employers');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch employers');
      }

      const data = await response.json();
      setEmployers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logError('Employers:Fetch', err);
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isSubmitting]);

  // Fetch a single employer by ID
  const fetchEmployerById = async (employerId: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/employers/${employerId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch employer');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logError('Employers:FetchById', err);
      throw err;
    }
  };

  // Create a new employer
  const createEmployer = async (formData: EmployerFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/employers', {
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
        throw new Error(errorData.error || 'Failed to create employer');
      }

      const newEmployer = await response.json();
      setEmployers((prevEmployers) => [...prevEmployers, newEmployer]);
      return newEmployer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logError('Employers:Create', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update an existing employer
  const updateEmployer = async (id: string, formData: Partial<EmployerFormData>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/employers/${id}`, {
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
        throw new Error(errorData.error || 'Failed to update employer');
      }

      const updatedEmployer = await response.json();
      setEmployers((prevEmployers) =>
        prevEmployers.map((employer) => (employer._id === id ? updatedEmployer : employer))
      );
      return updatedEmployer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logError('Employers:Update', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an employer
  const deleteEmployer = async (id: string) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/employers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete employer');
      }

      setEmployers((prevEmployers) => prevEmployers.filter((employer) => employer._id !== id));
      return true;
    } catch (err) {
      logError('Employers:Delete', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load employers on component mount
  useEffect(() => {
    fetchEmployers();
  }, [fetchEmployers]);

  return {
    employers,
    isLoading,
    isSubmitting,
    error,
    fetchEmployers,
    fetchEmployerById,
    createEmployer,
    updateEmployer,
    deleteEmployer,
  };
}
