'use client';

import React, { useState, useEffect } from 'react';
import Picker from 'react-mobile-picker';
import { cn } from '@/lib/utils/tailwindUtils';
import { Button } from '@/components/ui/buttons/Button';
import { ChevronDown, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { logError } from '@/lib/validation/errorHandlers';

export interface DatePickerProps {
  label?: string;
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  id?: string;
  className?: string;
  required?: boolean;
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const months = monthNames.map((name, i) => ({
  label: name,
  value: (i + 1).toString().padStart(2, '0'),
}));
// Years from 5 years ago to 5 years in the future
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString());

export function DatePicker({
  label,
  value,
  onChange,
  error,
  helperText,
  id,
  className,
  required,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerValue, setPickerValue] = useState<{ month: string; day: string; year: string }>({
    month: '01',
    day: '01',
    year: currentYear.toString(),
  });
  const [displayValue, setDisplayValue] = useState('');

  const inputId = id || `date-picker-${Math.random().toString(36).substring(2, 9)}`;

  // Initialize the picker value from the input value
  useEffect(() => {
    if (value) {
      try {
        const [year, month, day] = value.split('-');
        setPickerValue({ year, month, day });

        // Format the date for display (e.g., "January 01, 2023")
        const date = new Date(`${year}-${month}-${day}`);
        setDisplayValue(format(date, 'MMMM dd, yyyy'));
      } catch (error) {
        logError('DatePicker:Parse', error);
        setDisplayValue('');
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  // Get valid days for the selected month/year
  const getValidDaysForMonth = (month: number, year: number): string[] => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
  };

  // Handle the picker value change
  const handlePickerChange = (newValue: { month: string; day: string; year: string }) => {
    const adjustedValue = { ...newValue };

    // Adjust day if it's not valid for the month
    const monthNum = parseInt(newValue.month, 10);
    const yearNum = parseInt(newValue.year, 10);
    const validDays = getValidDaysForMonth(monthNum, yearNum);

    if (!validDays.includes(newValue.day)) {
      adjustedValue.day = validDays[validDays.length - 1];
    }

    setPickerValue(adjustedValue);
  };

  // Handle confirm button click
  const handleConfirm = () => {
    const formattedDate = `${pickerValue.year}-${pickerValue.month}-${pickerValue.day}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  // Handle cancel button click
  const handleCancel = () => {
    // Reset to the current value
    if (value) {
      const [year, month, day] = value.split('-');
      setPickerValue({ year, month, day });
    }
    setIsOpen(false);
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={inputId}
          className={cn(
            'w-full bg-gray-800/80 border border-gray-700 rounded-lg py-2.5 px-4 text-left',
            'focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none',
            'transition-all duration-200 text-gray-200 flex items-center justify-between',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
          )}
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{displayValue || 'Select date'}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {error && helperText && <p className="mt-1.5 text-sm text-red-400">{helperText}</p>}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-xs overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-medium text-gray-100">Select Date</h3>
            </div>

            <div className="p-4">
              <div className="bg-gray-800/50 rounded-lg">
                <Picker
                  value={pickerValue}
                  onChange={handlePickerChange}
                  height={160}
                  itemHeight={40}
                >
                  <Picker.Column name="month">
                    {months.map((month) => (
                      <Picker.Item key={month.value} value={month.value}>
                        {month.label}
                      </Picker.Item>
                    ))}
                  </Picker.Column>
                  <Picker.Column name="day">
                    {getValidDaysForMonth(
                      parseInt(pickerValue.month, 10),
                      parseInt(pickerValue.year, 10)
                    ).map((day) => (
                      <Picker.Item key={day} value={day}>
                        {day}
                      </Picker.Item>
                    ))}
                  </Picker.Column>
                  <Picker.Column name="year">
                    {years.map((year) => (
                      <Picker.Item key={year} value={year}>
                        {year}
                      </Picker.Item>
                    ))}
                  </Picker.Column>
                </Picker>
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-end space-x-2">
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
