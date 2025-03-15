'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSettings } from '@/hooks/api/useSettings';
import { useEmployers } from '@/hooks/api/useEmployers';
import { showSuccessToast, showErrorToast } from '@/lib/utils/notificationToasts';
import { FullPageSpinner } from '@/components/core/feedback/LoadingSpinner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/data-display/Card';
import { Building2 } from 'lucide-react';
import { logError } from '@/lib/validation/errorHandlers';
import PageLayout from '@/components/layout/templates/PageLayout';

interface Rate {
  _id: string;
  name: string;
  baseRate: number;
  currency: string;
}

export default function Settings() {
  const { defaultEmployerId, defaultRateId, isLoading, updateSettings } = useSettings();
  const { employers, isLoading: loadingEmployers } = useEmployers();
  const [rates, setRates] = useState<Rate[]>([]);
  const [isRatesLoading, setIsRatesLoading] = useState(false);

  // Cache for rates to prevent unnecessary fetches
  const ratesCacheRef = useRef<{ [employerId: string]: Rate[] }>({});
  const hasFetchedRatesRef = useRef<{ [employerId: string]: boolean }>({});

  // Track if initial loading has completed
  const initialLoadCompletedRef = useRef(false);

  // Controlled loading state that ensures minimum display time
  const [isPageLoading, setIsPageLoading] = useState(true);
  const minLoadingTime = 1000; // 1 second

  // Handle loading state with minimum display time - improved to prevent tab switching issues
  useEffect(() => {
    // Only show loading state on initial load
    if ((isLoading || loadingEmployers) && !initialLoadCompletedRef.current) {
      setIsPageLoading(true);

      // When API loading is done
      if (!isLoading && !loadingEmployers) {
        const timer = setTimeout(() => {
          setIsPageLoading(false);
          initialLoadCompletedRef.current = true;
        }, minLoadingTime);

        return () => clearTimeout(timer);
      }
    } else if (!isLoading && !loadingEmployers && !initialLoadCompletedRef.current) {
      // If loading finishes and we haven't marked initial load as complete
      const timer = setTimeout(() => {
        setIsPageLoading(false);
        initialLoadCompletedRef.current = true;
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [isLoading, loadingEmployers, minLoadingTime]);

  // Memoized fetch rates function to prevent unnecessary re-renders
  const fetchRates = useCallback(async (employerId: string) => {
    if (!employerId) return;

    // If we already have rates for this employer, use cached data
    if (hasFetchedRatesRef.current[employerId]) {
      setRates(ratesCacheRef.current[employerId] || []);
      return;
    }

    try {
      setIsRatesLoading(true);
      const response = await fetch(`/api/rates?employerId=${employerId}`);

      if (response.ok) {
        const data = await response.json();
        setRates(data);

        // Cache the rates for this employer
        ratesCacheRef.current[employerId] = data;
        hasFetchedRatesRef.current[employerId] = true;
      }
    } catch (error) {
      logError('Settings:FetchRates', error);
      showErrorToast('Failed to fetch rates');
    } finally {
      setIsRatesLoading(false);
    }
  }, []);

  // Fetch rates when employer changes
  useEffect(() => {
    if (!defaultEmployerId) {
      setRates([]);
      return;
    }

    fetchRates(defaultEmployerId);
  }, [defaultEmployerId, fetchRates]);

  // Handle employer change
  const handleEmployerChange = async (employerId: string) => {
    try {
      // Don't update if the user selected the empty option
      if (!employerId) {
        // If they're clearing a previously set employer, that's a valid operation
        if (defaultEmployerId) {
          await updateSettings({
            defaultEmployerId: undefined,
            defaultRateId: undefined,
          });
          showSuccessToast('Default employer cleared');
        }
        return;
      }

      await updateSettings({
        defaultEmployerId: employerId,
        defaultRateId: undefined, // Clear the rate when employer changes
      });
      showSuccessToast('Default employer updated successfully');
    } catch (error) {
      showErrorToast('Failed to update default employer');
    }
  };

  // Handle rate change
  const handleRateChange = async (rateId: string) => {
    try {
      // Don't update if the user selected the empty option
      if (!rateId) {
        // If they're clearing a previously set rate, that's a valid operation
        if (defaultRateId) {
          await updateSettings({ defaultRateId: undefined });
          showSuccessToast('Default rate cleared');
        }
        return;
      }

      await updateSettings({ defaultRateId: rateId });
      showSuccessToast('Default rate updated successfully');
    } catch (error) {
      showErrorToast('Failed to update default rate');
    }
  };

  // Show loading state
  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <PageLayout
      title="Settings"
      subtitle="Customize your application preferences"
      maxContentWidth="4xl"
    >
      <Card className="border-l-4 border-primary-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary-400" />
            <CardTitle>Default Shift Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-6 text-sm">
            Set your default employer and pay rate for new shifts. This saves you time when creating
            new shifts by automatically selecting these values.
          </p>

          <div className="space-y-6">
            {/* Default Employer Selector */}
            <div>
              <label
                htmlFor="defaultEmployer"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Default Employer
              </label>
              <select
                id="defaultEmployer"
                className="w-full bg-gray-800/80 border border-gray-700 rounded-lg py-2.5 px-4 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-600 transition-all duration-200"
                value={defaultEmployerId || ''}
                onChange={(e) => handleEmployerChange(e.target.value)}
                disabled={isLoading || loadingEmployers}
              >
                <option value="" disabled={!!defaultEmployerId}>
                  -- Select an employer --
                </option>
                {employers.map((employer) => (
                  <option key={employer._id} value={employer._id}>
                    {employer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Default Rate Selector - Only show if employer is selected */}
            {defaultEmployerId && (
              <div>
                <label
                  htmlFor="defaultRate"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Default Pay Rate
                </label>
                <select
                  id="defaultRate"
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-lg py-2.5 px-4 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-600 transition-all duration-200"
                  value={defaultRateId || ''}
                  onChange={(e) => handleRateChange(e.target.value)}
                  disabled={isLoading || isRatesLoading}
                >
                  <option value="" disabled={!!defaultRateId}>
                    -- Select a rate --
                  </option>
                  {rates.map((rate) => (
                    <option key={rate._id} value={rate._id}>
                      {rate.name} (
                      {new Intl.NumberFormat('he-IL', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(rate.baseRate)}{' '}
                      {rate.currency})
                    </option>
                  ))}
                </select>
                {isRatesLoading && <p className="mt-2 text-sm text-gray-400">Loading rates...</p>}
                {!isRatesLoading && rates.length === 0 && (
                  <p className="mt-2 text-sm text-gray-400">
                    No rates found for this employer.{' '}
                    <a href="/rates" className="text-primary-400 hover:underline">
                      Create a rate
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
