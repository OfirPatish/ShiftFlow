import React, { useState } from 'react';
import { Rate, RateFormData } from '@/hooks/useRates';
import RateForm from './RateForm';
import Modal from '@/components/common/Modal';
import { X } from 'lucide-react';

interface RateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RateFormData) => Promise<void>;
  title: string;
  rate?: Rate;
  employerId?: string;
  onDelete?: (rateId: string) => void;
  allowOutsideClick?: boolean;
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
}: RateModalProps) {
  const handleSubmit = async (data: RateFormData) => {
    await onSubmit(data);
    // Let the parent component handle closing
    // onClose(); - Don't call onClose here
  };

  // Handle the close button click explicitly
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onClose();
  };

  // In this simplified version, the RateForm's delete button will directly trigger
  // the parent component's onDelete function, which will handle showing a confirmation dialog

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" allowOutsideClick={allowOutsideClick}>
      <div className="modal-header bg-gray-800/60 backdrop-blur-md rounded-t-lg border-b border-gray-700/30 py-4 px-6 flex items-center justify-between -mx-6 -mt-6 mb-6">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div onClick={handleCloseClick} className="cursor-pointer" aria-label="Close">
          <X className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
        </div>
      </div>

      <RateForm
        rate={rate}
        employerId={employerId}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onDelete={onDelete}
      />
    </Modal>
  );
}
