import { ReactNode } from 'react';
import { Button } from '@/components/ui/buttons/Button';
import LoadingSpinner from '@/components/core/feedback/LoadingSpinner';

interface PageLayoutProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  actionElement?: ReactNode;
  bottomAction?: ReactNode;
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
  bottomAction,
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
      <div className="bg-gradient-to-br from-gray-800/40 via-gray-800/20 to-gray-800/5 backdrop-blur-sm border border-gray-700/30 rounded-xl p-5 sm:p-6 shadow-lg mb-6 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900/20 via-transparent to-transparent" />

        <div className="relative flex flex-col items-end sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex-1 w-full">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-400 font-medium">{subtitle}</p>
          </div>

          {actionElement ? (
            <div className="flex-shrink-0">{actionElement}</div>
          ) : actionLabel && onAction ? (
            <div className="flex-shrink-0">
              <Button
                onClick={onAction}
                variant="primary"
                className="relative group px-6 py-2 h-10 sm:h-11"
                disabled={isActionLoading}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary-600/50 to-primary-500/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                {isActionLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>{actionLabel}</span>
                  </div>
                ) : (
                  <span className="relative">{actionLabel}</span>
                )}
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Month Selector Section */}
      {bottomAction && <div className="flex justify-center mb-6">{bottomAction}</div>}

      {/* Main Content */}
      <div>{children}</div>
    </div>
  );
}
