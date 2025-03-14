'use client';

import { Fragment, useRef, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/tailwindUtils';

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
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  isDestructive = true,
}: ConfirmDialogProps) {
  // Ref for focus management - important for accessibility and keyboard navigation
  const deleteButtonRef = useRef(null);

  // Memoized handler to prevent unnecessary re-renders
  const handleDelete = useCallback(() => {
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  }, [onConfirm]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[100]"
        onClose={onClose}
        initialFocus={deleteButtonRef}
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg border border-gray-700/40 shadow-xl transition-all">
                {/* Header with close button */}
                <div className="bg-gray-800/60 backdrop-blur-md rounded-t-lg border-b border-gray-700/30 py-4 px-6 flex items-center justify-between">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-100">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-700/50 active:bg-gray-600/70 transition-colors touch-manipulation"
                    aria-label="Close"
                    type="button"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <X className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
                  </button>
                </div>

                {/* Content area with action button */}
                <div className="p-6 bg-gray-900">
                  {isDestructive && (
                    <div className="flex justify-center mb-4">
                      <AlertTriangle className="h-12 w-12 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-300 mb-6 text-center">{message}</p>
                  </div>

                  {/* Action button - optimized for both mouse and touch interactions */}
                  <div className="mt-6 flex justify-center">
                    <button
                      ref={deleteButtonRef}
                      type="button"
                      onClick={handleDelete}
                      onTouchEnd={(e) => {
                        e.preventDefault(); // Prevent ghost clicks
                        handleDelete();
                      }}
                      className={cn(
                        'py-3 px-8 text-base font-medium rounded-lg transition-all touch-manipulation',
                        'active:scale-95 active:opacity-90', // Visual feedback for touch devices
                        isDestructive
                          ? 'bg-red-600 hover:bg-red-500 text-white active:bg-red-700 shadow-sm hover:shadow'
                          : 'bg-primary-600 hover:bg-primary-500 text-white active:bg-primary-700 shadow-sm hover:shadow'
                      )}
                      style={{ WebkitTapHighlightColor: 'transparent' }} // Remove default mobile highlight
                    >
                      {confirmText}
                    </button>
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
