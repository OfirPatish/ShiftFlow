'use client';

import React, { Fragment, MouseEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/tailwindUtils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}: ConfirmDialogProps) {
  // Prevent event propagation to parent elements
  const handleDialogClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleOverlayClick = (e: MouseEvent) => {
    // Stop propagation and prevent default behavior to avoid
    // the parent modal from receiving the click
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[100]" // Even higher z-index to ensure it's above any other modal
        onClose={onClose}
        onClick={handleDialogClick} // Stop propagation at the Dialog level
        static // This prevents the Dialog from closing when clicking outside
      >
        {/* Background overlay with blur effect */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto" onClick={handleDialogClick}>
          <div
            className="flex min-h-full items-center justify-center p-4 text-center"
            onClick={handleDialogClick}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-lg border border-gray-700/40 shadow-xl transition-all"
                onClick={handleDialogClick}
              >
                {/* Header with matching styling to ShiftsTable */}
                <div className="bg-gray-800/60 backdrop-blur-md rounded-t-lg border-b border-gray-700/30 py-4 px-6">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-100">
                    {title}
                  </Dialog.Title>
                </div>

                {/* Content area with matching styling */}
                <div className="p-6 bg-gray-900">
                  {isDestructive && (
                    <div className="flex justify-center mb-4">
                      <AlertTriangle className="h-10 w-10 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-300 mb-0 text-center">{message}</p>
                  </div>

                  {/* Footer with matching styling */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        onClose();
                      }}
                    >
                      {cancelText}
                    </Button>
                    <Button
                      type="button"
                      variant={isDestructive ? 'danger' : 'primary'}
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        onConfirm();
                      }}
                    >
                      {confirmText}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
