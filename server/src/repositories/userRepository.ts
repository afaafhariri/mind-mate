import prisma from "../config/db";
import { User } from "../models/user";

export const createUser = async (user: User) => {
  const dob = new Date(user.dateOfBirth);
  
  await prisma.user.upsert({
    where: { email: user.email },
    update: {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: dob,
      city: user.city,
      country: user.country,
      profession: user.profession,
      maritalStatus: user.maritalStatus,
      incomeFrequency: user.incomeFrequency,
      incomeAmount: user.incomeAmount,
      updatedAt: new Date(),
    },
    create: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: dob,
      city: user.city,
      country: user.country,
      profession: user.profession,
      maritalStatus: user.maritalStatus,
      incomeFrequency: user.incomeFrequency,
      incomeAmount: user.incomeAmount,
    },
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    uuid: user.uuid,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dateOfBirth: user.dateOfBirth.toISOString().split('T')[0],
    city: user.city,
    country: user.country,
    profession: user.profession,
    maritalStatus: user.maritalStatus,
    incomeFrequency: user.incomeFrequency || undefined,
    incomeAmount: user.incomeAmount || undefined,
    createdAt: user.createdAt || undefined,
    updatedAt: user.updatedAt || undefined,
  };
};
