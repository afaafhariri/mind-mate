export interface createUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  city: string;
  country: string;
  profession?: string;
  maritalStatus?: string;
  incomeFrequency?: string;
  incomeAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;

}

export interface User extends createUserDTO {
  id: string;
}
