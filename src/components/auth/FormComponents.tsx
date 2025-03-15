import React from 'react';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

// Define types for FormField props
interface FormFieldProps {
  id: string;
  label?: string;
  type?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  inputRef?: React.RefObject<HTMLInputElement> | null;
  rightElement?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Reusable form field component
export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = true,
  inputRef = null,
  rightElement = null,
  onFocus,
  onBlur,
}) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
    )}
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        name={id}
        type={type}
        autoComplete={id}
        required={required}
        className="relative block w-full rounded-md border-0 py-2.5 px-4 bg-gray-800/40 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all duration-200"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {rightElement}
    </div>
  </div>
);

// Define types for Checkbox props
interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label: string;
}

// Custom checkbox component
export const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onChange, label }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer select-none">
    <div className="relative inline-block h-4 w-4">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="absolute opacity-0 w-full h-full cursor-pointer z-10"
      />
      <div
        className={`absolute inset-0 rounded border transition-colors duration-200 ${
          checked ? 'bg-primary border-primary' : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        {checked && (
          <CheckCircle2 className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        )}
      </div>
    </div>
    <span className="ml-2 text-sm text-gray-300">{label}</span>
  </label>
);

// Password visibility toggle button component
interface PasswordToggleProps {
  showPassword: boolean;
  toggleVisibility: () => void;
}

export const PasswordToggle: React.FC<PasswordToggleProps> = ({
  showPassword,
  toggleVisibility,
}) => (
  <button
    type="button"
    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
    onClick={toggleVisibility}
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
  </button>
);

// Password strength meter component
interface PasswordStrengthProps {
  password: string;
  strength: number;
  getColor: () => string;
  getText: () => string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  strength,
  getColor,
  getText,
}) => (
  <div className="mt-2 space-y-2">
    <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-300 ${getColor()}`}
        style={{ width: `${strength}%` }}
      ></div>
    </div>
    <div className="flex justify-between items-center text-xs">
      <span className="text-gray-400">Password strength:</span>
      <span
        className={
          strength < 30 ? 'text-red-400' : strength < 60 ? 'text-yellow-400' : 'text-green-400'
        }
      >
        {getText()}
      </span>
    </div>

    {/* Password requirements checklist */}
    <div className="grid grid-cols-2 gap-y-1 text-xs mt-1">
      <PasswordRequirement met={password.length >= 6} text="At least 6 characters" />
      <PasswordRequirement met={/[A-Z]/.test(password)} text="Uppercase letter" />
      <PasswordRequirement met={/[0-9]/.test(password)} text="Number" />
      <PasswordRequirement met={/[^A-Za-z0-9]/.test(password)} text="Special character" />
    </div>
  </div>
);

// Password requirement item
interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

export const PasswordRequirement: React.FC<PasswordRequirementProps> = ({ met, text }) => (
  <div className="flex items-center">
    {met ? (
      <CheckCircle2 className="h-3 w-3 text-green-400 mr-1" />
    ) : (
      <div className="h-3 w-3 border border-gray-600 rounded-full mr-1"></div>
    )}
    <span className="text-gray-400">{text}</span>
  </div>
);

// Error message component
interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="rounded-md bg-red-900/20 border border-red-800/30 p-4 animate-fade-in">
      <div className="flex items-center">
        <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div className="text-sm text-red-400">{error}</div>
      </div>
    </div>
  );
};

// Submit button component
interface SubmitButtonProps {
  isLoading: boolean;
  loadingText: string;
  text: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, loadingText, text }) => (
  <div className="flex justify-center mt-2">
    <button
      type="submit"
      disabled={isLoading}
      className={`min-w-[160px] px-8 py-2.5 rounded-md text-white font-medium transition-all duration-200 
        ${
          isLoading
            ? 'bg-primary/60 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-dark active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-gray-900'
        }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{loadingText}</span>
        </div>
      ) : (
        text
      )}
    </button>
  </div>
);

// Auth page background layout
interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute top-0 -left-[10%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 -right-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
    </div>
    <div className="w-full max-w-md space-y-8 relative z-10">{children}</div>
  </div>
);

// Auth header component
interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center">
    <div className="flex justify-center mb-2">
      <div className="bg-primary/20 backdrop-blur-sm p-3 rounded-xl">
        <h1 className="text-3xl font-bold text-white">ShiftFlow</h1>
      </div>
    </div>
    <h2 className="mt-4 text-2xl font-bold text-gray-200">{title}</h2>
    <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
  </div>
);

export const FormContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700/30">
    {children}
  </div>
);
