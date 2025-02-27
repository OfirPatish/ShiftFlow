import React, { ReactNode } from "react";
import { TimeEntry } from "../../types/shift";

interface TimeInputProps {
  label: string | ReactNode;
  value: TimeEntry;
  onChange: (field: "hours" | "minutes", value: string) => void;
}

export function TimeInput({ label, value, onChange }: TimeInputProps) {
  return (
    <div>
      <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center justify-center gap-2">
        <input
          type="number"
          min="0"
          max="23"
          value={value.hours}
          onChange={(e) => onChange("hours", e.target.value)}
          className="w-20 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
          placeholder="HH"
        />
        <span className="text-xl font-medium text-gray-700 dark:text-gray-300">:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={value.minutes}
          onChange={(e) => onChange("minutes", e.target.value)}
          className="w-20 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
          placeholder="MM"
        />
      </div>
    </div>
  );
}
