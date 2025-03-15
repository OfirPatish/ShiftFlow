'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils/tailwindUtils';
import LoadingSpinner from '@/components/core/feedback/LoadingSpinner';

/**
 * ConfirmDialog - A reusable dialog component for confirmation actions
 * Optimized for both desktop and mobile interactions with proper focus management
 * and touch event handling for cross-device compatibility.
 */
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDestructive?: boolean;
  isSubmitting?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  isDestructive = true,
  isSubmitting = false,
}: ConfirmDialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={isSubmitting ? () => {} : onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-gray-900/95 backdrop-blur-sm p-6 text-left align-middle shadow-xl transition-all border border-gray-700/40">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-white flex items-center"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    {title}
                  </Dialog.Title>
                  {!isSubmitting && (
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-300">{message}</p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className={cn(
                      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors disabled:opacity-50',
                      isDestructive
                        ? 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
                        : 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500'
                    )}
                    onClick={onConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Confirming...</span>
                      </div>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
