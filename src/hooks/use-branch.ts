import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { branchService } from "@/lib/api/services/branch";
import type { CreateBranchRequest } from "@/lib/api/types/branch";

// Query keys
export const branchKeys = {
  all: ["branches"] as const, // base key
  lists: () => [...branchKeys.all, "list"] as const, // Digunakan untuk semua data yang bersifat daftar (array). Hasilnya: ["branches", "list"].
  list: (filters: string) => [...branchKeys.lists(), { filters }] as const, // Digunakan untuk daftar yang memiliki filter spesifik (seperti pencarian). Hasilnya: ["branches", "list", { filters: "jakarta" }].
  details: () => [...branchKeys.all, "detail"] as const, // Kunci umum untuk semua data satuan (single object). Hasilnya: ["branches", "detail"].
  detail: (id: number) => [...branchKeys.details(), id] as const, // Kunci spesifik untuk satu branch berdasarkan ID-nya. Hasilnya: ["branches", "detail", 1].
  // Kata kunci as const dalam TypeScript memastikan bahwa nilai di dalam array bersifat read-only dan tipenya sangat spesifik (literal), bukan sekadar string[]
};

// queryKey adalah cara React Query mengetahui apa data tersebut, di mana menyimpannya, dan kapan harus memperbaruinya berdasarkan interaksi user atau perubahan variabel.

// Get all branches
export const useBranches = () => {
  return useQuery({
    queryKey: branchKeys.lists(),
    queryFn: branchService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get branch by ID
export const useBranch = (id: number) => {
  return useQuery({
    queryKey: branchKeys.detail(id),
    queryFn: () => branchService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create branch
export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBranchRequest) => branchService.create(data),
    onSuccess: () => {
      toast.success("Cabang berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Update branch
export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateBranchRequest>;
    }) => branchService.update(id, data),
    onSuccess: (updatedBranch) => {
      toast.success("Cabang berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      queryClient.setQueryData(
        branchKeys.detail(updatedBranch.id),
        updatedBranch,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Delete branch
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => branchService.delete(id),
    onSuccess: (_, deletedId) => {
      toast.success("Cabang berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      queryClient.removeQueries({
        queryKey: branchKeys.detail(deletedId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
