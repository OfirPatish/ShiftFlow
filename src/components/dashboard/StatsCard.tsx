import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down';
  trendValue?: string | number;
  accentColor?: 'primary' | 'green' | 'blue';
  details?: {
    label: string;
    value: string;
  }[];
  progressPercentage?: number;
}

export default function StatsCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  accentColor = 'primary',
  details,
  progressPercentage,
}: StatsCardProps) {
  // Determine colors based on accent
  const getBorderColor = () => {
    switch (accentColor) {
      case 'green':
        return 'border-l-green-500';
      case 'blue':
        return 'border-l-blue-500';
      default:
        return 'border-l-primary';
    }
  };

  // Determine text color based on accent
  const getTextColor = () => {
    switch (accentColor) {
      case 'green':
        return 'text-green-400';
      case 'blue':
        return 'text-blue-400';
      default:
        return 'text-primary-400';
    }
  };

  // Determine trend colors
  const trendTextColor = trend === 'up' ? 'text-green-400' : 'text-red-400';

  return (
    <div
      className={`bg-gray-800/20 backdrop-blur-sm border border-gray-700/20 rounded-lg shadow p-4 relative overflow-hidden h-full border-l-4 ${getBorderColor()}`}
    >
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>

      <div className="mt-2 flex items-end">
        <span className="text-2xl font-semibold text-white">{value}</span>
        {unit && <span className="text-gray-400 ml-1 text-xs">{unit}</span>}
        {trend && trendValue && (
          <div className={`ml-auto ${trendTextColor} text-xs flex items-center`}>
            {trend === 'up' ? '↑' : '↓'}
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </div>

      {/* Progress bar if specified */}
      {progressPercentage !== undefined && (
        <div className="mt-2 h-1 w-full bg-gray-700/30 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${getTextColor()}`}
            style={{ width: `${Math.min(100, progressPercentage)}%` }}
          ></div>
        </div>
      )}

      {/* Details if provided */}
      {details && details.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {details.map((detail, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-t border-gray-700/20 pt-2"
            >
              <span className="text-gray-400">{detail.label}</span>
              <span className="text-white font-medium">{detail.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
