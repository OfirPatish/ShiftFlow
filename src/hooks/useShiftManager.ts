import { useState, useEffect } from 'react';
import { useShifts, Shift, ShiftFormData } from '@/hooks/useShifts';
import { showSuccessToast, showErrorToast } from '@/lib/notificationToasts';
import { startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

export function useShiftManager() {
  const {
    shifts,
    isLoading: apiLoading,
    error,
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
      setCurrentShift(undefined);
    }
  };

  const handleMonthChange = (_startDate: Date, _endDate: Date, currentMonth: Date) => {
    setSelectedMonth(currentMonth);
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

      setIsModalOpen(false);
      setCurrentShift(undefined);
    } catch (error: any) {
      console.error('Error saving shift:', error);
      showErrorToast(`Failed to save shift: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteShift = async (shiftId: string) => {
    try {
      setIsSubmitting(true);
      await deleteShift(shiftId);
      showSuccessToast('Shift deleted successfully');
      setIsModalOpen(false);
      setCurrentShift(undefined);
    } catch (error: any) {
      console.error('Error deleting shift:', error);
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
        setCurrentShift(undefined);
      } catch (error: any) {
        console.error('Error deleting shift:', error);
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
