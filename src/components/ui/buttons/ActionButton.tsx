'use client';

import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/tailwindUtils';

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  icon?: ReactNode;
  className?: string;
  transparent?: boolean;
}

export function ActionButton({
  children,
  variant = 'primary',
  icon,
  className,
  transparent = false,
  ...props
}: ActionButtonProps) {
  // Define style variants
  const variantStyles = {
    primary: transparent
      ? 'text-primary-400 hover:text-primary-300'
      : 'bg-gray-800 hover:bg-primary-600/80 text-primary-400 hover:text-white',
    secondary: transparent
      ? 'text-gray-300 hover:text-gray-100'
      : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white',
    danger: transparent
      ? 'text-red-400 hover:text-red-300'
      : 'bg-gray-800 hover:bg-red-600/80 text-red-400 hover:text-white',
    success: transparent
      ? 'text-green-400 hover:text-green-300'
      : 'bg-gray-800 hover:bg-green-600 text-green-400 hover:text-white',
    warning: transparent
      ? 'text-amber-400 hover:text-amber-300'
      : 'bg-gray-800 hover:bg-amber-600/80 text-amber-400 hover:text-white',
  };

  return (
    <button
      className={cn(
        'font-medium transition-all duration-200 flex items-center justify-center',
        // Apply padding and border radius only when not transparent
        !transparent &&
          'p-3.5 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-900',
        // For transparent buttons, use minimal padding
        transparent && 'p-2',
        // Apply variant-specific styles
        variantStyles[variant],
        // Apply variant-specific focus rings (only when not transparent)
        !transparent && {
          'focus:ring-primary-500/50': variant === 'primary',
          'focus:ring-gray-500/50': variant === 'secondary',
          'focus:ring-red-500/50': variant === 'danger',
          'focus:ring-green-500/50': variant === 'success',
          'focus:ring-amber-500/50': variant === 'warning',
        },
        className
      )}
      {...props}
    >
      {icon && <span className={cn('h-6 w-6', children && 'mr-2')}>{icon}</span>}
      {children}
    </button>
  );
}
