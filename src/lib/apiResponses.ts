import { NextResponse } from 'next/server';
import { logError } from './errorHandlers';
import { showErrorToast } from './notificationToasts';

/**
 * API Response Utilities for Next.js Route Handlers
 *
 * This file provides standardized functions for creating consistent API responses,
 * handling errors, and communicating error information between server and client.
 * Using these utilities ensures uniform error handling across all API routes.
 */

/**
 * Creates a standardized error response for API routes
 *
 * This function generates a properly formatted error response with consistent
 * structure and optional details. It also logs the error for server-side tracking
 * and can optionally indicate that a toast notification should be shown on the client.
 *
 * @param message - Human-readable error message
 * @param status - HTTP status code (defaults to 500)
 * @param details - Optional additional error details or context
 * @param showToastOnClient - Whether client should display a toast notification
 * @returns NextResponse with formatted error payload and appropriate status
 */
export function errorResponse(
  message: string,
  status = 500,
  details?: any,
  showToastOnClient = false
) {
  logError('API', `${status}: ${message}`);
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
      showToast: showToastOnClient,
    },
    { status }
  );
}

/**
 * HOC that wraps an API handler with standardized error handling
 *
 * This higher-order function catches any errors thrown in the wrapped handler
 * and returns a properly formatted error response, preventing unhandled exceptions
 * from causing 500 errors without proper client feedback.
 *
 * @param handler - The API route handler function to wrap
 * @returns A new handler with error handling built in
 */
export function withErrorHandling(handler: (...args: any[]) => Promise<NextResponse>) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return errorResponse(message);
    }
  };
}

/**
 * Client-side helper for processing API error responses
 *
 * This function extracts error information from a Response object
 * and handles any toast notifications indicated by the API. Use this
 * in frontend code when handling fetch responses that resulted in errors.
 *
 * @param response - The Response object from a fetch call
 * @returns A promise resolving to the error message string
 */
export async function handleClientApiError(response: Response): Promise<string> {
  try {
    const data = await response.json();

    // Show toast if the API response indicates it should
    if (data.showToast) {
      showErrorToast(data.error);
    }

    return data.error || `Error ${response.status}`;
  } catch (e) {
    return `Error ${response.status}: ${response.statusText}`;
  }
}
