import { apiClient } from "../axios";
import { handleAxiosError } from "@/lib/utils/error-handler";
import type { AxiosErrorType } from "@/lib/utils/api-error-types";
import type { Permission, PermissionResponse } from "../types/role";

export const permissionService = {
  async getPermissions(): Promise<Permission[]> {
    try {
      const response = await apiClient.get<PermissionResponse>("/permissions");
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },
};
