import { ReactNode } from 'react';
import { requireAuth } from '@/lib/authHelpers';
import MainLayout from '@/components/layout/MainLayout';

export default async function RatesLayout({ children }: { children: ReactNode }) {
  // This will redirect to login if user is not authenticated
  await requireAuth();

  return <MainLayout>{children}</MainLayout>;
}
