'use client';

import { useState, useEffect } from 'react';
import { useEmployers, Employer, EmployerFormData } from '@/hooks/useEmployers';
import EmployerCard from '@/components/employers/EmployerCard';
import EmptyEmployers from '@/components/employers/EmptyEmployers';
import EmployerModal from '@/components/employers/EmployerModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { showSuccessToast, showErrorToast } from '@/lib/notificationToasts';
import LoadingSpinner, { FullPageSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Search, Plus } from 'lucide-react';

export default function Employers() {
  const {
    employers,
    isLoading: apiLoading,
    error,
    createEmployer,
    updateEmployer,
    deleteEmployer,
  } = useEmployers();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentEmployer, setCurrentEmployer] = useState<Employer | null>(null);
  const [employerToDelete, setEmployerToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployers, setFilteredEmployers] = useState<Employer[]>([]);

  // Controlled loading state that ensures minimum display time
  const [isLoading, setIsLoading] = useState(true);
  const minLoadingTime = 1000; // 1 second

  // Handle loading state with minimum display time
  useEffect(() => {
    if (apiLoading) {
      setIsLoading(true);
    } else {
      // When API loading is done, wait for minimum display time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [apiLoading, minLoadingTime]);

  // Open modal for adding a new employer
  const handleAddEmployer = () => {
    setCurrentEmployer(null);
    setIsFormModalOpen(true);
  };

  // Open modal for editing an existing employer
  const handleEditEmployer = (employer: Employer) => {
    setCurrentEmployer(employer);
    setIsFormModalOpen(true);
  };

  // Prompt to confirm deletion
  const handleDeleteClick = (employerId: string) => {
    setEmployerToDelete(employerId);
    setIsDeleteConfirmOpen(true);
  };

  // Handle the actual deletion after confirmation
  const handleConfirmDelete = async () => {
    if (!employerToDelete) return;

    try {
      await deleteEmployer(employerToDelete);
      showSuccessToast('Employer deleted successfully');
      setIsDeleteConfirmOpen(false);
      setEmployerToDelete(null);
      // Close the form modal
      setIsFormModalOpen(false);
      // Add delay for state reset to prevent UI glitches
      setTimeout(() => {
        setCurrentEmployer(null);
      }, 300);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to delete employer');
    }
  };

  // Handle form submission for both create and update
  const handleSubmit = async (formData: EmployerFormData) => {
    setIsSubmitting(true);
    try {
      if (currentEmployer) {
        await updateEmployer(currentEmployer._id, formData);
        showSuccessToast('Employer updated successfully');
      } else {
        await createEmployer(formData);
        showSuccessToast('Employer created successfully');
      }
      // First close the modal
      setIsFormModalOpen(false);
      // Then reset current employer with a delay to prevent UI glitches
      setTimeout(() => {
        setCurrentEmployer(null);
      }, 300);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to save employer');
    } finally {
      setIsSubmitting(false);
    }
  };

  // This is the key modification: Prevent closing the form modal when the delete confirm dialog is open
  const handleCloseFormModal = () => {
    // Only close the form modal if the delete confirmation dialog is not open
    if (!isDeleteConfirmOpen) {
      setIsFormModalOpen(false);
      // Add delay for state reset to prevent UI glitches
      setTimeout(() => {
        setCurrentEmployer(null);
      }, 300);
    }
  };

  // Always show loading indicator first
  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-16 xl:px-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 mb-2">Employers</h1>
          <p className="text-gray-400">Manage your employers and work locations</p>
        </div>
        <Button onClick={handleAddEmployer} variant="primary">
          Add Employer
        </Button>
      </div>

      {/* Employers list or empty state */}
      {employers.length === 0 ? (
        <EmptyEmployers onAddAction={handleAddEmployer} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employers.map((employer) => (
            <EmployerCard
              key={employer._id}
              employer={employer}
              onEdit={() => handleEditEmployer(employer)}
              onDelete={() => handleDeleteClick(employer._id)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Employer Modal */}
      <EmployerModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleSubmit}
        title={currentEmployer ? 'Edit Employer' : 'Add New Employer'}
        employer={currentEmployer || undefined}
        onDelete={handleDeleteClick}
        isSubmitting={isSubmitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employer"
        message="Are you sure you want to delete this employer? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
