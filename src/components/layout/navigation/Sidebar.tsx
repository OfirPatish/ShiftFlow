'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Briefcase,
  Home,
  Settings,
  CircleUser,
  User,
  LogOut,
  DollarSign,
} from 'lucide-react';
import { broadcastSignOut } from '@/context/AuthContext';

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'Shifts',
      href: '/shifts',
      icon: Calendar,
    },
    {
      name: 'Employers',
      href: '/employers',
      icon: Briefcase,
    },
    {
      name: 'Pay Rates',
      href: '/rates',
      icon: DollarSign,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <div className="h-full flex flex-col bg-theme text-white shadow-xl border-r border-r-[0.5px] border-theme-border">
      {/* Header area with logo */}
      <div className="flex items-center p-3 pt-6 pl-5">
        <div className="flex items-center">
          <span className="font-bold text-base text-primary-400">ShiftFlow</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-5 space-y-2 mt-3">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            prefetch={true}
            className={`
              flex items-center py-2 rounded-md text-sm outline-none sidebar-link transition-colors duration-200
              ${
                isActive(item.href)
                  ? 'bg-theme-lighter text-white'
                  : 'text-gray-300 hover:bg-theme-lighter/80 hover:text-white'
              }
            `}
          >
            <item.icon className="flex-shrink-0 h-4 w-4 text-gray-400" aria-hidden="true" />
            <span className="ml-2 font-medium text-sm whitespace-nowrap">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User dropdown at the bottom */}
      <div className="p-4 pl-5 relative" ref={dropdownRef}>
        {session ? (
          <div>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-theme-lighter outline-none"
            >
              <CircleUser className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300 truncate flex-1 text-left">
                {session.user?.email || 'User'}
              </span>
            </button>

            <div
              className={`absolute bottom-full left-0 right-0 mx-4 mb-1 w-auto bg-theme-light rounded-lg overflow-hidden shadow-lg border border-theme-border z-50 transition-all duration-200 ease-in-out transform origin-bottom
                ${
                  isDropdownOpen
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                }`}
            >
              <Link
                href="/settings/profile"
                prefetch={true}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-theme-lighter hover:text-white flex items-center outline-none sidebar-link"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-theme-lighter hover:text-white flex items-center outline-none sidebar-link"
              >
                <LogOut className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                Sign out
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Sidebar;
