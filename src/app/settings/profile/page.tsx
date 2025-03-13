'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { UserCircle, Mail, User, Shield } from 'lucide-react';
import { FullPageSpinner } from '@/components/common/LoadingSpinner';

export default function ProfileSettings() {
  const { data: session } = useSession();

  // Controlled loading state that ensures minimum display time
  const [isLoading, setIsLoading] = useState(true);
  const minLoadingTime = 1000; // 1 second
  const initialLoadCompletedRef = useRef(false);

  // Handle loading state with minimum display time
  useEffect(() => {
    // Only show loading state on initial load
    if (!session && !initialLoadCompletedRef.current) {
      setIsLoading(true);
    } else if (session && !initialLoadCompletedRef.current) {
      // When session is loaded, wait for minimum display time
      const timer = setTimeout(() => {
        setIsLoading(false);
        initialLoadCompletedRef.current = true;
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [session, minLoadingTime]);

  // Show loading spinner while page is loading
  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="bg-theme-light p-8 rounded-lg border border-theme-border shadow-lg text-center">
          <UserCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-300 text-lg font-medium mb-2">Not Signed In</p>
          <p className="text-gray-400">Please sign in to access your profile settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Profile Settings</h1>

      <div className="bg-theme-light rounded-lg border border-theme-border shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-theme-accent/30 to-theme-accent/10 p-6 flex flex-col md:flex-row items-center md:items-start">
          <div className="relative mb-4 md:mb-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center bg-theme-dark border-2 border-theme-border overflow-hidden shadow-lg transition-all duration-300 hover:border-theme-accent">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-20 h-20 text-gray-400" />
              )}
            </div>
          </div>
          <div className="ml-0 md:ml-6 text-center md:text-left">
            <h2 className="text-xl font-semibold text-white mb-1">
              {session.user?.name || 'User'}
            </h2>
            <p className="text-gray-400">{session.user?.email}</p>
          </div>
        </div>

        {/* Account Information */}
        <div className="p-6 border-b border-theme-border">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-theme-accent" />
            Account Information
          </h3>
          <div className="space-y-3 text-gray-300 ml-7">
            <div className="flex flex-col sm:flex-row sm:items-center py-2 sm:space-x-2">
              <span className="text-gray-400 mb-1 sm:mb-0">Account Type:</span>
              <span className="px-3 py-1 bg-gray-700/50 rounded-full text-sm">Standard</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center py-2 sm:space-x-2">
              <span className="text-gray-400 mb-1 sm:mb-0">Member Since:</span>
              <span className="px-3 py-1 bg-gray-700/50 rounded-full text-sm">January 2023</span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-theme-accent" />
              Personal Information
            </h3>
          </div>

          <div className="space-y-4 transition-all duration-300 ml-7">
            <div className="bg-theme-dark/50 p-4 rounded-md hover:bg-theme-dark/70 transition-colors duration-200">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5 text-theme-accent" />
                <span className="text-sm font-medium text-gray-400">Name</span>
              </div>
              <p className="text-white pl-7">{session.user?.name || 'Not provided'}</p>
            </div>

            <div className="bg-theme-dark/50 p-4 rounded-md hover:bg-theme-dark/70 transition-colors duration-200">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="w-5 h-5 text-theme-accent" />
                <span className="text-sm font-medium text-gray-400">Email Address</span>
              </div>
              <p className="text-white pl-7">{session.user?.email || 'Not provided'}</p>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500 bg-gray-800/30 p-3 rounded-md border border-gray-700/50">
            <p className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              Need help? Contact support at{' '}
              <a
                href="mailto:support@shiftflow.com"
                className="ml-1 text-primary-400 hover:text-primary-300 transition-colors duration-200"
              >
                support@shiftflow.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
