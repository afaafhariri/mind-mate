import { VALIDATION, AUTH_ERRORS } from "../config/auth";
import type { UserCreate, UserLogin } from "../types/auth";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
    errors.push(AUTH_ERRORS.INVALID_EMAIL);
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  if (!password) {
    errors.push("Password is required");
  } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(AUTH_ERRORS.INVALID_PASSWORD);
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateName(name: string): ValidationResult {
  const errors: string[] = [];
  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  } else if (
    name.trim().length < VALIDATION.NAME_MIN_LENGTH ||
    name.trim().length > VALIDATION.NAME_MAX_LENGTH
  ) {
    errors.push(AUTH_ERRORS.INVALID_NAME);
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUserRegistration(
  userData: UserCreate
): ValidationResult {
  const emailValidation = validateEmail(userData.email);
  const passwordValidation = validatePassword(userData.password);
  const nameValidation = validateName(userData.name);

  const allErrors = [
    ...emailValidation.errors,
    ...passwordValidation.errors,
    ...nameValidation.errors,
  ];
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

export function validateUserLogin(userData: UserLogin): ValidationResult {
  const emailValidation = validateEmail(userData.email);
  const passwordValidation = validatePassword(userData.password);

  const allErrors = [...emailValidation.errors, ...passwordValidation.errors];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}
