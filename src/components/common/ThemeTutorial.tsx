"use client";

import React, { useState, useEffect } from "react";

export function ThemeTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [modifierKey, setModifierKey] = useState("Alt");

  useEffect(() => {
    // Determine the platform-specific key name
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    setModifierKey(isMac ? "Option" : "Alt");

    // Check if the tutorial has been seen before
    const hasSeenTutorial = localStorage.getItem("theme-tutorial-seen");

    if (!hasSeenTutorial) {
      // Show the tutorial after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const dismissTutorial = () => {
    setIsDismissed(true);
    // Fade out animation
    setTimeout(() => {
      setIsVisible(false);
      // Save that the user has seen the tutorial
      localStorage.setItem("theme-tutorial-seen", "true");
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs theme-transition z-50 ${
        isDismissed ? "opacity-0 translate-y-2" : "opacity-100"
      } transition-all duration-300`}
    >
      <button
        onClick={dismissTutorial}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <h3 className="font-medium text-gray-900 dark:text-white mb-2 theme-transition">Theme Toggle Tip</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 theme-transition">
        You can toggle between light and dark mode by clicking the button in the top-right corner or by using the
        keyboard shortcut{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 text-xs font-mono">
          {modifierKey}+T
        </kbd>
      </p>
      <button
        onClick={dismissTutorial}
        className="text-sm bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 py-1 px-3 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 theme-transition"
      >
        Got it
      </button>
    </div>
  );
}
