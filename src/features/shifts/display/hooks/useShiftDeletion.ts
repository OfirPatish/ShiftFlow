import { useState } from "react";
import { Shift } from "../../../../core/types/shift";
import { useShiftsStore } from "../../../../core/context/shiftsSlice";

/**
 * Custom hook to manage shift deletion functionality
 */
export const useShiftDeletion = () => {
  const { deleteShift } = useShiftsStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);

  const handleDeleteClick = (shift: Shift) => {
    setShiftToDelete(shift);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (shiftToDelete) {
      deleteShift(shiftToDelete.id);
      setShowDeleteConfirm(false);
      setShiftToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setShiftToDelete(null);
  };

  return {
    showDeleteConfirm,
    shiftToDelete,
    handleDeleteClick,
    handleConfirmDelete,
    cancelDelete,
  };
};
