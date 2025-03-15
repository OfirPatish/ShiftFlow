import { useState, useEffect } from 'react';
import { useShifts } from '@/hooks/api/useShifts';
import { Shift, ShiftFormData } from '@/types/models/shifts';
import { showSuccessToast, showErrorToast } from '@/lib/utils/notificationToasts';
import { startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { logError } from '@/lib/validation/errorHandlers';

export function useShiftManager() {
  const {
    shifts,
    isLoading: apiLoading,
    fetchShifts,
    createShift,
    updateShift,
    deleteShift,
  } = useShifts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShift, setCurrentShift] = useState<Shift | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);

  // Controlled loading state that ensures minimum display time
  const [isLoading, setIsLoading] = useState(true);
  const minLoadingTime = 1000; // 1 second

  // Fetch shifts when the selected month changes
  useEffect(() => {
    const currentMonthStart = startOfMonth(selectedMonth);
    const currentMonthEnd = endOfMonth(selectedMonth);

    fetchShifts({
      startDate: currentMonthStart,
      endDate: currentMonthEnd,
    }).catch((error) => {
      showErrorToast(`Failed to fetch shifts: ${error.message || 'Unknown error'}`);
    });
  }, [fetchShifts, selectedMonth]);

  // Handle loading state with minimum display time
  useEffect(() => {
    if (apiLoading) {
      setIsLoading(true);
    } else {
      // When API loading is done, wait for minimum display time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [apiLoading, minLoadingTime]);

  const handleAddShift = () => {
    setCurrentShift(undefined);
    setIsModalOpen(true);
  };

  const handleShiftClick = (shift: Shift) => {
    setCurrentShift(shift);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Only close the modal if the delete confirmation dialog is not open
    if (!isDeleteConfirmOpen) {
      setIsModalOpen(false);
      // Add a small delay before resetting currentShift to prevent UI flicker
      setTimeout(() => {
        setCurrentShift(undefined);
      }, 300); // 300ms matches transition duration
    }
  };

  // Handle month change with the new date object pattern
  const handleMonthChange = (dates: { start: Date; end: Date; current: Date }) => {
    setSelectedMonth(dates.current);
    fetchShifts({
      startDate: dates.start,
      endDate: dates.end,
    }).catch((error) => {
      logError('ShiftManager.handleMonthChange', error);
      showErrorToast('Failed to fetch shifts');
    });
  };

  const handleSubmitShift = async (data: ShiftFormData) => {
    try {
      setIsSubmitting(true);
      let newOrUpdatedShift;

      if (currentShift) {
        newOrUpdatedShift = await updateShift(currentShift._id, data);
        showSuccessToast('Shift updated successfully');
      } else {
        newOrUpdatedShift = await createShift(data);
        showSuccessToast('Shift created successfully');

        // Check if the new shift belongs to the currently selected month
        // If not, update the selected month to show the month containing the new shift
        if (newOrUpdatedShift && newOrUpdatedShift.startTime) {
          const shiftDate = new Date(newOrUpdatedShift.startTime);

          if (!isSameMonth(shiftDate, selectedMonth)) {
            setSelectedMonth(shiftDate);
          }
        }
      }

      // First close the modal
      setIsModalOpen(false);
      // Then reset current shift with a delay to prevent UI glitches
      setTimeout(() => {
        setCurrentShift(undefined);
      }, 300);
    } catch (error: any) {
      logError('ShiftManager:Submit', error);
      showErrorToast(`Failed to save shift: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteShift = async (shiftId: string) => {
    try {
      setIsSubmitting(true);
      await deleteShift(shiftId);
      setIsModalOpen(false);
      setCurrentShift(undefined);
    } catch (error: any) {
      logError('ShiftManager:Delete', error);
      showErrorToast(`Failed to delete shift: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (shiftId: string) => {
    setShiftToDelete(shiftId);
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsDeleteConfirmOpen(false);
    setShiftToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (shiftToDelete) {
      try {
        setIsSubmitting(true);
        await deleteShift(shiftToDelete);
        showSuccessToast('Shift deleted successfully');
        setIsModalOpen(false);
        // Add delay for state reset
        setTimeout(() => {
          setCurrentShift(undefined);
        }, 300);
      } catch (error: any) {
        logError('ShiftManager:ConfirmDelete', error);
        showErrorToast(`Failed to delete shift: ${error.message || 'Unknown error'}`);
      } finally {
        setIsSubmitting(false);
        setIsDeleteConfirmOpen(false);
        setShiftToDelete(null);
      }
    }
  };

  return {
    shifts,
    isLoading,
    isSubmitting,
    selectedMonth,
    currentShift,
    isModalOpen,
    isDeleteConfirmOpen,
    handleAddShift,
    handleShiftClick,
    handleCloseModal,
    handleMonthChange,
    handleSubmitShift,
    handleDeleteShift,
    handleDeleteClick,
    handleCloseConfirmDialog,
    handleConfirmDelete,
  };
}
