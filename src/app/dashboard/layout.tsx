import { ReactNode } from 'react';
import { requireAuth } from '@/lib/validation/authHelpers';
import AppLayout from '@/components/layout/templates/AppLayout';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // This will redirect to login if user is not authenticated
  await requireAuth();

  return <AppLayout>{children}</AppLayout>;
}
