export interface Shift {
  _id: string;
  userId: string;
  employerId:
    | string
    | {
        _id: string;
        name: string;
        color: string;
      };
  rateId:
    | string
    | {
        _id: string;
        baseRate: number;
        currency: string;
      };
  startTime: string | Date;
  endTime: string | Date;
  breakDuration: number;
  notes?: string;
  regularHours: number;
  overtimeHours1: number;
  overtimeHours2: number;
  totalHours: number;
  regularEarnings: number;
  overtimeEarnings1: number;
  overtimeEarnings2: number;
  totalEarnings: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftFormData {
  employerId: string;
  rateId: string;
  startTime: string | Date;
  endTime: string | Date;
  breakDuration?: number;
  notes?: string;
}

export interface ShiftFilters {
  startDate?: Date;
  endDate?: Date;
  employerId?: string;
}
