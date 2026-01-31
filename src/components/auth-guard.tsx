import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

// Mendefinisikan tipe data untuk props komponen AuthGuard
interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // Opsional: menentukan apakah halaman butuh login atau justru butuh tamu (guest)
}

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  // Mengambil status autentikasi dan status loading dari custom hook useAuth
  const { isAuthenticated, isLoadingUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Jalankan pengecekan hanya jika proses loading user sudah selesai
    if (!isLoadingUser) {
      // Jika halaman butuh login (requireAuth) tapi user belum login
      if (requireAuth && !isAuthenticated) {
        navigate("/auth/login");
      }
      // Jika halaman butuh tamu (!requireAuth) tapi user sudah login (misal: halaman login)
      else if (!requireAuth && isAuthenticated) {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isLoadingUser, requireAuth, navigate]);

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

  // Jika semua kondisi terpenuhi, tampilkan konten halaman (children)
  return <>{children}</>;
};
