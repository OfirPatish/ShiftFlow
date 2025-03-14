'use client';

import React, { useState, useEffect } from 'react';
import Picker from 'react-mobile-picker';
import { cn } from '@/lib/tailwindUtils';
import { Button } from './Button';
import { ChevronDown, Clock } from 'lucide-react';

export interface TimePickerWheelProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  id?: string;
  className?: string;
  required?: boolean;
}

// Create arrays for hours and minutes
const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export function TimePickerWheel({
  label,
  value,
  onChange,
  error,
  helperText,
  id,
  className,
  required,
}: TimePickerWheelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get current time for default value
  const getCurrentTime = () => {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    return { hour, minute };
  };

  // Format current time as string (HH:MM)
  const getCurrentTimeString = () => {
    const { hour, minute } = getCurrentTime();
    return `${hour}:${minute}`;
  };

  // If no value is provided, use current time on mount
  useEffect(() => {
    if (!value) {
      onChange(getCurrentTimeString());
    }
  }, []);

  const [pickerValue, setPickerValue] = useState<{ hour: string; minute: string }>(
    getCurrentTime()
  );

  const inputId = id || `time-picker-${Math.random().toString(36).substring(2, 9)}`;

  // Initialize the picker value from the input value
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':');
      setPickerValue({ hour, minute });
    } else {
      // If no value is provided, use current time
      setPickerValue(getCurrentTime());
    }
  }, [value]);

  // Handle the picker value change
  const handlePickerChange = (newValue: { hour: string; minute: string }) => {
    setPickerValue(newValue);
  };

  // Handle confirm button click
  const handleConfirm = () => {
    const formattedTime = `${pickerValue.hour}:${pickerValue.minute}`;
    onChange(formattedTime);
    setIsOpen(false);
  };

  // Handle cancel button click
  const handleCancel = () => {
    // Reset to the current value
    if (value) {
      const [hour, minute] = value.split(':');
      setPickerValue({ hour, minute });
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
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{value || 'Select time'}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {error && helperText && <p className="mt-1.5 text-sm text-red-400">{helperText}</p>}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-xs overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-medium text-gray-100">Select Time</h3>
            </div>

            <div className="p-4">
              <div className="bg-gray-800/50 rounded-lg">
                <Picker
                  value={pickerValue}
                  onChange={handlePickerChange}
                  height={160}
                  itemHeight={40}
                >
                  <Picker.Column name="hour">
                    {hours.map((hour) => (
                      <Picker.Item key={hour} value={hour}>
                        {hour}
                      </Picker.Item>
                    ))}
                  </Picker.Column>
                  <Picker.Column name="minute">
                    {minutes.map((minute) => (
                      <Picker.Item key={minute} value={minute}>
                        {minute}
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
