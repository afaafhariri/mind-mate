export const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-key-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  BCRYPT_ROUNDS: 12,
  TOKEN_HEADER: "authorization",
  TOKEN_PREFIX: "Bearer ",
} as const;

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

export const AUTH_ERRORS = {
  INVALID_EMAIL: "Please provide a valid email address",
  INVALID_PASSWORD: "Password must be at least 8 characters long",
  INVALID_NAME: "Name must be between 2 and 50 characters",
  EMAIL_EXISTS: "An account with this email already exists",
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "Authentication required",
  TOKEN_EXPIRED: "Token has expired",
  TOKEN_INVALID: "Invalid token",
  USER_NOT_FOUND: "User not found",
  INTERNAL_ERROR: "Internal server error",
} as const;
