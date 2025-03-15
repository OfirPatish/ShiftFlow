import React from 'react';
import { Button } from '@/components/ui/buttons/Button';
import { Check, Trash2 } from 'lucide-react';
import { Shift } from '@/types/models/shifts';

interface ShiftFormActionsProps {
  shift?: Shift;
  onDelete?: (shiftId: string) => void;
  isSubmitting: boolean;
  externalIsSubmitting: boolean;
}

export const ShiftFormActions: React.FC<ShiftFormActionsProps> = ({
  shift,
  onDelete,
  isSubmitting,
  externalIsSubmitting,
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (shift && onDelete) {
      onDelete(shift._id);
    }
  };

  return (
    <div className="flex justify-end pt-4 mt-6 border-t border-gray-700/50">
      {/* Right side buttons */}
      <div className="flex space-x-3 justify-end">
        {/* Delete button - only show when editing an existing shift */}
        {shift && onDelete && (
          <Button
            type="button"
            onClick={handleDeleteClick}
            variant="danger"
            disabled={isSubmitting || externalIsSubmitting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || externalIsSubmitting}
          isLoading={isSubmitting || externalIsSubmitting}
        >
          {!(isSubmitting || externalIsSubmitting) && <Check className="h-4 w-4 mr-2" />}
          {shift ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};
