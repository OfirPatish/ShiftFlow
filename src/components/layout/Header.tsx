'use client';

import Link from 'next/link';
import { Building2, DollarSign, User, LogOut, CircleUser } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useEmployers } from '@/hooks/useEmployers';
import { useState, useEffect, useRef } from 'react';
import { useRates } from '@/hooks/useRates';
import { useSession } from 'next-auth/react';
import { broadcastSignOut } from '@/context/AuthContext';

interface Rate {
  _id: string;
  name: string;
  baseRate: number;
  currency: string;
}

const Header = () => {
  const { defaultEmployerId, defaultRateId, isLoading: settingsLoading } = useSettings();
  const { employers } = useEmployers();
  const { rates, isLoading: ratesLoading, fetchRates } = useRates(defaultEmployerId || '');
  const [currentEmployer, setCurrentEmployer] = useState<string | null>(null);
  const [currentRate, setCurrentRate] = useState<Rate | null>(null);
  const { data: session } = useSession();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    // Trigger sign-out across tabs using our simplified method
    await broadcastSignOut({ callbackUrl: '/auth/login' });
  };

  // Find employer name
  useEffect(() => {
    if (defaultEmployerId && employers.length > 0) {
      const employer = employers.find((emp) => emp._id === defaultEmployerId);
      if (employer) {
        setCurrentEmployer(employer.name);
      }
    } else {
      setCurrentEmployer(null);
    }
  }, [defaultEmployerId, employers]);

  // When default employer changes, refetch rates
  useEffect(() => {
    if (defaultEmployerId) {
      fetchRates(defaultEmployerId);
    }
  }, [defaultEmployerId, fetchRates]);

  // Get rate details from our rates array rather than fetching
  useEffect(() => {
    if (defaultRateId && rates.length > 0) {
      const rate = rates.find((rate) => rate._id === defaultRateId);
      if (rate) {
        setCurrentRate(rate);
      } else {
        // Fallback to API fetch if not found in rates array
        fetchRateFromApi();
      }
    } else if (defaultRateId) {
      // If we have a rate ID but no rates loaded yet, fetch from API
      fetchRateFromApi();
    } else {
      setCurrentRate(null);
    }

    async function fetchRateFromApi() {
      try {
        const response = await fetch(`/api/rates/${defaultRateId}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentRate(data);
        }
      } catch (error) {
        console.error('Error fetching rate details:', error);
        setCurrentRate(null);
      }
    }
  }, [defaultRateId, rates, defaultEmployerId, settingsLoading]);

  return (
    <header className="bg-theme border-b border-b-[0.5px] border-theme-border shadow-md z-10">
      <div className="w-full relative h-16">
        {/* App name on the left with padding */}
        <div className="absolute left-4 sm:left-5 lg:left-6 top-1/2 transform -translate-y-1/2">
          <span className="text-xl font-bold text-primary-400 lg:hidden">ShiftFlow</span>
        </div>

        {/* User profile button on mobile only */}
        <div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:hidden"
          ref={profileDropdownRef}
        >
          {session && (
            <div>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center justify-center h-8 w-8 bg-theme-light rounded-full hover:bg-theme-lighter transition-colors"
                aria-label="User profile"
              >
                <CircleUser className="h-5 w-5 text-primary-400" />
              </button>

              {/* Dropdown menu */}
              <div
                className={`absolute top-full mt-1 left-1/2 transform -translate-x-1/2 w-48 bg-theme-light rounded-lg overflow-hidden shadow-lg border border-theme-border z-50 transition-all duration-200 ease-in-out
                  ${
                    isProfileDropdownOpen
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                  }`}
              >
                <div className="px-4 py-3 border-b border-theme-border">
                  <p className="text-sm font-medium text-gray-200">
                    {session.user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{session.user?.email || ''}</p>
                </div>
                <Link
                  href="/settings/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-theme-lighter hover:text-white flex items-center outline-none"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <User className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-theme-lighter hover:text-white flex items-center outline-none"
                >
                  <LogOut className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings on the absolute right edge with no padding */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center">
          {currentEmployer && (
            <Link
              href="/settings"
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors px-2 py-0.5 rounded-l"
            >
              <Building2 className="h-3.5 w-3.5 text-primary-400" />
              <span>{currentEmployer}</span>
            </Link>
          )}

          {currentRate && (
            <Link
              href="/settings"
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors px-2 pr-4 py-0.5 rounded-l"
            >
              <DollarSign className="h-3.5 w-3.5 text-green-400" />
              <span>{currentRate.name}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
