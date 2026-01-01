import bcrypt from "bcryptjs";
import { AUTH_CONFIG } from "../config/auth";

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(AUTH_CONFIG.BCRYPT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch {
    throw new Error("Failed to hash password");
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    throw new Error("Failed to verify password");
  }
}
