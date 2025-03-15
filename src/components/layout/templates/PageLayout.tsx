import { ReactNode } from 'react';
import { Button } from '@/components/ui/buttons/Button';
import LoadingSpinner from '@/components/core/feedback/LoadingSpinner';

interface PageLayoutProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  actionElement?: ReactNode;
  children: ReactNode;
  maxContentWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl';
  className?: string;
  isActionLoading?: boolean;
}

export default function PageLayout({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionElement,
  children,
  maxContentWidth = '7xl',
  className = '',
  isActionLoading = false,
}: PageLayoutProps) {
  return (
    <div
      className={`container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-16 xl:px-24 ${className}`}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/40 rounded-lg p-6 shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100 mb-1 sm:mb-2">{title}</h1>
            <p className="text-sm sm:text-base text-gray-400">{subtitle}</p>
          </div>
          {actionElement ? (
            <div className="w-full sm:w-auto">{actionElement}</div>
          ) : actionLabel && onAction ? (
            <div className="w-full sm:w-auto">
              <Button
                onClick={onAction}
                variant="primary"
                className="w-full sm:w-auto"
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">{actionLabel}</span>
                  </>
                ) : (
                  actionLabel
                )}
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className={`mx-auto max-w-${maxContentWidth}`}>{children}</div>
    </div>
  );
}
