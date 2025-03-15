import React from 'react';
import { Rate, RateFormData } from '@/types/models/rates';
import RateForm from './RateForm';
import ActionModal from '@/components/core/modals/ActionModal';

interface RateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RateFormData) => Promise<void>;
  title: string;
  rate?: Rate;
  employerId?: string;
  onDelete?: (rateId: string) => void;
  allowOutsideClick?: boolean;
  isSubmitting?: boolean;
}

export default function RateModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  rate,
  employerId,
  onDelete,
  allowOutsideClick = true,
  isSubmitting = false,
}: RateModalProps) {
  const handleSubmit = async (data: RateFormData) => {
    await onSubmit(data);
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      allowOutsideClick={allowOutsideClick}
      isSubmitting={isSubmitting}
    >
      <RateForm
        rate={rate}
        employerId={employerId}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onDelete={onDelete}
        isSubmitting={isSubmitting}
      />
    </ActionModal>
  );
}
