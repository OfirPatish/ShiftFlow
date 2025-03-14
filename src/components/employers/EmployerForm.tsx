'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { EmployerFormData, Employer } from '@/types/employers';
import { Check, Trash2, Building2, MapPin, Palette } from 'lucide-react';
import { FormInput } from '@/components/ui/FormInput';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface EmployerFormProps {
  employer?: Employer;
  onSubmit: (data: EmployerFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: (employerId: string) => void;
  isSubmitting: boolean;
}

// Predefined color options
const colorOptions = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
];

export default function EmployerForm({
  employer,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting,
}: EmployerFormProps) {
  const [formData, setFormData] = useState<EmployerFormData>({
    name: '',
    location: '',
    color: '#3B82F6', // Default blue
  });

  // Load employer data when editing
  useEffect(() => {
    if (employer) {
      setFormData({
        name: employer.name,
        location: employer.location || '',
        color: employer.color,
      });
    }
  }, [employer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorChange = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      color: color,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields with improved styling */}
      <div className="space-y-5">
        {/* Employer name field */}
        <div className="relative">
          <label
            htmlFor="name"
            className="flex items-center text-sm font-medium text-gray-100 mb-1.5"
          >
            <Building2 className="h-4 w-4 mr-1.5" />
            Employer Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter employer name"
            className="w-full bg-gray-800/80 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Location field */}
        <div className="relative">
          <label
            htmlFor="location"
            className="flex items-center text-sm font-medium text-gray-100 mb-1.5"
          >
            <MapPin className="h-4 w-4 mr-1.5" />
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="City, Country (optional)"
            className="w-full bg-gray-800/80 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Color picker with improved label */}
        <div className="relative">
          <div className="flex items-center text-sm font-medium text-gray-100 mb-1.5">
            <Palette className="h-4 w-4 mr-1.5" />
            Employer Color
          </div>
          <ColorPicker
            label=""
            selectedColor={formData.color || '#3B82F6'}
            onChange={handleColorChange}
            className="mt-1"
          />
        </div>
      </div>

      {/* Form action buttons */}
      <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-700/50">
        {/* Delete button - only show when editing an existing employer */}
        {employer && onDelete && (
          <Button type="button" onClick={() => onDelete(employer._id)} variant="danger">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}

        {/* Submit button */}
        <Button type="submit" disabled={isSubmitting} variant="primary">
          {isSubmitting ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              {employer ? 'Update' : 'Create'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
