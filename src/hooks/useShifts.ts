import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { handleApiError, logError } from '@/lib/errorHandlers';
import { handleClientApiError } from '@/lib/apiResponses';

export interface Shift {
  _id: string;
  userId: string;
  employerId:
    | string
    | {
        _id: string;
        name: string;
        color: string;
      };
  rateId:
    | string
    | {
        _id: string;
        baseRate: number;
        currency: string;
      };
  startTime: string | Date;
  endTime: string | Date;
  breakDuration: number;
  notes?: string;
  regularHours: number;
  overtimeHours1: number;
  overtimeHours2: number;
  totalHours: number;
  regularEarnings: number;
  overtimeEarnings1: number;
  overtimeEarnings2: number;
  totalEarnings: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftFormData {
  employerId: string;
  rateId: string;
  startTime: string | Date;
  endTime: string | Date;
  breakDuration?: number;
  notes?: string;
}

export interface ShiftFilters {
  startDate?: Date;
  endDate?: Date;
  employerId?: string;
}

export function useShifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch shifts with optional filters
  const fetchShifts = useCallback(async (filters?: ShiftFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      let url = '/api/shifts';

      // Add filters to URL if provided
      if (filters) {
        const params = new URLSearchParams();

        if (filters.startDate) {
          params.append('startDate', filters.startDate.toISOString());
        }

        if (filters.endDate) {
          params.append('endDate', filters.endDate.toISOString());
        }

        if (filters.employerId) {
          params.append('employerId', filters.employerId);
        }

        // Append parameters to URL if any exist
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      // Add retry logic for network issues
      let retries = 3;
      let response;

      while (retries > 0) {
        try {
          response = await fetch(url);
          break; // Exit the loop if fetch succeeds
        } catch (fetchError) {
          retries--;
          if (retries === 0) throw fetchError; // Re-throw if all retries failed
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }

      if (!response || !response.ok) {
        const errorMessage = await handleClientApiError(response!);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      // Validate data structure before setting state
      if (Array.isArray(data)) {
        setShifts(data);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logError('fetchShifts', err, true); // Log and show toast
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch a single shift by ID
  const fetchShiftById = async (shiftId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/shifts/${shiftId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch shift: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching shift:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new shift
  const createShift = async (formData: ShiftFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Process API error, which might contain toast instructions
        const errorMessage = await handleClientApiError(response);
        throw new Error(errorMessage);
      }

      const newShift = await response.json();

      // Don't update local state - force a refresh to ensure we get fully populated data
      // Instead of: setShifts((prevShifts) => [newShift, ...prevShifts]);

      // Determine month of the new shift for refreshing data
      const shiftDate = new Date(newShift.startTime);
      await fetchShifts({
        startDate: new Date(shiftDate.getFullYear(), shiftDate.getMonth(), 1),
        endDate: new Date(shiftDate.getFullYear(), shiftDate.getMonth() + 1, 0),
      });

      return newShift;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);

      // We don't always want to show a toast here as the form will display the error
      // Only log the error without showing a toast
      logError('createShift', err, false);

      throw err; // Re-throw the error so the component can handle it
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing shift
  const updateShift = async (id: string, formData: Partial<ShiftFormData>) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/shifts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await handleClientApiError(response);
        throw new Error(errorMessage);
      }

      const updatedShift = await response.json();

      // Don't update local state - force a refresh to ensure we get fully populated data
      // Instead of: setShifts((prevShifts) =>
      //   prevShifts.map((shift) => (shift._id === id ? updatedShift : shift))
      // );

      // Determine month of the updated shift for refreshing data
      const shiftDate = new Date(updatedShift.startTime);
      await fetchShifts({
        startDate: new Date(shiftDate.getFullYear(), shiftDate.getMonth(), 1),
        endDate: new Date(shiftDate.getFullYear(), shiftDate.getMonth() + 1, 0),
      });

      return updatedShift;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);

      // We don't always want to show a toast here as the form will display the error
      // Only log the error without showing a toast
      logError('updateShift', err, false);

      throw err; // Re-throw the error so the component can handle it
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a shift
  const deleteShift = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/shifts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete shift: ${response.status}`);
      }

      // Update the local state by filtering out the deleted shift
      setShifts((prevShifts) => prevShifts.filter((shift) => shift._id !== id));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error deleting shift:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load shifts on component mount
  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  return {
    shifts,
    isLoading,
    error,
    fetchShifts,
    fetchShiftById,
    createShift,
    updateShift,
    deleteShift,
  };
}
