'use client';

import Link from 'next/link';
import { Building2, DollarSign } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useEmployers } from '@/hooks/useEmployers';
import { useState, useEffect } from 'react';

interface Rate {
  _id: string;
  name: string;
  baseRate: number;
  currency: string;
}

const Header = () => {
  const { defaultEmployerId, defaultRateId } = useSettings();
  const { employers } = useEmployers();
  const [currentEmployer, setCurrentEmployer] = useState<string | null>(null);
  const [currentRate, setCurrentRate] = useState<Rate | null>(null);

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

  // Fetch rate details if we have a default rate
  useEffect(() => {
    if (defaultEmployerId && defaultRateId) {
      const fetchRate = async () => {
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
      };

      fetchRate();
    } else {
      setCurrentRate(null);
    }
  }, [defaultEmployerId, defaultRateId]);

  return (
    <header className="bg-theme border-b border-b-[0.5px] border-theme-border shadow-md z-10">
      <div className="w-full relative h-16">
        {/* App name on the left with padding */}
        <div className="absolute left-4 sm:left-5 lg:left-6 top-1/2 transform -translate-y-1/2">
          <span className="text-xl font-bold text-primary-400 lg:hidden">ShiftFlow</span>
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
