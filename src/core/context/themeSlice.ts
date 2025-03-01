"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with 'light' theme for consistent server/client initial render
  const [theme, setTheme] = useState<Theme>("light");

  // Flag to track if we've mounted - only used client-side
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted
  useEffect(() => {
    setMounted(true);

    // After mounting, check storage/preferences and update theme
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    // Remove the no-transition class after a short delay
    // This allows the theme to be applied before enabling transitions
    setTimeout(() => {
      document.documentElement.classList.remove("no-transition");
    }, 100);
  }, []);

  // Update HTML class and localStorage when theme changes
  // But only after component has mounted to avoid hydration mismatch
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    // Remove both classes and add the current one
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return React.createElement(ThemeContext.Provider, { value: { theme, toggleTheme, setTheme } }, children);
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
