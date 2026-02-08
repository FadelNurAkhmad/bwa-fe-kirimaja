import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { roleService } from "@/lib/api/services/role";
import type { UpdateRolePermissionsRequest } from "@/lib/api";

// Hook to fetch all roles
export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: roleService.getRoles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a single role by ID
export const useRole = (id: number) => {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () => roleService.getRoleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to update role permissions
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateRolePermissionsRequest;
    }) => roleService.updateRole(id, data),
    onSuccess: (updatedRole) => {
      // Callback yang berjalan jika request berhasil. OnSuccess ini akan menerima data hasil update dari server.
      // Update the specific role in the cache, if it exists
      queryClient.setQueryData(["roles", updatedRole.id], updatedRole);

      // Invalidate the roles list to refetch, ensuring data consistency
      queryClient.invalidateQueries({ queryKey: ["roles"] });

      toast.success("Role berhasil diperbarui!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui role");
    },
  });
};
