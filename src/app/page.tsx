import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard page when accessing the root URL
  redirect('/dashboard');
}
