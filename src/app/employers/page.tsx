'use client';

import { useState, useEffect, useRef } from 'react';
import { useEmployers } from '@/hooks/api/useEmployers';
import { Employer } from '@/types/models/employers';
import EmployerCard from '@/components/employers/EmployerCard';
import EmployerModal from '@/components/employers/EmployerModal';
import ConfirmDialog from '@/components/core/modals/ConfirmDialog';
import { showSuccessToast, showErrorToast } from '@/lib/utils/notificationToasts';
import { FullPageSpinner } from '@/components/core/feedback/LoadingSpinner';
import EmptyEmployers from '@/components/employers/EmptyEmployers';
import PageLayout from '@/components/layout/templates/PageLayout';
import { EmployerFormData } from '@/types/models/employers';

export default function Employers() {
  const {
    employers,
    isLoading: apiLoading,
    isSubmitting: apiSubmitting,
    createEmployer,
    updateEmployer,
    deleteEmployer,
  } = useEmployers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployer, setCurrentEmployer] = useState<Employer | undefined>();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [employerToDelete, setEmployerToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadRef = useRef(true);

  // Handle loading state with minimum display time
  useEffect(() => {
    if (!apiLoading && initialLoadRef.current) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        initialLoadRef.current = false;
      }, 1000); // 1 second minimum loading time

      return () => clearTimeout(timer);
    }
  }, [apiLoading]);

  // Cleanup effect for modal state
  useEffect(() => {
    return () => {
      setIsModalOpen(false);
      setCurrentEmployer(undefined);
      setIsSubmitting(false);
      setIsDeleteConfirmOpen(false);
      setEmployerToDelete(null);
    };
  }, []);

  const handleAddEmployer = () => {
    setCurrentEmployer(undefined);
    setIsModalOpen(true);
  };

  const handleEditEmployer = (employer: Employer) => {
    setCurrentEmployer(employer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isDeleteConfirmOpen && !isSubmitting && !apiSubmitting) {
      setIsModalOpen(false);
      setTimeout(() => {
        setCurrentEmployer(undefined);
        setIsSubmitting(false);
      }, 300);
    }
  };

  const handleSubmitEmployer = async (data: EmployerFormData) => {
    if (isSubmitting || apiSubmitting) return;

    setIsSubmitting(true);
    try {
      if (currentEmployer) {
        await updateEmployer(currentEmployer._id, data);
        showSuccessToast('Employer updated successfully');
      } else {
        await createEmployer(data);
        showSuccessToast('Employer created successfully');
      }
      handleCloseModal();
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to save employer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (employerId: string) => {
    if (!isSubmitting && !apiSubmitting) {
      setEmployerToDelete(employerId);
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!employerToDelete || isSubmitting || apiSubmitting) return;

    setIsSubmitting(true);
    try {
      await deleteEmployer(employerToDelete);
      showSuccessToast('Employer deleted successfully');
      setIsDeleteConfirmOpen(false);
      setEmployerToDelete(null);
      setIsModalOpen(false);
      setTimeout(() => {
        setCurrentEmployer(undefined);
        setIsSubmitting(false);
      }, 300);
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to delete employer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setEmployerToDelete(null);
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <PageLayout
      title="Employers"
      subtitle="Manage your employers and their details"
      actionLabel="Add Employer"
      onAction={handleAddEmployer}
    >
      {employers.length === 0 ? (
        <EmptyEmployers onAddAction={handleAddEmployer} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employers.map((employer) => (
            <EmployerCard
              key={employer._id}
              employer={employer}
              onEdit={() => handleEditEmployer(employer)}
            />
          ))}
        </div>
      )}

      {/* Employer modal for add/edit */}
      <EmployerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEmployer}
        title={currentEmployer ? 'Edit Employer' : 'Add New Employer'}
        employer={currentEmployer}
        isSubmitting={isSubmitting || apiSubmitting}
        onDelete={currentEmployer ? handleDeleteClick : undefined}
        allowOutsideClick={!isSubmitting && !apiSubmitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Employer"
        message="Are you sure you want to delete this employer? This action cannot be undone. Make sure to delete all associated pay rates first."
      />
    </PageLayout>
  );
}
