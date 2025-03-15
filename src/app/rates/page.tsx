'use client';

import { useState, useEffect, useRef } from 'react';
import { useRates } from '@/hooks/api/useRates';
import { Rate } from '@/types/models/rates';
import RateCard from '@/components/rates/RateCard';
import RateModal from '@/components/rates/RateModal';
import ConfirmDialog from '@/components/core/modals/ConfirmDialog';
import { showSuccessToast, showErrorToast } from '@/lib/utils/notificationToasts';
import { FullPageSpinner } from '@/components/core/feedback/LoadingSpinner';
import EmptyRates from '@/components/rates/EmptyRates';
import PageLayout from '@/components/layout/templates/PageLayout';
import { RateFormData } from '@/types/models/rates';

export default function Rates() {
  const {
    rates,
    isLoading: apiLoading,
    isSubmitting: apiSubmitting,
    createRate,
    updateRate,
    deleteRate,
  } = useRates();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRate, setCurrentRate] = useState<Rate | undefined>();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<string | null>(null);
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
      setCurrentRate(undefined);
      setIsSubmitting(false);
      setIsDeleteConfirmOpen(false);
      setRateToDelete(null);
    };
  }, []);

  const handleAddRate = () => {
    setCurrentRate(undefined);
    setIsModalOpen(true);
  };

  const handleEditRate = (rate: Rate) => {
    setCurrentRate(rate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isDeleteConfirmOpen && !isSubmitting && !apiSubmitting) {
      setIsModalOpen(false);
      setTimeout(() => {
        setCurrentRate(undefined);
        setIsSubmitting(false);
      }, 300);
    }
  };

  const handleSubmitRate = async (data: RateFormData) => {
    if (isSubmitting || apiSubmitting) return;

    setIsSubmitting(true);
    try {
      if (currentRate) {
        await updateRate(currentRate._id, data);
        showSuccessToast('Rate updated successfully');
      } else {
        await createRate(data);
        showSuccessToast('Rate created successfully');
      }
      handleCloseModal();
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to save rate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (rateId: string) => {
    if (!isSubmitting && !apiSubmitting) {
      setRateToDelete(rateId);
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!rateToDelete || isSubmitting || apiSubmitting) return;

    setIsSubmitting(true);
    try {
      await deleteRate(rateToDelete);
      showSuccessToast('Rate deleted successfully');
      setIsDeleteConfirmOpen(false);
      setRateToDelete(null);
      setIsModalOpen(false);
      // Reset current rate after a short delay
      setTimeout(() => {
        setCurrentRate(undefined);
        setIsSubmitting(false);
      }, 300);
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to delete rate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setRateToDelete(null);
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <PageLayout
      title="Pay Rates"
      subtitle="Manage your pay rates for different employers"
      actionLabel="Add Rate"
      onAction={handleAddRate}
    >
      {rates.length === 0 ? (
        <EmptyRates />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rates.map((rate) => (
            <RateCard key={rate._id} rate={rate} onEdit={() => handleEditRate(rate)} />
          ))}
        </div>
      )}

      {/* Rate modal for add/edit */}
      <RateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitRate}
        title={currentRate ? 'Edit Pay Rate' : 'Add New Pay Rate'}
        rate={currentRate}
        employerId={currentRate?.employerId}
        isSubmitting={isSubmitting || apiSubmitting}
        onDelete={currentRate ? handleDeleteClick : undefined}
        allowOutsideClick={!isSubmitting && !apiSubmitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Rate"
        message="Are you sure you want to delete this rate? This action cannot be undone. Make sure this rate is not used in any shifts."
      />
    </PageLayout>
  );
}
