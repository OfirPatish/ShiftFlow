import React from 'react';
import { Employer, EmployerFormData } from '@/types/models/employers';
import EmployerForm from './EmployerForm';
import ActionModal from '@/components/core/modals/ActionModal';

interface EmployerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployerFormData) => Promise<void>;
  title: string;
  employer?: Employer;
  onDelete?: (employerId: string) => void;
  isSubmitting: boolean;
  allowOutsideClick?: boolean;
}

export default function EmployerModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  employer,
  onDelete,
  isSubmitting,
  allowOutsideClick = true,
}: EmployerModalProps) {
  const handleSubmit = async (data: EmployerFormData) => {
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
      <EmployerForm
        employer={employer}
        onSubmit={handleSubmit}
        onDelete={onDelete}
        isSubmitting={isSubmitting}
      />
    </ActionModal>
  );
}
