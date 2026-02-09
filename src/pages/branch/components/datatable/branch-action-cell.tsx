import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteBranch } from "@/hooks/use-branch";
import type { Branch } from "@/lib/api/types/branch";
import { PermissionGuard } from "@/components";
// Impor EditBranchModal jika ada di file terpisah
// import { EditBranchModal } from "./edit-branch-modal";

interface BranchActionCellProps {
  branch: Branch;
  onDataChange?: () => void;
}

export function BranchActionCell({
  branch,
  onDataChange,
}: BranchActionCellProps) {
  const deleteBranchMutation = useDeleteBranch();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteBranchMutation.mutateAsync(branch.id);
      setIsDeleteDialogOpen(false);
      onDataChange?.();
    } catch (error) {
      console.error("Error deleting branch:", error);
      // Error sudah ditangani oleh toast di use-branch hook
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Bagian Edit Branch */}
      <PermissionGuard permission="branches.update">
        {/* Asumsi komponen modal edit ada di sini */}
        {/* <EditBranchModal branch={branch} onBranchUpdated={onDataChange} /> */}
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </PermissionGuard>

      {/* Bagian Hapus Branch */}
      <PermissionGuard permission="branches.delete">
        {/* boolean = true jika dialog terbuka */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" className="rounded-lg">
              Hapus
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus cabang "
                <span className="font-semibold">{branch.name}</span>"? Tindakan
                ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteBranchMutation.isPending}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteBranchMutation.isPending}
              >
                {deleteBranchMutation.isPending ? "Menghapus..." : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PermissionGuard>
    </div>
  );
}
