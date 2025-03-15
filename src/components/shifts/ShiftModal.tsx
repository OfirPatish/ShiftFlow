import { Shift, ShiftFormData } from '@/types/models/shifts';
import React from 'react';
import ActionModal from '@/components/core/modals/ActionModal';
import ShiftForm from './ShiftForm';
import { useSettings } from '@/hooks/api/useSettings';
import { LoadingContainer } from '@/components/core/feedback/LoadingWrapper';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShiftFormData) => Promise<void>;
  title: string;
  shift?: Shift;
  onDelete?: (shiftId: string) => void;
  initialDate?: Date;
  isSubmitting?: boolean;
  allowOutsideClick?: boolean;
}

export default function ShiftModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  shift,
  onDelete,
  initialDate,
  isSubmitting = false,
  allowOutsideClick = true,
}: ShiftModalProps) {
  const { isLoading: settingsLoading } = useSettings();

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
      allowOutsideClick={allowOutsideClick}
      isSubmitting={isSubmitting}
    >
      <LoadingContainer isLoading={settingsLoading} minDisplayTime={300}>
        <ShiftForm
          shift={shift}
          onSubmit={onSubmit}
          onDelete={onDelete}
          initialDate={initialDate}
          isSubmitting={isSubmitting}
        />
      </LoadingContainer>
    </ActionModal>
  );
}
