import { type ReactNode } from "react";
import { usePermission } from "@/hooks/use-permission";

// Mendefinisikan struktur props untuk PermissionGuard
interface PermissionGuardProps {
  permission?: string; // Satu izin spesifik (misal: 'edit_post')
  permissions?: string[]; // Daftar izin (misal: ['admin', 'manager'])
  children: ReactNode; // Konten yang akan dilindungi
  fallback?: ReactNode; // Konten alternatif jika tidak punya izin (opsional)
}

export function PermissionGuard({
  permission,
  permissions,
  children,
  fallback = null, // Defaultnya tidak menampilkan apa-apa jika tidak ada izin
}: PermissionGuardProps) {
  // Mengambil fungsi pengecekan dari hook usePermission
  const { hasPermission, hasAnyPermission } = usePermission();

  // JIKA TIDAK ADA SYARAT: Langsung tampilkan konten (children)
  if (!permission && !permissions) {
    return <>{children}</>;
  }

  // JIKA ADA SYARAT SATU IZIN (permission):
  if (permission) {
    return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
  }

  // JIKA ADA SYARAT BANYAK IZIN (permissions):
  if (permissions) {
    // Tampilkan children jika user punya salah satu dari daftar izin tersebut
    return hasAnyPermission(permissions) ? <>{children}</> : <>{fallback}</>;
  }

  // Default fallback jika kondisi di atas tidak terpenuhi
  return <>{fallback}</>;
}
