'use client';

import { useShiftManager } from '@/hooks/ui/useShiftManager';
import ShiftsList from '@/components/shifts/ShiftsList';
import MonthSelector from '@/components/core/selectors/MonthSelector';
import ShiftModal from '@/components/shifts/ShiftModal';
import ConfirmDialog from '@/components/core/modals/ConfirmDialog';
import { FullPageSpinner } from '@/components/core/feedback/LoadingSpinner';
import PageLayout from '@/components/layout/templates/PageLayout';

export default function Shifts() {
  const {
    shifts,
    isLoading,
    selectedMonth,
    isModalOpen,
    currentShift,
    isSubmitting,
    isDeleteConfirmOpen,
    handleMonthChange,
    handleAddShift,
    handleShiftClick,
    handleCloseModal,
    handleSubmitShift,
    handleDeleteClick,
    handleCloseConfirmDialog,
    handleConfirmDelete,
  } = useShiftManager();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <PageLayout
      title="Shifts"
      subtitle="Track and manage your work shifts"
      maxContentWidth="4xl"
      actionElement={
        <div className="flex items-center gap-4">
          <MonthSelector currentDate={selectedMonth} onChange={handleMonthChange} />
          <button
            onClick={handleAddShift}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Add Shift
          </button>
        </div>
      }
    >
      {/* Content Section */}
      <div className="p-0">
        <ShiftsList shifts={shifts} onShiftClick={handleShiftClick} />
      </div>

      {/* Modals */}
      <ShiftModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        shift={currentShift}
        onSubmit={handleSubmitShift}
        onDelete={handleDeleteClick}
        isSubmitting={isSubmitting}
        title={currentShift ? 'Edit Shift' : 'Add New Shift'}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Shift"
        message="Are you sure you want to delete this shift? This action cannot be undone."
      />
    </PageLayout>
  );
}
