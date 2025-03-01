"use client";

import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-slate-800 dark:text-white font-semibold text-lg transition-colors duration-300 flex items-center"
            >
              <svg
                className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              ShiftFlow
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/dashboard"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors duration-300"
              >
                Dashboard
              </Link>
              <Link
                href="/shifts"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors duration-300"
              >
                Shifts
              </Link>
              <Link
                href="/settings"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors duration-300"
              >
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="py-12 px-4 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">Track Your Work Hours with Ease</h1>
            <p className="text-xl mb-8 opacity-90">A simple way to monitor your shifts and calculate earnings.</p>
            <Link
              href="/dashboard"
              className="inline-block bg-white text-indigo-700 font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors duration-300"
            >
              Get Started
            </Link>
          </div>
        </section>

        <section className="py-16 px-4 bg-white dark:bg-slate-800 transition-colors duration-300">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-white transition-colors duration-300">
              Features
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors duration-300">
                <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white transition-colors duration-300">
                  Shift Tracking
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4 transition-colors duration-300">
                  Easily add and manage your work shifts with a user-friendly interface
                </p>
                <Link
                  href="/shifts"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition-colors duration-300"
                >
                  Manage Shifts
                </Link>
              </div>

              <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors duration-300">
                <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white transition-colors duration-300">
                  Earnings Calculation
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4 transition-colors duration-300">
                  Automatically calculate your earnings based on hourly rate and overtime
                </p>
                <Link
                  href="/settings"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition-colors duration-300"
                >
                  Configure Wages
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-2">ShiftFlow - A simple shift management application</p>
            <p className="text-slate-400 text-sm">Created with Next.js and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
