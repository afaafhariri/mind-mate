import { NextRequest } from "next/server";
import { AuthService } from "@/lib/services/authService";
import { createSuccessResponse, handleApiError, parseRequestBody, validateMethod } from "@/lib/utils/api";
import type { UserCreate } from "@/lib/types/auth";

export async function POST(request: NextRequest) {
  try {
    validateMethod(request, ["POST"]);
    const userData = await parseRequestBody<UserCreate>(request);
    const authResponse = await AuthService.register(userData);
    return createSuccessResponse(authResponse, "User registered successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
