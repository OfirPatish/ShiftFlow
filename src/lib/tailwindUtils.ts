import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS utility functions for class name management
 *
 * This file provides utilities for working with Tailwind CSS classes,
 * handling conditional class application, and resolving conflicts between
 * classes when multiple classes target the same CSS property.
 */

/**
 * Combines multiple class names and resolves any Tailwind CSS conflicts
 *
 * This utility function merges class names from various sources while
 * intelligently handling Tailwind CSS conflicts. It ensures that when
 * conflicting Tailwind classes are provided, the last one takes precedence.
 *
 * Under the hood, it uses clsx for conditional class merging and
 * tailwind-merge for resolving Tailwind-specific conflicts.
 *
 * @example
 * // Basic usage
 * cn('text-red-500', 'bg-blue-200', condition && 'font-bold')
 *
 * // Resolving conflicts (text-lg will take precedence over text-sm)
 * cn('text-sm', variant === 'large' && 'text-lg')
 *
 * // With dynamic classes and template strings
 * cn(`p-${size}`, isActive && 'bg-primary-500', className)
 *
 * @param inputs - Any number of class string arguments or falsy values
 * @returns A merged class string with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
