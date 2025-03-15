'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { UserCircle, Mail, User } from 'lucide-react';
import { FullPageSpinner } from '@/components/core/feedback/LoadingSpinner';
import Image from 'next/image';
import PageLayout from '@/components/layout/templates/PageLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/data-display/Card';

export default function ProfileSettings() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadRef = useRef(true);

  // Handle loading state consistently with other pages
  useEffect(() => {
    if (status !== 'loading' && initialLoadRef.current) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        initialLoadRef.current = false;
      }, 1000); // 1 second minimum loading time

      return () => clearTimeout(timer);
    }
  }, [status]);

  // Show loading spinner while page is loading
  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <PageLayout title="Profile Settings" subtitle="Your account information" maxContentWidth="4xl">
      <Card className="border-l-4 border-primary-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-400" />
            <CardTitle>Profile Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gray-800/80 border-2 border-gray-700/40 overflow-hidden shadow-lg">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-20 h-20 text-gray-400" />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <div className="bg-gray-800/80 border border-gray-700 rounded-lg py-2.5 px-4 text-gray-200">
                  {session?.user?.name || 'User'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="bg-gray-800/80 border border-gray-700 rounded-lg py-2.5 px-4 text-gray-200 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary-400" />
                  {session?.user?.email}
                </div>
              </div>

              <p className="text-gray-400 text-sm mt-4">
                Contact support for assistance with profile changes. We're currently working on
                adding self-service profile management features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
