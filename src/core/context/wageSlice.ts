"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WageConfig } from "../types/shift";

const defaultWageConfig: WageConfig = {
  baseHourlyRate: 0,
};

// Define the shape of our wage state
interface WageState {
  wageConfig: WageConfig;
  updateWageConfig: (config: Partial<WageConfig>) => void;
}

// Create the wage store with persistence
export const useWageStore = create<WageState>()(
  persist(
    (set) => ({
      wageConfig: defaultWageConfig,

      updateWageConfig: (config: Partial<WageConfig>) =>
        set((state) => ({
          wageConfig: {
            ...state.wageConfig,
            ...config,
          },
        })),
    }),
    {
      name: "wage-storage",
    }
  )
);
