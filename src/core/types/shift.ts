export interface WageConfig {
  baseHourlyRate: number;
}

export interface TimeEntry {
  hours: number;
  minutes: number;
}

export interface Shift {
  id: string;
  date: string;
  startTime: TimeEntry;
  endTime: TimeEntry;
  calculatedHours: {
    base: number;
    overtime: number;
    overtime125: number;
    overtime150: number;
    total: number;
  };
  totalEarnings: number;
}

export interface ShiftCalculation {
  baseHours: number;
  overtimeHours: number;
  overtime125Hours: number;
  overtime150Hours: number;
  totalHours: number;
  earnings: {
    base: number;
    overtime125: number;
    overtime150: number;
    total: number;
  };
}

export interface MonthlyShiftSummary {
  totalHours: {
    base: number;
    overtime: number;
    total: number;
  };
  earnings: {
    base: number;
    overtime: number;
    total: number;
  };
}
