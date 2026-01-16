export interface User {
  id?: string;
  uuid?: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  city: string;
  country: string;
  profession: string;
  maritalStatus: string;
  incomeFrequency?: string;
  incomeAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
