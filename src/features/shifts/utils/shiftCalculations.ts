// This file re-exports shift calculation functions from other locations
// to maintain backward compatibility during the refactoring process
import { calculateShiftHours as calculateShiftHoursFromUtils } from "../management/utils/shiftUtils";

// Re-export the function with the same name
export const calculateShiftHours = calculateShiftHoursFromUtils;
