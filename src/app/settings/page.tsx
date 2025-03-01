"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "../../features/ui/components/inputs/ThemeToggle";
import { WageSettings } from "../../features/wages/components";

export default function SettingsPage() {
  return (
    <div className="flex flex-col p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - shifted left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Appearance</h2>
            <ThemeToggle />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Wage Configuration</h2>
            <WageSettings />
          </div>
        </div>

        {/* Sidebar - shifted right */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Navigation</h2>
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="block p-2 hover:bg-slate-50 rounded-md transition-colors dark:hover:bg-slate-700"
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
                className="block p-2 bg-indigo-50 text-indigo-700 rounded-md font-medium dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                Settings
              </Link>
            </nav>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Settings Tips</h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Set your hourly rate for accurate earnings calculations</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Toggle between light and dark mode for better visibility</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Your settings are automatically saved</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
