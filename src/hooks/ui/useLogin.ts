import { useState, useRef, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { logError } from '@/lib/validation/errorHandlers';

// Import the key from AuthContext or define it here if importing would create circular dependencies
const LOGOUT_EVENT_KEY = 'shiftflow_logout_timestamp';

export function useLogin() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Clear any logout events on mount
  useEffect(() => {
    try {
      // Remove any leftover logout events to prevent interference with login
      localStorage.removeItem(LOGOUT_EVENT_KEY);
    } catch (error) {
      logError('LoginHook', error);
    }
  }, []);

  // Check URL params and auto-focus
  useEffect(() => {
    // Check for registration success
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('registered') === 'true') setError('');

    // Auto-focus email field
    if (emailInputRef.current) emailInputRef.current.focus();

    // Check for expired sessions
    if (session?.expired) setError('Your session has expired. Please sign in again.');
  }, [session]);

  // Email validation with regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Clear any logout events from localStorage to ensure clean login
    try {
      localStorage.removeItem(LOGOUT_EVENT_KEY);
    } catch (error) {
      logError('LoginHook', error);
    }

    // Validate inputs
    if (!email.trim()) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/dashboard',
        remember: rememberMe,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Add a small delay before redirect to ensure the session is properly established
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 100);
    } catch (error) {
      setError('An error occurred during login');
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    isLoading,
    showPassword,
    emailInputRef,
    handleSubmit,
    togglePasswordVisibility,
    isValidEmail,
  };
}
