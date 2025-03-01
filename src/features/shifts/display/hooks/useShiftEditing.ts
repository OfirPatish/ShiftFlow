import { useState } from "react";
import { Shift, TimeEntry } from "../../../../core/types/shift";
import { useShiftsStore } from "../../../../core/context/shiftsSlice";
import { useShiftFormValidation } from "../../management/hooks";
import { calculateShiftHours } from "../../utils/shiftCalculations";
import { useWageStore } from "../../../../core/context/wageSlice";

/**
 * Custom hook to manage shift editing functionality
 */
export const useShiftEditing = () => {
  const { editShift } = useShiftsStore();
  const { shifts } = useShiftsStore();
  const wageConfig = useWageStore((state) => state.wageConfig);
  const { errors, validate, resetErrors } = useShiftFormValidation();

  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState<TimeEntry>({ hours: 0, minutes: 0 });
  const [editEndTime, setEditEndTime] = useState<TimeEntry>({ hours: 0, minutes: 0 });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setEditDate(shift.date);
    setEditStartTime(shift.startTime);
    setEditEndTime(shift.endTime);
    setValidationErrors([]);
    resetErrors();
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingShift) return;

    const formData = {
      date: editDate,
      startTime: editStartTime,
      endTime: editEndTime,
    };

    if (validate(formData, editingShift.id)) {
      const result = calculateShiftHours(editStartTime, editEndTime, wageConfig);

      const updatedShift: Shift = {
        ...editingShift,
        date: editDate,
        startTime: editStartTime,
        endTime: editEndTime,
        calculatedHours: {
          base: result.baseHours,
          overtime: result.overtimeHours,
          overtime125: result.overtime125Hours,
          overtime150: result.overtime150Hours,
          total: result.totalHours,
        },
        totalEarnings: result.earnings.total,
      };

      editShift(editingShift.id, updatedShift);
      setShowEditModal(false);
      setEditingShift(null);
      resetErrors();
    } else {
      // Convert errors object to array for compatibility with existing modal
      const errorMessages: string[] = [];
      if (errors.date) errorMessages.push(errors.date);
      if (errors.startTime) errorMessages.push(errors.startTime);
      if (errors.endTime) errorMessages.push(errors.endTime);
      if (errors.general) errorMessages.push(errors.general);
      setValidationErrors(errorMessages);
    }
  };

  const handleTimeChange = (type: "start" | "end", field: "hours" | "minutes", value: string) => {
    const numValue = parseInt(value) || 0;
    const setter = type === "start" ? setEditStartTime : setEditEndTime;

    setter((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingShift(null);
    setValidationErrors([]);
    resetErrors();
  };

  return {
    editingShift,
    showEditModal,
    editDate,
    editStartTime,
    editEndTime,
    validationErrors,
    errors,
    handleEdit,
    handleSaveEdit,
    handleTimeChange,
    closeEditModal,
    setEditDate,
  };
};
