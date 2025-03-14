export interface MonthlyStats {
  totalEarnings: number;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  overtimeEarnings?: number;
  shiftsCount: number;
}
