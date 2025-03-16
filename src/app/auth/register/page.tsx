'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '@/hooks/ui/useRegister';
import {
  FormField,
  PasswordToggle,
  PasswordStrength,
  ErrorMessage,
  AuthLayout,
  AuthHeader,
  FormContainer,
  SubmitButton,
} from '@/components/auth/FormComponents';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  // Track field focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const {
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
  } = useRegister();

  // Handle focus states
  const handleNameFocus = () => setNameFocused(true);
  const handleNameBlur = () => setNameFocused(false);
  const handleEmailFocus = () => setEmailFocused(true);
  const handleEmailBlur = () => setEmailFocused(false);
  const handleConfirmPasswordFocus = () => setConfirmPasswordFocused(true);
  const handleConfirmPasswordBlur = () => setConfirmPasswordFocused(false);

  return (
    <AuthLayout>
      {/* Header */}
      <AuthHeader title="Create an account" subtitle="Start managing your shifts efficiently" />

      {/* Error message */}
      <ErrorMessage error={error} />

      {/* Registration form */}
      <FormContainer>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name field with helper text */}
            <div>
              <FormField
                id="name"
                label="Full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and Last name"
                inputRef={nameInputRef}
                onFocus={handleNameFocus}
                onBlur={handleNameBlur}
              />
              {(nameFocused || name) && (
                <div className="mt-1 flex items-center text-xs">
                  {name && isValidFullName(name) ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 mr-1" />
                      <span className="text-green-400">Valid full name</span>
                    </>
                  ) : (
                    <span
                      className={`text-gray-400 ${
                        !isValidFullName(name) && name ? 'text-yellow-400' : ''
                      }`}
                    >
                      Please enter both your first and last name
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Email field */}
            <div>
              <FormField
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
              />
              {(emailFocused || email) && (
                <div className="mt-1 flex items-center text-xs">
                  {email && isValidEmail(email) ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 mr-1" />
                      <span className="text-green-400">Valid email format</span>
                    </>
                  ) : (
                    email && (
                      <>
                        <AlertCircle className="h-3.5 w-3.5 text-yellow-400 mr-1" />
                        <span className="text-yellow-400">Please enter a valid email</span>
                      </>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Password field with strength meter */}
            <div>
              <FormField
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                rightElement={
                  <PasswordToggle
                    showPassword={showPassword}
                    toggleVisibility={togglePasswordVisibility}
                  />
                }
              />
              {(passwordFocused || password) && (
                <PasswordStrength
                  password={password}
                  strength={passwordStrength}
                  getColor={getPasswordStrengthColor}
                  getText={getPasswordStrengthText}
                />
              )}
            </div>

            {/* Confirm password field */}
            <div>
              <FormField
                id="confirm-password"
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                onFocus={handleConfirmPasswordFocus}
                onBlur={handleConfirmPasswordBlur}
                rightElement={
                  <PasswordToggle
                    showPassword={showConfirmPassword}
                    toggleVisibility={toggleConfirmPasswordVisibility}
                  />
                }
              />
              {(confirmPasswordFocused || confirmPassword) && password && confirmPassword && (
                <div className="mt-1 flex items-center text-xs">
                  {doPasswordsMatch() ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 mr-1" />
                      <span className="text-green-400">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 text-red-400 mr-1" />
                      <span className="text-red-400">Passwords don&apos;t match</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit button */}
          <SubmitButton
            isLoading={isLoading}
            loadingText="Creating account..."
            text="Create account"
          />

          {/* Terms and conditions */}
          <p className="text-xs text-gray-400 text-center">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary hover:text-primary-light">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:text-primary-light">
              Privacy Policy
            </a>
          </p>
        </form>
      </FormContainer>

      {/* Sign in link */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            prefetch={true}
            className="font-medium text-primary hover:text-primary-light transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
