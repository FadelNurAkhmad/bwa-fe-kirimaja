import { apiClient } from "../axios";
import { handleAxiosError } from "@/lib/utils/error-handler";
import type { AxiosErrorType } from "@/lib/utils/api-error-types";
import type {
  EmployeeBranch,
  EmployeeBranchResponse,
  SingleEmployeeBranchResponse,
  EmployeeBranchRequest,
  UpdateEmployeeBranchRequest,
} from "../types/employee";

export const employeeService = {
  // Get all employee branch assignments
  async getAll(): Promise<EmployeeBranch[]> {
    try {
      const response =
        await apiClient.get<EmployeeBranchResponse>("/employee-branches");
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // Create employee with full data (including user creation)
  async createEmployee(data: EmployeeBranchRequest): Promise<EmployeeBranch> {
    try {
      const response = await apiClient.post<SingleEmployeeBranchResponse>(
        "/employee-branches",
        data,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // Update employee with full data
  async updateEmployee(
    id: number,
    data: UpdateEmployeeBranchRequest,
  ): Promise<EmployeeBranch> {
    try {
      const response = await apiClient.patch<SingleEmployeeBranchResponse>(
        `/employee-branches/${id}`,
        data,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // Delete employee branch assignment
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/employee-branches/${id}`);
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },
};
