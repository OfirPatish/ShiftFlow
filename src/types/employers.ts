export interface Employer {
  _id: string;
  name: string;
  location?: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerFormData {
  name: string;
  location?: string;
  color?: string;
}
