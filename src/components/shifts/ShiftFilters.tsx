import React from 'react';
import { Search } from 'lucide-react';

interface ShiftFiltersProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showFilters?: boolean;
}

export default function ShiftFilters({
  searchQuery,
  onSearchChange,
  showFilters = true,
}: ShiftFiltersProps) {
  if (!showFilters) return null;

  return (
    <div
      id="filter-panel"
      role="region"
      aria-label="Filter options"
      className="mb-6 p-4 transition-all duration-300"
    >
      <div className="relative rounded-lg shadow-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full bg-gray-800/80 border border-gray-700 rounded-lg py-2.5 pl-11 pr-4 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-600 transition-all duration-200"
          placeholder="Search shifts by employer..."
          value={searchQuery}
          onChange={onSearchChange}
          aria-label="Search shifts by employer"
        />
      </div>
    </div>
  );
}
