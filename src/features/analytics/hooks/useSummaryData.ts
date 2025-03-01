import { useShiftsStore } from "../../../core/context/shiftsSlice";
import { useSelectedMonth } from "../../../core/context/selectedMonthSlice";
import { useWageStore } from "../../../core/context/wageSlice";
import { MonthlyShiftSummary } from "../../../core/types/shift";

/**
 * Hook to provide summary data for the current selected month
 */
export function useSummaryData(): {
  summary: MonthlyShiftSummary;
  monthLabel: string;
  hasShifts: boolean;
} {
  const { selectedMonth } = useSelectedMonth();
  const { getMonthlyShiftSummary, getMonthlyShifts } = useShiftsStore();
  const { wageConfig } = useWageStore();

  // Get current month's summary
  const summary = getMonthlyShiftSummary(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth(),
    wageConfig.baseHourlyRate
  );

  // Get formatted month name
  const monthLabel = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Check if there are any shifts in the current month
  const monthlyShifts = getMonthlyShifts(selectedMonth.getFullYear(), selectedMonth.getMonth());

  return {
    summary,
    monthLabel,
    hasShifts: monthlyShifts.length > 0,
  };
}
