'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  CalendarIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const BottomNav = () => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Shifts',
      href: '/shifts',
      icon: CalendarIcon,
    },
    {
      name: 'Employers',
      href: '/employers',
      icon: BriefcaseIcon,
    },
    {
      name: 'Pay Rates',
      href: '/rates',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-theme-light border-t border-theme-border shadow-lg">
      <div className="flex justify-around items-center h-16 px-1">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            prefetch={true}
            className="flex flex-col items-center justify-center w-full h-full text-xs py-1"
            onClick={(e) => {
              // Only use default navigation if it's not already the active route
              if (isActive(item.href)) {
                e.preventDefault();
              }
            }}
          >
            <item.icon
              className={`h-5 w-5 mb-1 transition-colors duration-200 ${
                isActive(item.href) ? 'text-primary-400' : 'text-gray-400 group-hover:text-gray-300'
              }`}
              aria-hidden="true"
            />
            <span
              className={`transition-colors duration-200 ${
                isActive(item.href) ? 'text-primary-400 font-medium' : 'text-gray-300'
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
