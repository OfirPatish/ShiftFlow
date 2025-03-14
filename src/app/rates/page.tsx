'use client';

import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useRates, Rate, RateFormData } from '@/hooks/useRates';
import { useEmployers } from '@/hooks/useEmployers';
import { showSuccessToast, showErrorToast, showWarningToast } from '@/lib/notificationToasts';
import RateCard from '@/components/rates/RateCard';
import EmptyRates from '@/components/rates/EmptyRates';
import RateModal from '@/components/rates/RateModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Search, Plus, Filter } from 'lucide-react';
import LoadingSpinner, { FullPageSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/Button';

export default function Rates() {
  const { employers, isLoading: loadingEmployers } = useEmployers();
  const {
    rates,
    isLoading: loadingRates,
    error,
    fetchRates,
    createRate,
    updateRate,
    deleteRate,
  } = useRates();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRate, setCurrentRate] = useState<Rate | undefined>(undefined);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<string | null>(null);

  // Controlled loading state that ensures minimum display time
  const [isLoading, setIsLoading] = useState(true);
  const minLoadingTime = 1000; // 1 second

  // Handle loading state with minimum display time
  useEffect(() => {
    if (loadingRates || loadingEmployers) {
      setIsLoading(true);
    } else {
      // When API loading is done, wait for minimum display time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [loadingRates, loadingEmployers, minLoadingTime]);

  // Open modal for creating a new rate
  const handleAddRate = () => {
    setCurrentRate(undefined);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing rate
  const handleEditRate = (rate: Rate) => {
    setCurrentRate(rate);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmitRate = async (data: RateFormData) => {
    try {
      if (currentRate) {
        // Update existing rate
        await updateRate(currentRate._id, data);
        showSuccessToast(`Rate "${data.name}" updated successfully`);
      } else {
        // Create new rate
        await createRate(data);
        showSuccessToast(`Rate "${data.name}" created successfully`);
      }
      // First close the modal
      setIsModalOpen(false);
      // Then reset current rate with a delay to prevent UI glitches
      setTimeout(() => {
        setCurrentRate(undefined);
      }, 300);
    } catch (error: any) {
      console.error('Error submitting rate:', error);
      showErrorToast(error.message || 'Failed to save rate');
    }
  };

  // Open confirmation dialog for deleting a rate
  const handleDeleteClick = (rateId: string) => {
    setRateToDelete(rateId);
    setIsDeleteConfirmOpen(true);
  };

  // Handle rate deletion with confirmation
  const handleConfirmDelete = async () => {
    if (rateToDelete) {
      try {
        await deleteRate(rateToDelete);
        showSuccessToast('Rate deleted successfully');
        setIsDeleteConfirmOpen(false);
        setRateToDelete(null);
        // Close the rate modal
        setIsModalOpen(false);
        // Add delay for state reset to prevent UI glitches
        setTimeout(() => {
          setCurrentRate(undefined);
        }, 300);
      } catch (error: any) {
        console.error('Error deleting rate:', error);
        showErrorToast(error.message || 'Error deleting rate');
      }
    }
  };

  // This is the key modification: Prevent closing the rate modal when the delete confirm dialog is open
  const handleCloseModal = () => {
    // Only close the modal if the delete confirmation dialog is not open
    if (!isDeleteConfirmOpen) {
      setIsModalOpen(false);
      // Add delay for state reset to prevent UI glitches
      setTimeout(() => {
        setCurrentRate(undefined);
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
          <h1 className="text-2xl font-bold text-gray-100 mb-2">Rates</h1>
          <p className="text-gray-400">Manage your pay rates for different employers</p>
        </div>

        <Button onClick={handleAddRate} variant="primary">
          Add Rate
        </Button>
      </div>

      {/* Rates list or empty state */}
      {rates.length === 0 ? (
        <EmptyRates onAddAction={handleAddRate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rates.map((rate) => (
            <RateCard
              key={rate._id}
              rate={rate}
              onEdit={() => handleEditRate(rate)}
              onDelete={() => handleDeleteClick(rate._id)}
            />
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
        employerId={currentRate?.employerId as string}
        onDelete={handleDeleteClick}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Pay Rate"
        message="Are you sure you want to delete this pay rate? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
