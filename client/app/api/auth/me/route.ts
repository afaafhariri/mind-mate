import { NextRequest } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import { AuthService } from "@/lib/services/authService";
import { createSuccessResponse, handleApiError, parseRequestBody, validateMethod } from "@/lib/utils/api";
import type { User } from "@/lib/types/auth";

export const GET = withAuth(
  async (request: NextRequest, { user }: { user: User }) => {
    try {
      validateMethod(request, ["GET"]);
      return createSuccessResponse(
        { user },
        "User profile retrieved successfully"
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);

export const PUT = withAuth(
  async (request: NextRequest, { user }: { user: User }) => {
    try {
      validateMethod(request, ["PUT"]);
      const updates = await parseRequestBody<Partial<Pick<User, "name" | "email">>>(request);
      const updatedUser = await AuthService.updateProfile(user.id, updates);
      if (!updatedUser) {
        throw new Error("Failed to update user profile");
      }
      return createSuccessResponse(
        { user: updatedUser },
        "Profile updated successfully"
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);
