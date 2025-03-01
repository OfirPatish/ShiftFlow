"use client";

import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
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
              <span className="font-bold">Shift</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">Flow</span>
            </Link>
            <nav className="flex space-x-6">
              <Link
                href="/dashboard"
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-300"
              >
                Dashboard
              </Link>
              <Link
                href="/shifts"
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-300"
              >
                Shifts
              </Link>
              <Link
                href="/settings"
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-300"
              >
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Track Your Hours, <br />
                  Maximize Your Earnings
                </h1>
                <p className="text-xl mb-8 opacity-90 leading-relaxed">
                  A simple yet powerful way to monitor your shifts, calculate overtime, and keep track of your earnings
                  with precision.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-indigo-700 font-medium shadow-lg hover:bg-indigo-50 transition-colors duration-300"
                  >
                    Get Started
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/shifts"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors duration-300"
                  >
                    View Demo
                  </Link>
                </div>
              </div>
              <div className="hidden md:block relative">
                <div className="absolute -top-6 -left-6 w-40 h-40 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-24 right-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl transform rotate-3 transition-all duration-300 hover:rotate-0">
                    <div className="flex justify-between items-center mb-4 border-b pb-2 border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-800 dark:text-white">Today&apos;s Shift</h3>
                      <span className="text-sm text-indigo-600 dark:text-indigo-400">08:30 - 17:00</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Regular hours:</span>
                        <span className="font-medium text-slate-800 dark:text-white">8h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Overtime (125%):</span>
                        <span className="font-medium text-slate-800 dark:text-white">0.5h</span>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                        <span className="font-medium text-slate-800 dark:text-white">Total earnings:</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">₪ 425.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-white dark:bg-slate-800 transition-colors duration-300">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 dark:text-white transition-colors duration-300">
                Powerful Features
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Everything you need to effectively track your work hours and maximize your earnings in one place.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-700">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white transition-colors duration-300">
                  Shift Tracking
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 transition-colors duration-300">
                  Easily log your work hours with precise start and end times. Track regular and overtime hours
                  automatically.
                </p>
                <Link
                  href="/shifts"
                  className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center group"
                >
                  Manage Shifts
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-700">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white transition-colors duration-300">
                  Earnings Calculation
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 transition-colors duration-300">
                  Automatically calculate your earnings based on customizable hourly rates and different overtime
                  percentages.
                </p>
                <Link
                  href="/settings"
                  className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center group"
                >
                  Configure Wages
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-700">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white transition-colors duration-300">
                  Monthly Analytics
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 transition-colors duration-300">
                  View detailed monthly summaries of your work patterns, hours breakdown, and total earnings.
                </p>
                <Link
                  href="/dashboard"
                  className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center group"
                >
                  View Dashboard
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 transition-colors duration-300">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">
              Ready to streamline your shift management?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Start tracking your work hours and maximizing your earnings today with ShiftFlow.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                ShiftFlow
              </h3>
              <p className="text-slate-400 mb-4">
                A modern shift management application for tracking work hours and calculating earnings.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/shifts" className="text-slate-400 hover:text-white transition-colors">
                    Shifts
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="text-slate-400 hover:text-white transition-colors">
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/OfirPatish/ShiftFlow"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8">
            <p className="text-center text-slate-400 text-sm">
              © {new Date().getFullYear()} ShiftFlow. All rights reserved. Created with Next.js and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
