import jwt from "jsonwebtoken";
import { AUTH_CONFIG, AUTH_ERRORS } from "../config/auth";
import type { JWTPayload, User } from "../types/auth";

export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
  };
  return jwt.sign(payload, AUTH_CONFIG.JWT_SECRET, {
    expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, AUTH_CONFIG.JWT_SECRET) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(AUTH_ERRORS.TOKEN_EXPIRED);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(AUTH_ERRORS.TOKEN_INVALID);
    }
    throw new Error(AUTH_ERRORS.TOKEN_INVALID);
  }
}

export function extractTokenFromHeader(
  authHeader: string | null
): string | null {
  if (!authHeader) {
    return null;
  }
  if (authHeader.startsWith(AUTH_CONFIG.TOKEN_PREFIX)) {
    return authHeader.substring(AUTH_CONFIG.TOKEN_PREFIX.length);
  }
  return null;
}

export function getTokenExpiration(): number {
  const expiresIn = AUTH_CONFIG.JWT_EXPIRES_IN;
  if (expiresIn.endsWith("d")) {
    const days = parseInt(expiresIn.slice(0, -1));
    return days * 24 * 60 * 60 * 1000; 
  } else if (expiresIn.endsWith("h")) {
    const hours = parseInt(expiresIn.slice(0, -1));
    return hours * 60 * 60 * 1000;
  } else if (expiresIn.endsWith("m")) {
    const minutes = parseInt(expiresIn.slice(0, -1));
    return minutes * 60 * 1000;
  }
  return 7 * 24 * 60 * 60 * 1000;
}
