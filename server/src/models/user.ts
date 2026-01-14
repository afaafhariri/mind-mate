export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string; // YYYY-MM-DD
  city: string;
  country: string;
  profession: string;
  maritalStatus: string;
  incomeFrequency?: string;
  incomeAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
