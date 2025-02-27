"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { WageConfig } from "../types/shift";

const defaultWageConfig: WageConfig = {
  baseHourlyRate: 0,
};

interface WageContextType {
  wageConfig: WageConfig;
  updateWageConfig: (config: Partial<WageConfig>) => void;
}

const WageContext = createContext<WageContextType | undefined>(undefined);

export function WageProvider({ children }: { children: ReactNode }) {
  const [wageConfig, setWageConfig] = useState<WageConfig>(defaultWageConfig);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load wage config from localStorage only once on client side
    const saved = localStorage.getItem("wageConfig");
    if (saved) {
      setWageConfig(JSON.parse(saved));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // Only save to localStorage if we've initialized
    if (isInitialized) {
      localStorage.setItem("wageConfig", JSON.stringify(wageConfig));
    }
  }, [wageConfig, isInitialized]);

  const updateWageConfig = (config: Partial<WageConfig>) => {
    setWageConfig((prev) => ({
      ...prev,
      ...config,
    }));
  };

  return <WageContext.Provider value={{ wageConfig, updateWageConfig }}>{children}</WageContext.Provider>;
}

export function useWage() {
  const context = useContext(WageContext);
  if (context === undefined) {
    throw new Error("useWage must be used within a WageProvider");
  }
  return context;
}
