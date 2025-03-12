/**
 * Currency Formatting Utilities
 *
 * This file provides a collection of functions for formatting currency values
 * across the application. It supports multiple currencies with locale-aware
 * formatting and symbol display options. The default configuration is optimized
 * for Israeli Shekel (ILS) with Hebrew locale.
 */

/**
 * Options for customizing currency formatting
 */
interface FormatCurrencyOptions {
  /** Currency code (default: 'ILS') */
  currency?: string;
  /** Locale for number formatting (default: 'he-IL') */
  locale?: string;
  /** Whether to show currency symbol (default: true) */
  displaySymbol?: boolean;
  /** Minimum digits after decimal point (default: 2) */
  minimumFractionDigits?: number;
  /** Maximum digits after decimal point (default: 2) */
  maximumFractionDigits?: number;
}

/**
 * Formats a number as currency with customizable options
 *
 * This is the core formatting function that all other currency
 * formatters use internally. It provides flexible options for
 * displaying currency values according to locale conventions.
 *
 * @param amount - The number to format as currency
 * @param options - Formatting options (currency, locale, etc.)
 * @returns Formatted currency string
 *
 * @example
 * // Basic usage (formats as ₪100.00)
 * formatCurrency(100)
 *
 * @example
 * // Custom currency and locale (formats as $100.00)
 * formatCurrency(100, { currency: 'USD', locale: 'en-US' })
 */
export function formatCurrency(amount: number, options: FormatCurrencyOptions = {}): string {
  const {
    currency = 'ILS',
    locale = 'he-IL',
    displaySymbol = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: displaySymbol ? 'currency' : 'decimal',
    currency: displaySymbol ? currency : undefined,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

/**
 * Formats a number as Israeli Shekel (ILS)
 *
 * Provides a convenient shorthand for formatting values in the default
 * currency with Hebrew locale. All standard options except currency can
 * still be customized.
 *
 * @param amount - The number to format as ILS
 * @param options - Formatting options (excluding currency)
 * @returns Formatted ILS currency string
 *
 * @example
 * // Formats as ₪100.00
 * formatILS(100)
 */
export function formatILS(
  amount: number,
  options: Omit<FormatCurrencyOptions, 'currency'> = {}
): string {
  return formatCurrency(amount, { ...options, currency: 'ILS' });
}

/**
 * Formats a number as US Dollar (USD)
 *
 * Provides a convenient shorthand for formatting values in USD
 * with English US locale. All standard options except currency can
 * still be customized.
 *
 * @param amount - The number to format as USD
 * @param options - Formatting options (excluding currency)
 * @returns Formatted USD currency string
 *
 * @example
 * // Formats as $100.00
 * formatUSD(100)
 */
export function formatUSD(
  amount: number,
  options: Omit<FormatCurrencyOptions, 'currency'> = {}
): string {
  return formatCurrency(amount, { ...options, currency: 'USD', locale: 'en-US' });
}

/**
 * Formats a number as Euro (EUR)
 *
 * Provides a convenient shorthand for formatting values in EUR
 * with English US locale. All standard options except currency can
 * still be customized.
 *
 * @param amount - The number to format as EUR
 * @param options - Formatting options (excluding currency)
 * @returns Formatted EUR currency string
 *
 * @example
 * // Formats as €100.00
 * formatEUR(100)
 */
export function formatEUR(
  amount: number,
  options: Omit<FormatCurrencyOptions, 'currency'> = {}
): string {
  return formatCurrency(amount, { ...options, currency: 'EUR', locale: 'en-US' });
}

/**
 * Gets the currency symbol for a given currency code
 *
 * Extracts just the currency symbol without any numeric value,
 * using locale-aware formatting. Falls back to hardcoded symbols
 * if the Intl API fails.
 *
 * @param currencyCode - The ISO currency code (default: 'ILS')
 * @returns The currency symbol (e.g. '₪', '$', '€')
 *
 * @example
 * // Returns '₪'
 * getCurrencySymbol('ILS')
 *
 * @example
 * // Returns '$'
 * getCurrencySymbol('USD')
 */
export function getCurrencySymbol(currencyCode: string = 'ILS'): string {
  try {
    return (0)
      .toLocaleString('he-IL', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\d/g, '')
      .trim();
  } catch (error) {
    // Fallback to common symbols
    const symbols: { [key: string]: string } = {
      ILS: '₪',
      USD: '$',
      EUR: '€',
      GBP: '£',
    };
    return symbols[currencyCode] || currencyCode;
  }
}
