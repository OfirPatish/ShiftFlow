'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ProfileSettings() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-400">Please sign in to access your profile settings.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-16 xl:px-24">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Profile Settings</h1>

        <div className="bg-theme-light p-6 rounded-lg border border-theme-border shadow-md">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-full md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center mb-4">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user?.name || 'User'}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-white font-bold">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <button className="btn btn-secondary w-full max-w-xs" disabled={isLoading}>
                  Change Profile Picture
                </button>
              </div>
            </div>

            <div className="w-full md:w-2/3 mt-6 md:mt-0">
              <form className="space-y-6">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-input"
                    defaultValue={session.user?.name || ''}
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-input bg-theme-light-darker"
                    value={session.user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                </div>

                <div className="flex justify-end mt-8">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
