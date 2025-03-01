import { Shift } from "../../../../core/types/shift";

/**
 * Sorts shifts by date (newest first)
 */
export const sortShiftsByDate = (shifts: Shift[]): Shift[] => {
  return [...shifts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

/**
 * Groups shifts by week within the month
 */
export const groupShiftsByWeek = (shifts: Shift[]): Record<string, Shift[]> => {
  const groups: Record<string, Shift[]> = {};

  shifts.forEach((shift) => {
    const shiftDate = new Date(shift.date);
    // Get the week number within the month
    const dayOfMonth = shiftDate.getDate();
    const weekNumber = Math.ceil(dayOfMonth / 7);
    const weekKey = `Week ${weekNumber}`;

    if (!groups[weekKey]) {
      groups[weekKey] = [];
    }

    groups[weekKey].push(shift);
  });

  return groups;
};
