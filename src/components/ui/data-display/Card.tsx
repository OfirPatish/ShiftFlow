'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils/tailwindUtils';

export interface CardProps {
  className?: string;
  children: ReactNode;
  borderColor?: string;
}

export function Card({ className, children, borderColor }: CardProps) {
  return (
    <div
      className={cn(
        'bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border-l-4 transition-all duration-200 hover:bg-gray-800/80 hover:shadow-xl',
        className
      )}
      style={borderColor ? { borderLeftColor: borderColor } : undefined}
    >
      <div className="p-5">{children}</div>
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex justify-between items-start', className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <h3 className={cn('font-semibold text-lg text-gray-100 mb-2', className)}>{children}</h3>;
}

export function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('', className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mt-3 pt-3 border-t border-gray-700/50', className)}>{children}</div>;
}

export function CardItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string | ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex justify-between items-center mb-1', className)}>
      <span className="text-xs text-gray-400">{label}:</span>
      {typeof value === 'string' ? <span className="text-sm text-gray-300">{value}</span> : value}
    </div>
  );
}
