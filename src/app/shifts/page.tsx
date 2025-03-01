"use client";

import React from "react";
import Link from "next/link";
import { ShiftForm } from "../../features/shifts/management/components";
import { ShiftCollection } from "../../features/shifts/display/components";

export default function ShiftsPage() {
  return (
    <div className="flex flex-col p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Shifts</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - shifted left */}
        <div className="lg:col-span-2 space-y-6">
          <ShiftForm />
          <ShiftCollection />
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
                className="block p-2 bg-indigo-50 text-indigo-700 rounded-md font-medium dark:bg-indigo-900/30 dark:text-indigo-300"
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
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Tips</h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Add shifts using the form above</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Click on a shift to view its details</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Use the edit button to modify existing shifts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
