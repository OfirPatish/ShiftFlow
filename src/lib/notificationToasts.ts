/**
 * Toast Notification Utilities
 *
 * This file provides a collection of functions for displaying toast notifications
 * to users across the application. It creates a consistent notification system
 * using react-hot-toast with custom styling for different notification types.
 */

import toast from 'react-hot-toast';

/**
 * Displays a success toast notification
 *
 * Shows a green success message with a checkmark icon.
 * Use this for confirming successful operations to the user.
 *
 * @param message - The success message to display
 */
export const showSuccessToast = (message: string) => {
  toast.success(message);
};

/**
 * Displays an error toast notification
 *
 * Shows a red error message with an X icon.
 * Use this for alerting users about errors or failed operations.
 *
 * @param message - The error message to display
 */
export const showErrorToast = (message: string) => {
  toast.error(message);
};

/**
 * Displays an info toast notification
 *
 * Shows a blue information message with an info icon.
 * Use this for general information that users should be aware of.
 *
 * @param message - The information message to display
 */
export const showInfoToast = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: 'linear-gradient(to right, #2563EB, #3B82F6)',
      color: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
      fontWeight: '500',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  });
};

/**
 * Displays a warning toast notification
 *
 * Shows an amber/orange warning message with a warning icon.
 * Use this for alerting users about potential issues that don't prevent operation.
 *
 * @param message - The warning message to display
 */
export const showWarningToast = (message: string) => {
  toast(message, {
    icon: '⚠️',
    style: {
      background: 'linear-gradient(to right, #D97706, #F59E0B)',
      color: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
      fontWeight: '500',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  });
};

/**
 * Extracts a human-readable error message from any error type
 *
 * This utility function handles different error formats (strings, Error objects,
 * or unknown types) and returns a consistent string message.
 *
 * @param error - The error to extract a message from (any type)
 * @returns A string representation of the error message
 */
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};
