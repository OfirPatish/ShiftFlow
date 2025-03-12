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
  // Determine background color based on accent
  const getBgColor = () => {
    switch (accentColor) {
      case 'green':
        return 'bg-green-500/10';
      case 'blue':
        return 'bg-blue-500/10';
      default:
        return 'bg-primary/10';
    }
  };

  // Determine text color based on accent
  const getTextColor = () => {
    switch (accentColor) {
      case 'green':
        return 'text-green-500';
      case 'blue':
        return 'text-blue-500';
      default:
        return 'text-primary';
    }
  };

  // Determine text color for trend
  const trendTextColor = trend === 'up' ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-lg p-6 relative overflow-hidden h-full">
      <div
        className={`absolute top-0 right-0 w-24 h-24 ${getBgColor()} rounded-bl-full opacity-80`}
      ></div>

      <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
      <div className="mt-2 flex items-end">
        <span className="text-3xl font-bold text-white">{value}</span>
        {unit && <span className="text-gray-400 ml-2 text-sm">{unit}</span>}
        {trend && trendValue && (
          <div className={`ml-auto ${trendTextColor} text-sm flex items-center`}>
            {trend === 'up' ? '↑' : '↓'}
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </div>

      {/* Progress bar if specified */}
      {progressPercentage !== undefined && (
        <div className="mt-3 h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${getTextColor()}`}
            style={{ width: `${Math.min(100, progressPercentage)}%` }}
          ></div>
        </div>
      )}

      {/* Details grid if provided */}
      {details && details.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          {details.map((detail, index) => (
            <div key={index} className="bg-gray-800/70 p-2 rounded-md border border-gray-700/30">
              <span className="text-gray-400 block mb-1">{detail.label}</span>
              <div className="text-white font-medium">{detail.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* If no details are provided, add some space to maintain consistent height */}
      {(!details || details.length === 0) && <div className="mt-4 py-6"></div>}
    </div>
  );
}
