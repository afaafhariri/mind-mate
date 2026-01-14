import { query } from "../config/db";
import { User } from "../models/user";

export const createUser = async (user: User) => {
  const text = `
    INSERT INTO users (first_name, last_name, email, date_of_birth, city, country, profession, marital_status, income_frequency, income_amount, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
    ON CONFLICT (email) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      date_of_birth = EXCLUDED.date_of_birth,
      city = EXCLUDED.city,
      country = EXCLUDED.country,
      profession = EXCLUDED.profession,
      marital_status = EXCLUDED.marital_status,
      income_frequency = EXCLUDED.income_frequency,
      income_amount = EXCLUDED.income_amount,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id;
  `;
  const values = [
    user.firstName,
    user.lastName,
    user.email,
    user.dateOfBirth,
    user.city,
    user.country,
    user.profession,
    user.maritalStatus,
    user.incomeFrequency,
    user.incomeAmount,
  ];

  await query(text, values);
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const text = `
    SELECT id, first_name, last_name, email, date_of_birth, city, country, profession, marital_status, income_frequency, income_amount, created_at, updated_at
    FROM users WHERE email = $1
  `;
  const res = await query(text, [email]);

  if (res.rows.length === 0) {
    return null;
  }

  const row = res.rows[0];
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    city: row.city,
    country: row.country,
    profession: row.profession,
    maritalStatus: row.marital_status,
    incomeFrequency: row.income_frequency,
    incomeAmount: row.income_amount,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};
