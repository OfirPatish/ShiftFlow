export interface Rate {
  _id: string;
  userId: string;
  employerId: string;
  name: string;
  baseRate: number;
  currency: string;
  effectiveDate: string | Date;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RateFormData {
  employerId: string;
  name: string;
  baseRate: number;
  currency?: 'ILS' | 'USD' | 'EUR';
  effectiveDate?: string | Date;
  isDefault?: boolean;
}
