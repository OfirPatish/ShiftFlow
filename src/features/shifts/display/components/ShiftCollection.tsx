import React, { useState, useEffect } from "react";
import { useShiftsStore } from "../../../../core/context/shiftsSlice";
import { useSelectedMonth } from "../../../../core/context/selectedMonthSlice";
import { useShiftEditing, useShiftDeletion } from "../hooks";
import { sortShiftsByDate, groupShiftsByWeek } from "../utils/shiftDataProcessing";
import { ShiftCollectionHeader, ShiftsList, NoShiftsDisplay } from ".";
import { EditShiftModal } from "../../management/components/modals/EditShiftModal";
import { DeleteConfirmModal } from "../../management/components/modals/DeleteConfirmModal";

interface ShiftCollectionProps {
  limit?: number;
}

export function ShiftCollection({ limit }: ShiftCollectionProps) {
  // Core state
  const { getMonthlyShifts } = useShiftsStore();
  const { selectedMonth } = useSelectedMonth();
  const [isClient, setIsClient] = useState(false);
  const [groupByWeek, setGroupByWeek] = useState(true);

  // Custom hooks for different functionality
  const {
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
  } = useShiftEditing();

  const { showDeleteConfirm, shiftToDelete, handleDeleteClick, handleConfirmDelete, cancelDelete } = useShiftDeletion();

  // Fix for hydration mismatch - only run on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get shifts data
  const monthlyShifts = getMonthlyShifts(selectedMonth.getFullYear(), selectedMonth.getMonth());
  const displayedShifts = limit ? monthlyShifts.slice(0, limit) : monthlyShifts;

  // Process shifts data based on grouping preference
  const sortedShifts = sortShiftsByDate(displayedShifts);
  const processedShifts = groupByWeek ? groupShiftsByWeek(sortedShifts) : { "All Shifts": sortedShifts };

  const toggleGrouping = () => {
    setGroupByWeek(!groupByWeek);
  };

  // Handle rendering during SSR/loading
  if (!isClient) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Loading Shifts...
          </h2>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded"></div>
            <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle no shifts
  if (displayedShifts.length === 0) {
    return <NoShiftsDisplay />;
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
        {/* Header with month picker */}
        <ShiftCollectionHeader
          shiftCount={displayedShifts.length}
          groupByWeek={groupByWeek}
          toggleGrouping={toggleGrouping}
        />

        {/* List of shifts */}
        <ShiftsList
          shifts={processedShifts}
          groupByWeek={groupByWeek}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Edit Modal */}
      {showEditModal && editingShift && (
        <EditShiftModal
          shift={editingShift}
          date={editDate}
          setDate={setEditDate}
          startTime={editStartTime}
          endTime={editEndTime}
          onTimeChange={handleTimeChange}
          onSave={handleSaveEdit}
          onCancel={closeEditModal}
          validationErrors={validationErrors}
          errors={errors}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && shiftToDelete && (
        <DeleteConfirmModal shift={shiftToDelete} onConfirm={handleConfirmDelete} onCancel={cancelDelete} />
      )}
    </>
  );
}
