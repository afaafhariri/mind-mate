import type { ApiResponse } from "../types/auth";

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function createErrorResponse(
  error: string,
  status = 400,
  message?: string
): Response {
  const response: ApiResponse = {
    success: false,
    error,
    message,
  };
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function handleApiError(error: unknown): Response {
  console.error("API Error:", error);
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes("already exists")) {
      return createErrorResponse(error.message, 409);
    } else if (
      error.message.includes("Invalid") ||
      error.message.includes("required")
    ) {
      return createErrorResponse(error.message, 400);
    } else if (
      error.message.includes("Unauthorized") ||
      error.message.includes("Authentication")
    ) {
      return createErrorResponse(error.message, 401);
    } else if (error.message.includes("not found")) {
      return createErrorResponse(error.message, 404);
    }
    return createErrorResponse(error.message, 400);
  }
  return createErrorResponse("Internal server error", 500);
}

export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch {
    throw new Error("Invalid JSON in request body");
  }
}

export function validateMethod(
  request: Request,
  allowedMethods: string[]
): void {
  if (!allowedMethods.includes(request.method)) {
    throw new Error(`Method ${request.method} not allowed`);
  }
}