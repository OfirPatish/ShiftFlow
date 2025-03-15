/**
 * Currency Formatting Utilities
 *
 * This file provides a collection of functions for formatting currency values
 * across the application. The application only supports Israeli Shekel (ILS).
 */

/**
 * Options for customizing currency formatting
 */
interface FormatCurrencyOptions {
  /** Locale for number formatting (default: 'he-IL') */
  locale?: string;
  /** Whether to show currency symbol (default: false) */
  displaySymbol?: boolean;
  /** Minimum digits after decimal point (default: 2) */
  minimumFractionDigits?: number;
  /** Maximum digits after decimal point (default: 2) */
  maximumFractionDigits?: number;
}

/**
 * Formats a number for display
 *
 * This function formats a number as a decimal value.
 * Use this with the shekel symbol (₪) for consistent currency display.
 *
 * @param amount - The number to format
 * @param options - Formatting options
 * @returns Formatted numeric string
 *
 * @example
 * // Basic usage (formats as number only)
 * formatCurrency(100) // Returns "100.00"
 *
 * @example
 * // For displaying currency prepend the ₪ symbol
 * `₪${formatCurrency(100)}`
 */
export function formatCurrency(amount: number, options: FormatCurrencyOptions = {}): string {
  const {
    locale = 'he-IL',
    displaySymbol = false,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  // Always use style: 'decimal' to format the number only
  // The ₪ symbol should be added manually where needed
  return new Intl.NumberFormat(locale, {
    style: displaySymbol ? 'currency' : 'decimal',
    currency: displaySymbol ? 'ILS' : undefined,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

/**
 * Gets the Israeli Shekel symbol (₪)
 *
 * @returns The shekel symbol ₪
 *
 * @example
 * // Returns '₪'
 * getCurrencySymbol()
 */
export function getCurrencySymbol(): string {
  return '₪';
}

/**
 * Formats a number with the shekel symbol on the left side
 *
 * This helper function ensures consistent left-side shekel symbol placement.
 *
 * @param amount - The monetary amount to format
 * @param options - Additional formatting options
 * @returns Formatted string with ₪ symbol on the left side
 */
export function formatWithLeftSymbol(
  amount: number,
  options: Omit<FormatCurrencyOptions, 'displaySymbol'> = {}
): string {
  const formattedAmount = formatCurrency(amount, {
    ...options,
    displaySymbol: false,
  });

  return `₪${formattedAmount}`;
}
