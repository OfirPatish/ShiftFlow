'use client';

import { useShiftManager } from '@/hooks/useShiftManager';
import { FullPageSpinner } from '@/components/common/LoadingSpinner';
import ShiftsList from '@/components/shifts/ShiftsList';
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
    <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-16 xl:px-24">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8 gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-100 mb-1 sm:mb-2">Shifts</h1>
          <p className="text-sm sm:text-base text-gray-400">Track and manage your work shifts</p>
        </div>
        <div className="w-full sm:w-auto">
          <Button onClick={handleAddShift} variant="primary" className="w-full sm:w-auto">
            Add Shift
          </Button>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="max-w-4xl mx-auto">
        {/* Month Selector - Centered */}
        <div className="flex justify-center mb-4 sm:mb-8 overflow-x-auto pb-2">
          <MonthSelector currentDate={selectedMonth} onChange={handleMonthChange} />
        </div>

        {/* Content Section without background container */}
        <div className="p-0">
          <ShiftsList shifts={shifts} onShiftClick={handleShiftClick} />
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
