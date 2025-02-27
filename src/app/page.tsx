"use client";

import React from "react";
import { WageProvider } from "../context/wageContext";
import { ShiftsProvider } from "../context/shiftsContext";
import { WageConfig } from "../components/config/WageConfig";
import { ShiftInput } from "../components/forms/ShiftInput";
import { ShiftsList } from "../components/lists/shifts/ShiftsList";

export default function Home() {
  return (
    <WageProvider>
      <ShiftsProvider>
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12">
          <div className="container mx-auto max-w-5xl px-4">
            <header className="text-center mb-8 sm:mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">ShiftFlow</h1>
              <p className="text-gray-600 dark:text-gray-400">Track your shifts and overtime with ease</p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[400px,1fr] items-start">
              <aside className="space-y-6">
                <WageConfig />
                <ShiftInput />
              </aside>
              <section className="min-h-[calc(100vh-200px)]">
                <ShiftsList />
              </section>
            </div>
          </div>
        </main>
      </ShiftsProvider>
    </WageProvider>
  );
}
