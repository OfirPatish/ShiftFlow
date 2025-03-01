"use client";

import React, { ReactNode } from "react";
// Since we're using Zustand, we don't need to import and nest providers here

// The ThemeProvider and SelectedMonthProvider should still be kept as context providers
// because they deal with UI state that needs to be accessible throughout the component tree
import { ThemeProvider } from "./themeSlice";
import { SelectedMonthProvider } from "./selectedMonthSlice";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // We only need the theme and selected month providers as contexts
  // The shifts and wage state are now managed by Zustand, so we don't need providers
  return (
    <ThemeProvider>
      <SelectedMonthProvider>{children}</SelectedMonthProvider>
    </ThemeProvider>
  );
}
