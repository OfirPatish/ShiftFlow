'use client';

import { useSession } from 'next-auth/react';
import { UserCircle, Mail, User, Calendar } from 'lucide-react';
import { FullPageSpinner } from '@/components/core/feedback/LoadingSpinner';
import Image from 'next/image';
import PageLayout from '@/components/layout/templates/PageLayout';

export default function ProfileSettings() {
  const { data: session, status } = useSession();

  // Show loading spinner while session is loading
  if (status === 'loading') {
    return <FullPageSpinner />;
  }

  // At this point, session is guaranteed to exist because the parent layout uses requireAuth()
  return (
    <PageLayout
      title="Profile Settings"
      subtitle="Manage your personal information and account settings"
      maxContentWidth="4xl"
    >
      <div className="bg-theme-light/90 backdrop-blur-sm rounded-xl border border-theme-border/50 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-theme-accent/20">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-theme-accent/30 via-theme-accent/20 to-transparent p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-theme-accent to-blue-500 rounded-full blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center bg-theme-dark/80 border-4 border-theme-border/50 overflow-hidden shadow-lg relative z-10 group-hover:border-theme-accent/70 transition-all duration-300">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={144}
                  height={144}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <UserCircle className="w-24 h-24 text-gray-400" />
              )}
            </div>
          </div>
          <div className="text-center md:text-left md:ml-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
              {session?.user?.name || 'User'}
            </h2>
            <div className="flex items-center justify-center md:justify-start text-gray-300 bg-theme-dark/30 px-4 py-2 rounded-full backdrop-blur-sm shadow-inner inline-flex">
              <Mail className="w-4 h-4 mr-3 text-theme-accent" />
              <span className="text-sm">{session?.user?.email}</span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-10">
          <h3 className="text-xl font-semibold text-white mb-8 flex items-center border-b border-theme-border/40 pb-4">
            <User className="w-5 h-5 mr-3 text-theme-accent" />
            <span>Profile Information</span>
          </h3>

          <div className="space-y-6 transition-all duration-300">
            <div className="bg-theme-dark/30 backdrop-blur-sm p-6 rounded-xl hover:bg-theme-dark/40 transition-all duration-300 border border-theme-border/30 hover:border-theme-border/50 shadow-md hover:shadow-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-theme-accent/10 p-2 rounded-lg">
                  <User className="w-5 h-5 text-theme-accent" />
                </div>
                <span className="font-medium text-white tracking-wide">Name</span>
              </div>
              <p className="text-gray-300 pl-10 mt-2 font-light">
                {session?.user?.name || 'Not provided'}
              </p>
            </div>

            <div className="bg-theme-dark/30 backdrop-blur-sm p-6 rounded-xl hover:bg-theme-dark/40 transition-all duration-300 border border-theme-border/30 hover:border-theme-border/50 shadow-md hover:shadow-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-theme-accent/10 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-theme-accent" />
                </div>
                <span className="font-medium text-white tracking-wide">Email Address</span>
              </div>
              <p className="text-gray-300 pl-10 mt-2 font-light">
                {session?.user?.email || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="mt-10 text-sm text-gray-400 bg-theme-dark/20 backdrop-blur-sm p-5 rounded-xl border border-theme-border/30 shadow-inner">
            <p className="flex items-center">
              <Calendar className="w-4 h-4 mr-3 text-theme-accent/80" />
              <span className="opacity-80">
                This is all the information currently available in your profile.
              </span>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
