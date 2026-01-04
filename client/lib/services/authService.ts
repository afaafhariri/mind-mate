import type { User, UserCreate, UserLogin, AuthResponse } from "../types/auth";
import { validateUserRegistration, validateUserLogin } from "../utils/validation";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateToken, getTokenExpiration } from "../utils/jwt";
import { userStore } from "./userStore";
import { AUTH_ERRORS } from "../config/auth";


export class AuthService {
  static async register(userData: UserCreate): Promise<AuthResponse> {
    const validation = validateUserRegistration(userData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }
    const existingUser = await userStore.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error(AUTH_ERRORS.EMAIL_EXISTS);
    }
    const hashedPassword = await hashPassword(userData.password);
    const user = await userStore.createUser({
      ...userData,
      password: hashedPassword,
    });
    const token = generateToken(user);
    const expiresIn = getTokenExpiration();
    return {
      user,
      token,
      expiresIn: `${expiresIn}ms`,
    };
  }

  static async login(userData: UserLogin): Promise<AuthResponse> {
    const validation = validateUserLogin(userData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }
    const user = await userStore.findUserByEmail(userData.email);
    if (!user) {
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
    const isPasswordValid = await verifyPassword(
      userData.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
    const { id, email, name, createdAt, updatedAt } = user;
    const userWithoutPassword = { id, email, name, createdAt, updatedAt };
    const token = generateToken(userWithoutPassword);
    const expiresIn = getTokenExpiration();

    return {
      user: userWithoutPassword,
      token,
      expiresIn: `${expiresIn}ms`,
    };
  }

  static async getUserById(userId: string): Promise<User | null> {
    return await userStore.findUserById(userId);
  }

  static async updateProfile(
    userId: string,
    updates: Partial<Pick<User, "name" | "email">>
  ): Promise<User | null> {
    if (updates.email) {
      const emailValidation = await import("../utils/validation").then((v) =>
        v.validateEmail(updates.email!)
      );
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.errors.join(", "));
      }
      const existingUser = await userStore.findUserByEmail(updates.email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error(AUTH_ERRORS.EMAIL_EXISTS);
      }
    }
    if (updates.name) {
      const nameValidation = await import("../utils/validation").then((v) =>
        v.validateName(updates.name!)
      );
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.errors.join(", "));
      }
    }
    return await userStore.updateUser(userId, updates);
  }
}
