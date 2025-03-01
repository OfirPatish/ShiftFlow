import { useState, useEffect } from "react";

/**
 * Hook to detect if the current viewport is mobile sized
 * @param breakpoint The max width in pixels to consider as mobile (default: 768px)
 * @returns Boolean indicating if the viewport is mobile sized
 */
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return;
    }

    // Function to check if screen matches mobile size
    const checkIsMobile = () => {
      setIsMobile(window.matchMedia(`(max-width: ${breakpoint}px)`).matches);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}
