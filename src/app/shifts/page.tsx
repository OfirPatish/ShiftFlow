'use client';

import { useShiftManager } from '@/hooks/useShiftManager';
import { FullPageSpinner } from '@/components/common/LoadingSpinner';
import ShiftsTable from '@/components/shifts/ShiftsTable';
import ShiftModal from '@/components/shifts/ShiftModal';
import MonthSelector from '@/components/common/MonthSelector';
import { Button } from '@/components/ui/Button';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { format } from 'date-fns';

export default function Shifts() {
  const {
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
    handleDeleteClick,
    handleCloseConfirmDialog,
    handleConfirmDelete,
  } = useShiftManager();

  // Always show loading indicator first
  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-16 xl:px-24">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 mb-2">Shifts</h1>
          <p className="text-gray-400">Track and manage your work shifts</p>
        </div>
        <div>
          <Button onClick={handleAddShift} variant="primary">
            Add Shift
          </Button>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="max-w-4xl mx-auto">
        {/* Month Selector - Centered */}
        <div className="flex justify-center mb-8">
          <MonthSelector currentDate={selectedMonth} onChange={handleMonthChange} />
        </div>

        {/* Content Section with enhanced styling */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/40 shadow-xl overflow-hidden">
          {shifts.length === 0 ? (
            <EmptyStateContent selectedMonth={selectedMonth} onAddAction={handleAddShift} />
          ) : (
            <ShiftsTable shifts={shifts} onShiftClick={handleShiftClick} />
          )}
        </div>
      </div>

      {/* Unified shift modal that handles both add and edit cases */}
      <ShiftModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitShift}
        onDelete={handleDeleteClick}
        shift={currentShift}
        initialDate={selectedMonth}
        title={currentShift ? 'Edit Shift' : 'Add New Shift'}
        allowOutsideClick={true}
        isSubmitting={isSubmitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Shift"
        message="Are you sure you want to delete this shift? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}

// Inline EmptyShifts functionality
function EmptyStateContent({
  selectedMonth,
  onAddAction,
}: {
  selectedMonth?: Date;
  onAddAction?: () => void;
}) {
  // Format the month name if provided
  const monthText = selectedMonth ? format(selectedMonth, 'MMMM yyyy') : '';

  const title = 'No shifts found';
  const message = selectedMonth
    ? `No shifts found for ${monthText}`
    : 'Use the "Add Shift" button above to create a new work shift';

  return <EmptyState title={title} message={message} />;
}
