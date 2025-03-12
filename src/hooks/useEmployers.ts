import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { showErrorToast } from '@/lib/notificationToasts';

export interface Employer {
  _id: string;
  name: string;
  location?: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerFormData {
  name: string;
  location?: string;
  color?: string;
}

export function useEmployers() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch all employers
  const fetchEmployers = useCallback(async () => {
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
      // Show toast notification for user-facing errors
      showErrorToast(errorMessage);
      console.error('Error fetching employers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new employer
  const createEmployer = async (formData: EmployerFormData) => {
    try {
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
        throw new Error(errorData.error || 'Failed to create employer');
      }

      const newEmployer = await response.json();

      // Update the local state with the new employer
      setEmployers((prevEmployers) => [...prevEmployers, newEmployer]);

      return newEmployer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      // We don't show toast here as the caller is expected to handle the error display
      console.error('Error creating employer:', err);
      throw err;
    }
  };

  // Update an existing employer
  const updateEmployer = async (id: string, formData: Partial<EmployerFormData>) => {
    try {
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
        throw new Error(errorData.error || 'Failed to update employer');
      }

      const updatedEmployer = await response.json();

      // Update the local state
      setEmployers((prevEmployers) =>
        prevEmployers.map((employer) => (employer._id === id ? updatedEmployer : employer))
      );

      return updatedEmployer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      // We don't show toast here as the caller is expected to handle the error display
      console.error('Error updating employer:', err);
      throw err;
    }
  };

  // Delete an employer (soft delete)
  const deleteEmployer = async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/employers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Just throw the error without setting the error state
        // This way it will be caught by the component using a toast
        throw new Error(errorData.error || 'Failed to delete employer');
      }

      // Update the local state by filtering out the deleted employer
      setEmployers((prevEmployers) => prevEmployers.filter((employer) => employer._id !== id));

      return true;
    } catch (err) {
      // Don't set the error state for validation errors, just rethrow them
      console.error('Error deleting employer:', err);
      throw err;
    }
  };

  // Load employers on component mount
  useEffect(() => {
    fetchEmployers();
  }, [fetchEmployers]);

  return {
    employers,
    isLoading,
    error,
    fetchEmployers,
    createEmployer,
    updateEmployer,
    deleteEmployer,
  };
}
