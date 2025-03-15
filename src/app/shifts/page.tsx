'use client';

import { useShiftManager } from '@/hooks/ui/useShiftManager';
import ShiftsList from '@/components/shifts/ShiftsList';
import MonthSelector from '@/components/core/selectors/MonthSelector';
import ShiftModal from '@/components/shifts/ShiftModal';
import ConfirmDialog from '@/components/core/modals/ConfirmDialog';
import { FullPageSpinner } from '@/components/core/feedback/LoadingSpinner';
import PageLayout from '@/components/layout/templates/PageLayout';
import { Button } from '@/components/ui/buttons/Button';

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
        <Button
          onClick={handleAddShift}
          variant="primary"
          className="relative group px-6 py-2 h-10 sm:h-11"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary-600/50 to-primary-500/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
          <span className="relative">Add Shift</span>
        </Button>
      }
      bottomAction={<MonthSelector currentDate={selectedMonth} onChange={handleMonthChange} />}
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
