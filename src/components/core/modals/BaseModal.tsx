'use client';

import { Fragment, ReactNode, useRef, MouseEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  allowOutsideClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  allowOutsideClick = true,
}: ModalProps) {
  // Define width based on size prop
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  // Reference to dialog panel
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle clicks on the backdrop
  const handleBackdropClick = (e: MouseEvent) => {
    // If outside clicks should be ignored or the click was inside the panel, do nothing
    if (!allowOutsideClick) {
      e.stopPropagation();
      return;
    }
    // Otherwise, ensure the click is on the backdrop itself (not on the panel)
    // by checking if the target is the same as the currentTarget
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={allowOutsideClick ? onClose : () => {}}>
        {/* Background overlay */}
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div
            className="flex min-h-full items-center justify-center p-4 text-center"
            onClick={handleBackdropClick}
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
                ref={panelRef}
                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg bg-gray-900/95 backdrop-blur-sm text-left align-middle shadow-xl transition-all border border-gray-700/40`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 pb-8">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
