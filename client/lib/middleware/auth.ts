import { NextRequest } from "next/server";
import { verifyToken, extractTokenFromHeader } from "../utils/jwt";
import { AuthService } from "../services/authService";
import { AUTH_ERRORS } from "../config/auth";
import type { JWTPayload, User } from "../types/auth";

export interface AuthenticatedRequest extends NextRequest {
  user?: User;
  token?: string;
}

export async function authenticateRequest(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  user?: User;
  token?: string;
  error?: string;
}> {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return {
        isAuthenticated: false,
        error: AUTH_ERRORS.UNAUTHORIZED,
      };
    }
    let payload: JWTPayload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      return {
        isAuthenticated: false,
        error:
          error instanceof Error ? error.message : AUTH_ERRORS.TOKEN_INVALID,
      };
    }
    const user = await AuthService.getUserById(payload.userId);
    if (!user) {
      return {
        isAuthenticated: false,
        error: AUTH_ERRORS.USER_NOT_FOUND,
      };
    }
    return {
      isAuthenticated: true,
      user,
      token,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      error:
        error instanceof Error ? error.message : AUTH_ERRORS.INTERNAL_ERROR,
    };
  }
}

export function withAuth<T extends Record<string, unknown>>(
  handler: (
    request: NextRequest,
    context: T & { user: User }
  ) => Promise<Response>
) {
  return async (request: NextRequest, context: T): Promise<Response> => {
    const auth = await authenticateRequest(request);

    if (!auth.isAuthenticated || !auth.user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: auth.error || AUTH_ERRORS.UNAUTHORIZED,
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const contextWithUser = {
      ...context,
      user: auth.user,
    };
    return handler(request, contextWithUser);
  };
}
