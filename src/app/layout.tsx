import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LayoutProvider } from '@/context/LayoutContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShiftFlow - Personal Shift Tracker',
  description:
    'Easily track your work shifts, calculate income, and manage your employment sources',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Helper to manage body overflow during loading
            const setBodyOverflow = (state) => {
              document.body.style.overflow = state;
            };
            
            // Listen for loading state changes
            window.addEventListener('app-loading-started', () => {
              setBodyOverflow('hidden');
            });
            
            window.addEventListener('app-loading-ended', () => {
              setBodyOverflow('auto');
            });
          `,
          }}
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233B82F6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect><line x1='16' y1='2' x2='16' y2='6'></line><line x1='8' y1='2' x2='8' y2='6'></line><line x1='3' y1='10' x2='21' y2='10'></line></svg>"
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <AuthProvider>
          <LayoutProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                success: {
                  duration: 3000,
                  style: {
                    background: 'linear-gradient(to right, #059669, #10B981)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                    fontWeight: '500',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  },
                  iconTheme: {
                    primary: '#FFFFFF',
                    secondary: '#059669',
                  },
                },
                error: {
                  duration: 4000,
                  style: {
                    background: 'linear-gradient(to right, #DC2626, #EF4444)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                    fontWeight: '500',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  },
                  iconTheme: {
                    primary: '#FFFFFF',
                    secondary: '#DC2626',
                  },
                },
                style: {
                  borderRadius: '0.5rem',
                  padding: '16px',
                  maxWidth: '400px',
                },
              }}
            />
            {children}
          </LayoutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
