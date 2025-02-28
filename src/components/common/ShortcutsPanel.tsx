"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/themeContext";

// Define the structure for a keyboard shortcut
interface KeyboardShortcut {
  id: string;
  name: string;
  shortcut: string;
  macShortcut?: string; // Optional different shortcut for Mac
  description: string;
  category: "general" | "navigation" | "editing";
}

export function ShortcutsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // Check if user is on Mac
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof navigator !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  // Format the key combination for display
  const formatKey = (key: string) => {
    return (
      <span
        className="inline-flex items-center justify-center px-2 py-1 text-sm font-medium 
                     bg-gray-200 dark:bg-gray-700 rounded theme-transition"
      >
        {key}
      </span>
    );
  };

  // List of shortcuts - we'll add more over time
  const shortcuts: KeyboardShortcut[] = [
    {
      id: "theme-toggle",
      name: "Toggle Theme",
      shortcut: "M",
      description: "Switch between light and dark mode",
      category: "general",
    },
    // Future shortcuts will be added here
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Shortcuts button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                  shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts"
      >
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
          </svg>
          <span className="font-medium">Shortcuts</span>
        </div>
      </button>

      {/* Shortcuts panel */}
      {isOpen && (
        <div
          className="absolute bottom-12 right-0 w-80 p-4 rounded-lg shadow-xl 
                    theme-card transform transition-all duration-200 ease-in-out
                    border border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold theme-text-primary">Keyboard Shortcuts</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 theme-transition"
              aria-label="Close shortcuts panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 theme-text-primary"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.id} className="pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium theme-text-primary">{shortcut.name}</span>
                  <div className="flex space-x-1">{mounted && formatKey(shortcut.shortcut)}</div>
                </div>
                <p className="text-sm theme-text-secondary">{shortcut.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs theme-text-secondary text-center">
            More shortcuts will be added as new features are implemented
          </div>
        </div>
      )}
    </div>
  );
}
