import React from "react";
import { useWage } from "../../context/wageContext";

export function WageConfig() {
  const { wageConfig, updateWageConfig } = useWage();

  const handleWageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateWageConfig({ baseHourlyRate: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">
          Wage Settings
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
            Base Hourly Rate
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">₪</span>
            </div>
            <input
              type="number"
              value={wageConfig.baseHourlyRate}
              onChange={handleWageChange}
              className="block w-full pl-8 pr-4 py-2.5 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              min="0"
              step="0.1"
              placeholder="Enter hourly rate"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
            Overtime Rates
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
              <div className="w-3 h-3 bg-blue-200 dark:bg-blue-300 rounded-full mr-2.5 transition-colors duration-300"></div>
              <span>Regular hours (up to 8h): 100%</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
              <div className="w-3 h-3 bg-blue-300 dark:bg-blue-400 rounded-full mr-2.5 transition-colors duration-300"></div>
              <span>Overtime (8-10h): 125%</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
              <div className="w-3 h-3 bg-blue-400 dark:bg-blue-500 rounded-full mr-2.5 transition-colors duration-300"></div>
              <span>Overtime (10h+): 150%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
