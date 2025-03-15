'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/tailwindUtils';

export interface ColorOption {
  name: string;
  value: string;
}

export interface ColorPickerProps {
  label?: string;
  selectedColor: string;
  onChange: (color: string) => void;
  predefinedColors?: ColorOption[];
  showCustomInput?: boolean;
  className?: string;
}

// Default color options
const defaultColors: ColorOption[] = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
];

export function ColorPicker({
  label = 'Color',
  selectedColor,
  onChange,
  predefinedColors = defaultColors,
  showCustomInput = true,
  className,
}: ColorPickerProps) {
  return (
    <div className={cn('', className)}>
      {label && <label className="block mb-3 text-sm font-medium text-gray-200">{label}</label>}

      <div className="grid grid-cols-8 gap-3 mb-4">
        {predefinedColors.map((color) => (
          <div
            key={color.value}
            className={`relative h-9 w-full rounded-md cursor-pointer transition-transform hover:scale-110 ${
              selectedColor === color.value
                ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white transform scale-105'
                : 'border border-gray-700'
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => onChange(color.value)}
            title={color.name}
          >
            {selectedColor === color.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check
                  className="h-5 w-5 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]"
                  strokeWidth={3}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {showCustomInput && (
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-md border border-gray-700 overflow-hidden"
            style={{ backgroundColor: selectedColor }}
          />
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 bg-gray-800/80 border border-gray-700 rounded-lg cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
