import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string | null;
  className?: string;
}

export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`rounded-md bg-red-50 dark:bg-red-900/20 p-3 my-3 ${className}`}>
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500 mr-2" aria-hidden="true" />
        <p className="text-sm text-red-700 dark:text-red-400">{message}</p>
      </div>
    </div>
  );
}
