'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/tailwindUtils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-0 focus:border-0 outline-none focus-visible:outline-none focus-visible:ring-0 disabled:opacity-60 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-600 hover:bg-primary-500 text-white active:bg-primary-700 shadow-sm hover:shadow',
        secondary:
          'bg-gray-700 hover:bg-gray-600 text-gray-200 active:bg-gray-800 shadow-sm hover:shadow',
        outline:
          'border border-primary-500 text-primary-400 bg-transparent hover:bg-primary-900/50 active:bg-primary-900/70',
        danger: 'bg-red-600 hover:bg-red-500 text-white active:bg-red-700 shadow-sm hover:shadow',
        success:
          'bg-green-600 hover:bg-green-500 text-white active:bg-green-700 shadow-sm hover:shadow',
        warning:
          'bg-amber-600 hover:bg-amber-500 text-white active:bg-amber-700 shadow-sm hover:shadow',
        ghost: 'hover:bg-gray-800 text-gray-300 hover:text-white',
      },
      size: {
        default: 'py-2.5 px-5 text-sm',
        sm: 'py-1.5 px-3 text-xs',
        lg: 'py-3 px-6 text-base',
        xl: 'py-4 px-8 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
      isLoading: {
        true: 'opacity-80 pointer-events-none',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      fullWidth: false,
      isLoading: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  className?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      href,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine the content to render inside the button
    const buttonContent = (
      <>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && (
          <span className={cn('mr-2', size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5')}>{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className={cn('ml-2', size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5')}>{rightIcon}</span>
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          prefetch={true}
          className={cn(
            buttonVariants({
              variant,
              size,
              fullWidth,
              isLoading,
              className,
            })
          )}
          style={{ outline: 'none !important' }}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
        >
          {buttonContent}
        </Link>
      );
    }

    return (
      <button
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            isLoading,
            className,
          })
        )}
        ref={ref}
        disabled={disabled || isLoading}
        style={{ outline: 'none !important' }}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
