import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { usePermission } from "@/hooks/use-permission";

// Mendefinisikan tipe data untuk props komponen AuthGuard
interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // Opsional: menentukan apakah halaman butuh login atau justru butuh tamu (guest)
  permission?: string; // Opsional: izin spesifik yang dibutuhkan untuk mengakses halaman
  permissions?: string[]; // Opsional: daftar izin yang salah satunya harus dimiliki user untuk mengakses halaman
  redirectTo?: string; // Opsional: URL tujuan redirect jika tidak memenuhi syarat autentikasi/izin
}

export const AuthGuard = ({
  children,
  requireAuth = true,
  permission,
  permissions,
  redirectTo = "dashboard",
}: AuthGuardProps) => {
  // Mengambil status autentikasi dan status loading dari custom hook useAuth
  const { isAuthenticated, isLoadingUser } = useAuth();
  const { hasPermission, hasAnyPermission } = usePermission();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingUser) {
      if (requireAuth && !isAuthenticated) {
        navigate("/auth/login");
      } else if (!requireAuth && isAuthenticated) {
        navigate("/dashboard");
      } else if (isAuthenticated && (permission || permissions)) {
        let hasAccess = false;
        if (permission) {
          hasAccess = hasPermission(permission);
        } else if (permissions) {
          hasAccess = hasAnyPermission(permissions);
        }

        if (!hasAccess) {
          navigate(redirectTo);
        }
      }
    }
  }, [
    isAuthenticated,
    isLoadingUser,
    requireAuth,
    navigate,
    permission,
    permissions,
    hasPermission,
    hasAnyPermission,
    redirectTo,
  ]);

  /* REDIREKSI VISUAL (Mencegah 'flicker' konten)
     Bagian di bawah ini memastikan konten (children) tidak dirender 
     sebelum navigasi/redireksi di atas diproses.
  */

  // Jika butuh login tapi tidak terautentikasi, jangan tampilkan apa-apa
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Jika butuh tamu tapi sudah terautentikasi, jangan tampilkan apa-apa
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  if (isAuthenticated && (permission || permissions)) {
    let hasAccess = false;

    if (permission) {
      hasAccess = hasPermission(permission);
    } else if (permissions) {
      hasAccess = hasAnyPermission(permissions);
    }

    if (!hasAccess) {
      return null;
    }
  }

  // Jika semua kondisi terpenuhi, tampilkan konten halaman (children)
  return <>{children}</>;
};
