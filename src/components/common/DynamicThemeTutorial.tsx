"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ThemeTutorial } from "./ThemeTutorial";

export function DynamicThemeTutorial() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Find the tutorial container element
  const tutorialContainer = document.getElementById("theme-tutorial-container");

  // Only render if we found the container
  if (!tutorialContainer) return null;

  // Use createPortal to render into the container
  return createPortal(<ThemeTutorial />, tutorialContainer);
}
