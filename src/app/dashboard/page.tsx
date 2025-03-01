"use client";

import React from "react";
import Link from "next/link";
import { MonthlyOverview } from "../../features/analytics/components";
import { useSelectedMonth } from "../../core/context/selectedMonthSlice";
import { MonthPicker } from "../../features/common/components";

export default function DashboardPage() {
  const { selectedMonth } = useSelectedMonth();
  const formattedMonth = selectedMonth.toLocaleDateString("default", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - shifted left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Monthly Summary</h2>
              <MonthPicker compact />
            </div>
            <MonthlyOverview />

            <div className="mt-6 text-center">
              <Link
                href="/shifts"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Manage Shifts
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar - shifted right */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Navigation</h2>
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="block p-2 bg-indigo-50 text-indigo-700 rounded-md font-medium dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                Dashboard
              </Link>
              <Link
                href="/shifts"
                className="block p-2 hover:bg-slate-50 rounded-md transition-colors dark:hover:bg-slate-700"
              >
                All Shifts
              </Link>
              <Link
                href="/settings"
                className="block p-2 hover:bg-slate-50 rounded-md transition-colors dark:hover:bg-slate-700"
              >
                Settings
              </Link>
            </nav>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Quick Tips</h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Add and manage shifts on the Shifts page</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>View detailed earnings breakdown for each shift</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Configure your hourly rate in settings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
