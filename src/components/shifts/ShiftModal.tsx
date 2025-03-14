import { Shift, ShiftFormData } from '@/hooks/useShifts';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import Modal from '@/components/common/Modal';
import ShiftForm from './ShiftForm';
import ConfirmDialog from '@/components/common/ConfirmDialog';

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
  const handleSubmit = async (data: ShiftFormData) => {
    await onSubmit(data);
    // Let the parent component handle closing
    // onClose(); - Don't call onClose here
  };

  // Handle the close button click explicitly
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onClose();
  };

  // In this simplified version, the ShiftForm component will handle
  // the delete functionality and any confirmations needed

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" allowOutsideClick={allowOutsideClick}>
      <div className="modal-header bg-gray-800/60 backdrop-blur-md rounded-t-lg border-b border-gray-700/30 py-4 px-6 flex items-center justify-between -mx-6 -mt-6 mb-6">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div onClick={handleCloseClick} className="cursor-pointer" aria-label="Close">
          <X className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
        </div>
      </div>

      <ShiftForm
        shift={shift}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onDelete={onDelete}
        initialDate={initialDate}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}
