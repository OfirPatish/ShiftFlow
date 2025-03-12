import { ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText?: string;
  icon?: ReactNode;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  message,
  buttonText,
  icon,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/30 p-8 text-center">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-100">{title}</h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
      </div>

      {buttonText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          {icon || <Plus className="h-4 w-4 mr-2" />}
          {buttonText}
        </button>
      )}
    </div>
  );
}
