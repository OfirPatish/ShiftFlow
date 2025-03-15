import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import BaseModal from './BaseModal';
import { Button } from '@/components/ui/buttons/Button';
import LoadingSpinner from '@/components/core/feedback/LoadingSpinner';
import { cn } from '@/lib/utils/tailwindUtils';

interface ModalTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  allowOutsideClick?: boolean;
  isSubmitting?: boolean;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  dangerActionLabel?: string;
  onDangerAction?: () => void;
  hideCloseButton?: boolean;
  contentClassName?: string;
}

export default function ModalTemplate({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  allowOutsideClick = true,
  isSubmitting = false,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  dangerActionLabel,
  onDangerAction,
  hideCloseButton = false,
  contentClassName,
}: ModalTemplateProps) {
  // Handle the close button click explicitly
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onClose();
  };

  const hasFooter = primaryActionLabel || secondaryActionLabel || dangerActionLabel;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size={size} allowOutsideClick={allowOutsideClick}>
      {/* Header */}
      <div className="modal-header bg-gray-800/60 backdrop-blur-md rounded-t-lg border-b border-gray-700/30 py-4 px-6 flex items-center justify-between -mx-6 -mt-6 mb-6">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {!hideCloseButton && (
          <div onClick={handleCloseClick} className="cursor-pointer" aria-label="Close">
            <X className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn('space-y-4', contentClassName)}>{children}</div>

      {/* Footer */}
      {hasFooter && (
        <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-700/50">
          {/* Danger action (usually delete) - positioned first but floated left */}
          {dangerActionLabel && onDangerAction && (
            <Button
              type="button"
              onClick={onDangerAction}
              variant="danger"
              className="mr-auto"
              disabled={isSubmitting}
            >
              {dangerActionLabel}
            </Button>
          )}

          {/* Secondary action (usually cancel) */}
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              type="button"
              onClick={onSecondaryAction}
              variant="secondary"
              disabled={isSubmitting}
            >
              {secondaryActionLabel}
            </Button>
          )}

          {/* Primary action */}
          {primaryActionLabel && onPrimaryAction && (
            <Button
              type="button"
              onClick={onPrimaryAction}
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : primaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </BaseModal>
  );
}
