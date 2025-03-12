/**
 * Error Handling Utilities
 *
 * This file provides a collection of standardized functions for handling, formatting,
 * and logging errors throughout the application. These utilities ensure consistent
 * error handling practices across both client and server-side code.
 */

import { showErrorToast, getErrorMessage } from '@/lib/notificationToasts';

/**
 * Handles API response errors and returns a formatted error message
 *
 * Use this function when working with fetch responses to extract meaningful
 * error messages from the API response. It can optionally display an error
 * toast notification to the user.
 *
 * @param response - The Response object from a fetch call
 * @param showToast - Whether to show a toast notification to the user
 * @returns A promise resolving to a user-friendly error message string
 */
export const handleApiError = async (response: Response, showToast = false): Promise<string> => {
  if (response.ok) return '';

  try {
    const data = await response.json();
    const errorMessage = data.error || `Error ${response.status}: ${response.statusText}`;

    if (showToast) {
      showErrorToast(errorMessage);
    }

    return errorMessage;
  } catch (e) {
    const errorMessage = `Error ${response.status}: ${response.statusText}`;

    if (showToast) {
      showErrorToast(errorMessage);
    }

    return errorMessage;
  }
};

/**
 * Converts any error type into a user-friendly message
 *
 * This utility handles different error formats (string, Error object, unknown)
 * and converts them into a consistent user-friendly message. It can optionally
 * display a toast notification.
 *
 * @param error - The error object or message to format (any type)
 * @param showToast - Whether to show a toast notification to the user
 * @returns A user-friendly error message string
 */
export const formatError = (error: unknown, showToast = false): string => {
  const errorMessage = getErrorMessage(error);

  if (showToast) {
    showErrorToast(errorMessage);
  }

  return errorMessage;
};

/**
 * Logs an error to the console with consistent formatting
 *
 * This function provides standardized error logging with context information
 * to help with debugging. It can optionally display a toast notification to
 * the user.
 *
 * @param context - A string identifying where the error occurred
 * @param error - The error object or message to log
 * @param showToast - Whether to show a toast notification to the user
 */
export const logError = (context: string, error: unknown, showToast = false): void => {
  const errorMessage = getErrorMessage(error);
  console.error(`[${context}] ${errorMessage}`, error);

  if (showToast) {
    showErrorToast(errorMessage);
  }
};
