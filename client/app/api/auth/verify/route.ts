import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/middleware/auth";
import { createSuccessResponse, createErrorResponse, validateMethod } from "@/lib/utils/api";

export async function POST(request: NextRequest) {
  try {
    validateMethod(request, ["POST"]);
    const auth = await authenticateRequest(request);
    if (!auth.isAuthenticated || !auth.user) {
      return createErrorResponse(auth.error || "Invalid token", 401);
    }
    return createSuccessResponse({ user: auth.user, token: auth.token }, "Token is valid");
  } catch (error) {
    return createErrorResponse( error instanceof Error ? error.message : "Token verification failed", 401 );
  }
}
