import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface UserSettings {
  defaultEmployerId?: string;
  defaultRateId?: string;
}

export function useSettings() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<UserSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user settings
  const fetchSettings = useCallback(async () => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch settings from API
      const response = await fetch('/api/settings');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Update user settings
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!session?.user) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }

      const data = await response.json();
      setSettings(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating settings:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load settings when component mounts
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    defaultEmployerId: settings.defaultEmployerId,
    defaultRateId: settings.defaultRateId,
    isLoading,
    error,
    updateSettings,
    fetchSettings,
  };
}
