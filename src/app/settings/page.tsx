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
  const {
    defaultEmployerId,
    defaultRateId,
    isLoading: settingsLoading,
    updateSettings,
  } = useSettings();
  const { employers, isLoading: loadingEmployers } = useEmployers();
  const [rates, setRates] = useState<Rate[]>([]);
  const [isRatesLoading, setIsRatesLoading] = useState(false);

  // Cache for rates to prevent unnecessary fetches
  const ratesCacheRef = useRef<{ [employerId: string]: Rate[] }>({});
  const hasFetchedRatesRef = useRef<{ [employerId: string]: boolean }>({});

  // Simplified loading state management
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadRef = useRef(true);

  // Handle loading state consistently with other pages
  useEffect(() => {
    if (!settingsLoading && !loadingEmployers && initialLoadRef.current) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        initialLoadRef.current = false;
      }, 1000); // 1 second minimum loading time

      return () => clearTimeout(timer);
    }
  }, [settingsLoading, loadingEmployers]);

  // Fetch rates for an employer
  const fetchRates = useCallback(
    async (employerId: string) => {
      try {
        // Return cached rates if available
        if (ratesCacheRef.current[employerId]) {
          setRates(ratesCacheRef.current[employerId]);
          return;
        }

        setIsRatesLoading(true);

        // Use existing flag to prevent duplicate fetches
        if (hasFetchedRatesRef.current[employerId]) {
          setIsRatesLoading(false);
          return;
        }

        const response = await fetch(`/api/rates?employerId=${employerId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch rates');
        }

        const data = await response.json();
        const fetchedRates: Rate[] = data;

        // Cache the rates
        ratesCacheRef.current[employerId] = fetchedRates;
        hasFetchedRatesRef.current[employerId] = true;
        setRates(fetchedRates);
      } catch (error) {
        logError('Settings:fetchRates', error);
        showErrorToast('Failed to load rates');
      } finally {
        setIsRatesLoading(false);
      }
    },
    [ratesCacheRef, hasFetchedRatesRef]
  );

  // Fetch rates when employer changes
  useEffect(() => {
    if (defaultEmployerId) {
      fetchRates(defaultEmployerId);
    } else {
      setRates([]);
    }
  }, [defaultEmployerId, fetchRates]);

  // Handle employer change
  const handleEmployerChange = async (employerId: string) => {
    try {
      // Don't update if the user selected the empty option
      if (!employerId) {
        // If they're clearing a previously set employer, that's a valid operation
        if (defaultEmployerId) {
          await updateSettings({ defaultEmployerId: undefined, defaultRateId: undefined });
          showSuccessToast('Default employer and rate cleared');
        }
        return;
      }

      // Update default employer, and clear default rate
      await updateSettings({ defaultEmployerId: employerId, defaultRateId: undefined });
      showSuccessToast('Default employer updated successfully');

      // Fetch rates for the new employer
      fetchRates(employerId);
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
                disabled={settingsLoading || loadingEmployers}
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
                  disabled={settingsLoading || isRatesLoading}
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
