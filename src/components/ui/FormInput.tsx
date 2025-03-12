'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/tailwindUtils';

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  className?: string;
  label?: string;
  helperText?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block mb-2 text-sm font-medium text-gray-200">
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full bg-gray-800/80 border border-gray-700 rounded-lg py-2.5 px-4',
            'focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none',
            'transition-all duration-200 placeholder-gray-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={cn('mt-1 text-xs', error ? 'text-red-500' : 'text-gray-400')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';

export { FormInput };
