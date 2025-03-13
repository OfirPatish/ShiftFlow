import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export function useRegister() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on name input when component mounts
  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus();
  }, []);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 25;
    else if (password.length >= 6) strength += 15;

    // Add points for complexity
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    setPasswordStrength(Math.min(100, strength));
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Moderate';
    return 'Strong';
  };

  const handlePasswordFocus = () => setPasswordFocused(true);
  const handlePasswordBlur = () => setPasswordFocused(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Check if name contains at least two words (first and last name)
  const isValidFullName = (name: string) => {
    const trimmedName = name.trim();
    const nameParts = trimmedName.split(/\s+/);
    return nameParts.length >= 2 && nameParts.every((part) => part.length > 0);
  };

  // Email validation with regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password match validation
  const doPasswordsMatch = () => password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Name validation
    if (!name.trim()) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }

    if (!isValidFullName(name)) {
      setError('Please enter your full name (first and last name)');
      setIsLoading(false);
      return;
    }

    // Email validation
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

    // Password validation
    if (!password) {
      setError('Please enter a password');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your password');
      setIsLoading(false);
      return;
    }

    if (!doPasswordsMatch()) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Send registration request to the API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Redirect to login page on success
      router.push('/auth/login?registered=true');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred during registration');
      }
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    showPassword,
    showConfirmPassword,
    passwordStrength,
    passwordFocused,
    nameInputRef,
    getPasswordStrengthColor,
    getPasswordStrengthText,
    handlePasswordFocus,
    handlePasswordBlur,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
    isValidFullName,
    isValidEmail,
    doPasswordsMatch,
  };
}
