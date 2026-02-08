import { Page } from "@/components/ui/page";
import { DataTable } from "./components/datatable";
import { createColumns } from "./components/datatable/columns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useRoles } from "@/hooks/use-role";
import { PermissionGuard, Skeleton } from "@/components";

export default function RolePage() {
  // Use custom meta hook
  useMeta(META_DATA.role);

  const [searchTerm, setSearchTerm] = useState("");

  const { data: roles, isLoading, error } = useRoles();
  // data: roles: Mengambil hasil dari server dan menamainya sebagai variabel roles.

  const filteredRoles =
    roles?.filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.permissions.some(
          (permission) =>
            permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            permission.key.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    ) || [];

  const columns = createColumns();

  if (error) {
    return (
      <PermissionGuard permission="permissions.manage">
        <Page title="Kelola Role 🔐🕵️">
          <Input
            type="text"
            placeholder="Cari Role (Nama, Key, Permission)"
            className="mb-4 w-full max-w-md bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <DataTable
              data={filteredRoles}
              columns={columns} // Pastikan variabel columns sudah didefinisikan
              title="Daftar Role"
            />
          )}
        </Page>
      </PermissionGuard>
    );
  }

  return (
    <>
      <Page title="Kelola Role 🔐👨‍💼">
        <Input
          type="text"
          placeholder="Cari Role (Nama, Key, Permission)"
          className="mb-4 w-full max-w-md bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DataTable data={filteredRoles} columns={columns} title="Daftar Role" />
        <Toaster position="top-right" />
      </Page>
    </>
  );
}
