import { handleAxiosError } from "@/lib/utils/error-handler";
import { apiClient } from "../axios";
import type { LoginRequest, LoginResponse } from "../types";
import type { AxiosErrorType } from "@/lib/utils/api-error-types";

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        request,
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },
};
