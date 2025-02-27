import React, { useState } from "react";
import { useShifts } from "../../../context/shiftsContext";
import { Shift, TimeEntry } from "../../../types/shift";
import { validateShift } from "../../../utils/validation";
import { calculateShiftHours } from "../../../utils/calculations";
import { useWage } from "../../../context/wageContext";
import { ShiftCard } from "./ShiftCard";
import { EditShiftModal } from "../../modals/EditShiftModal";
import { DeleteConfirmModal } from "../../modals/DeleteConfirmModal";
import { EmptyShiftsList } from "./EmptyShiftsList";

export function ShiftsList() {
  const { shifts, deleteShift, getMonthlyShifts, editShift } = useShifts();
  const { wageConfig } = useWage();
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState<TimeEntry>({ hours: 0, minutes: 0 });
  const [editEndTime, setEditEndTime] = useState<TimeEntry>({ hours: 0, minutes: 0 });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const currentDate = new Date();
  const currentMonthShifts = getMonthlyShifts(currentDate.getFullYear(), currentDate.getMonth());

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setEditDate(shift.date);
    setEditStartTime(shift.startTime);
    setEditEndTime(shift.endTime);
    setValidationErrors([]);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingShift) return;

    const validation = validateShift(editDate, editStartTime, editEndTime, shifts, editingShift.id);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

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
    setValidationErrors([]);
  };

  const handleTimeChange = (type: "start" | "end", field: "hours" | "minutes", value: string) => {
    const numValue = parseInt(value) || 0;
    const setter = type === "start" ? setEditStartTime : setEditEndTime;

    setter((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

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

  if (currentMonthShifts.length === 0) {
    return <EmptyShiftsList />;
  }

  // Sort shifts by date
  const sortedShifts = [...currentMonthShifts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">This Month's Shifts</h2>
        </div>

        <div className="py-3">
          {sortedShifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} onEdit={handleEdit} onDelete={handleDeleteClick} />
          ))}
        </div>
      </div>

      <EditShiftModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        editDate={editDate}
        editStartTime={editStartTime}
        editEndTime={editEndTime}
        validationErrors={validationErrors}
        onDateChange={setEditDate}
        onTimeChange={handleTimeChange}
      />

      <DeleteConfirmModal
        show={showDeleteConfirm}
        shift={shiftToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setShiftToDelete(null);
        }}
      />
    </>
  );
}
