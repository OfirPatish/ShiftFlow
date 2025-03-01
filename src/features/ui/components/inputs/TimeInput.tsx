import React, { ReactNode, useState, useRef, useEffect } from "react";
import { TimeEntry } from "../../../../core/types/shift";
import { Clock, ChevronDown } from "lucide-react";

interface TimeInputProps {
  label: string | ReactNode;
  value: TimeEntry;
  onChange: (field: "hours" | "minutes", value: string) => void;
  hasError?: boolean;
}

export function TimeInput({ label, value, onChange, hasError = false }: TimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format time for display
  const formattedHours = value.hours.toString().padStart(2, "0");
  const formattedMinutes = value.minutes.toString().padStart(2, "0");
  const displayTime = `${formattedHours}:${formattedMinutes}`;

  // Generate hours and minutes options
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i);
  const minutesOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle selecting an hour
  const handleHourSelect = (hour: number) => {
    onChange("hours", hour.toString());
    // Don't close dropdown to allow changing minutes as well
  };

  // Handle selecting a minute
  const handleMinuteSelect = (minute: number) => {
    onChange("minutes", minute.toString());
    // Don't close dropdown to allow for further adjustments
  };

  return (
    <div className="relative">
      <label
        className={`block font-medium mb-2 ${
          hasError ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300"
        }`}
      >
        {label}
      </label>

      <div
        className={`flex items-center justify-between bg-white dark:bg-slate-800 border rounded-lg p-2.5 cursor-pointer transition-all duration-200 focus-within:ring-2 ${
          hasError
            ? "border-red-300 dark:border-red-700 hover:border-red-400 dark:hover:border-red-600 focus-within:ring-red-200 dark:focus-within:ring-red-900 focus-within:border-red-400"
            : "border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 focus-within:ring-indigo-500 focus-within:border-indigo-500"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select time"
      >
        <div className="flex items-center gap-2">
          <Clock
            className={`h-4 w-4 ${hasError ? "text-red-500 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}
          />
          <span
            className={`font-medium ${
              hasError ? "text-red-700 dark:text-red-300" : "text-slate-700 dark:text-slate-300"
            }`}
          >
            {displayTime}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            hasError ? "text-red-500 dark:text-red-400" : "text-slate-500 dark:text-slate-400"
          } ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-[300px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden"
          role="listbox"
        >
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Time</div>
            <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-md p-2.5">
              <span className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{displayTime}</span>
            </div>
          </div>

          <div className="flex p-2">
            {/* Hours section */}
            <div className="w-1/2 pr-2">
              <div className="p-2 text-xs font-medium text-slate-500 dark:text-slate-400 text-center">Hours</div>
              <div className="grid grid-cols-4 gap-1">
                {hoursOptions.map((hour) => (
                  <div
                    key={`hour-${hour}`}
                    className={`p-2 text-center cursor-pointer rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-150 ${
                      value.hours === hour
                        ? "bg-indigo-100 dark:bg-indigo-800/50 font-medium text-indigo-600 dark:text-indigo-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                    onClick={() => handleHourSelect(hour)}
                    role="option"
                    aria-selected={value.hours === hour}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    {hour.toString().padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>

            {/* Minutes section */}
            <div className="w-1/2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <div className="p-2 text-xs font-medium text-slate-500 dark:text-slate-400 text-center">Minutes</div>
              <div className="grid grid-cols-3 gap-1">
                {minutesOptions.map((minute) => (
                  <div
                    key={`minute-${minute}`}
                    className={`p-2 text-center cursor-pointer rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-150 ${
                      value.minutes === minute
                        ? "bg-indigo-100 dark:bg-indigo-800/50 font-medium text-indigo-600 dark:text-indigo-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                    onClick={() => handleMinuteSelect(minute)}
                    role="option"
                    aria-selected={value.minutes === minute}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    {minute.toString().padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
