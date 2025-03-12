'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/tailwindUtils';

export interface TimeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  className?: string;
  label?: string;
  helperText?: string;
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || `time-input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="mt-1.5">
          <input
            type="time"
            id={inputId}
            className={cn(
              'w-full bg-gray-800/80 border border-gray-700 rounded-lg py-2.5 px-4',
              'focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none',
              'transition-all duration-200 text-gray-200',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {error && helperText && <p className="mt-1.5 text-sm text-red-400">{helperText}</p>}
        </div>
      </div>
    );
  }
);
TimeInput.displayName = 'TimeInput';

export { TimeInput };
