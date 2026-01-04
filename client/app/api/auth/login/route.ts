import { NextRequest } from "next/server";
import { AuthService } from "@/lib/services/authService";
import { createSuccessResponse, handleApiError, parseRequestBody, validateMethod } from "@/lib/utils/api";
import type { UserLogin } from "@/lib/types/auth";

export async function POST(request: NextRequest) {
  try {
    validateMethod(request, ["POST"]);
    const userData = await parseRequestBody<UserLogin>(request);
    const authResponse = await AuthService.login(userData);
    return createSuccessResponse(authResponse, "Login successful");
  } catch (error) {
    return handleApiError(error);
  }
}
