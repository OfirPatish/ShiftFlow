'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLogin } from '@/hooks/useLogin';
import {
  FormField,
  Checkbox,
  PasswordToggle,
  ErrorMessage,
  AuthLayout,
  AuthHeader,
  FormContainer,
  SubmitButton,
} from '@/components/auth/FormComponents';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  // Track field focus states
  const [emailFocused, setEmailFocused] = useState(false);

  const {
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
  } = useLogin();

  // Handle focus states
  const handleEmailFocus = () => setEmailFocused(true);
  const handleEmailBlur = () => setEmailFocused(false);

  return (
    <AuthLayout>
      {/* Header */}
      <AuthHeader
        title="Sign in to your account"
        subtitle="Track your shifts and manage your schedule"
      />

      {/* Error message */}
      <ErrorMessage error={error} />

      {/* Login form */}
      <FormContainer>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue={rememberMe.toString()} />

          <div className="space-y-4">
            {/* Email field */}
            <div>
              <FormField
                id="email-address"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                inputRef={emailInputRef}
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
              />
              {(emailFocused || email) && email && (
                <div className="mt-1 flex items-center text-xs">
                  {isValidEmail(email) ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 mr-1" />
                      <span className="text-green-400">Valid email format</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 text-yellow-400 mr-1" />
                      <span className="text-yellow-400">Please enter a valid email</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Password field with toggle and forgot password link */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <FormField
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                rightElement={
                  <PasswordToggle
                    showPassword={showPassword}
                    toggleVisibility={togglePasswordVisibility}
                  />
                }
              />
            </div>
          </div>

          {/* Remember me checkbox - centered */}
          <div className="flex justify-center">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              label="Remember me"
            />
          </div>

          {/* Submit button */}
          <SubmitButton isLoading={isLoading} loadingText="Signing in..." text="Sign in" />
        </form>
      </FormContainer>

      {/* Sign up link */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:text-primary-light transition-colors"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
