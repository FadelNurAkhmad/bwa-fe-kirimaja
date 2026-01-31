import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authService,
  tokenService,
  userService,
} from "@/lib/api/services/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { LoginRequest } from "@/lib/api";

/**
 * useAuth: Custom hook untuk mengelola seluruh status login/logout aplikasi.
 * Menghubungkan UI dengan server melalui React Query untuk manajemen state yang efisien.
 */
export const useAuth = () => {
  const queryClient = useQueryClient(); // Digunakan untuk memanipulasi cache data global
  const navigate = useNavigate(); // Digunakan untuk perpindahan halaman (redirect)

  /**
   * 1. GET CURRENT USER QUERY
   * Fungsi: Mengambil data profil user yang sedang login.
   * queryKey ["auth", "user"] digunakan sebagai identitas data di dalam cache.
   */
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: authService.getCurrentUser, // Memanggil fungsi dari service untuk baca storage
    staleTime: 5 * 60 * 1000, // Data dianggap segar selama 5 menit
    gcTime: 10 * 60 * 1000, // Data dihapus dari memori jika tidak dipakai selama 10 menit
  });

  /**
   * 2. LOGIN MUTATION
   * Fungsi: Menangani proses pengiriman data login ke server.
   */
  const loginMutation = useMutation({
    mutationFn: authService.login, // Menjalankan request POST ke /auth/login

    // Dijalankan jika API berhasil merespon
    onSuccess: (data) => {
      // Validasi apakah response memiliki token dan data user yang lengkap
      if (!data?.access_token || !data?.user) {
        toast.error("Response tidak valid dari server");
        return;
      }

      // Menyimpan data sesi ke LocalStorage agar login tetap bertahan saat refresh
      tokenService.setToken(data.access_token);
      userService.setUser(data.user);

      // Memperbarui data user di cache React Query secara instan tanpa perlu refresh halaman
      queryClient.setQueryData(["auth", "user"], data.user);

      toast.success("Login berhasil!");
      navigate("/dashboard"); // Redirect user ke halaman dashboard
    },

    // Dijalankan jika terjadi error (misal: password salah atau server mati)
    onError: (error: Error) => {
      // Menampilkan pesan error yang sudah diproses oleh error-handler
      const errorMessage = error.message || "Login gagal. Silakan coba lagi.";
      toast.error(errorMessage);

      // Bersihkan sisa data sesi jika terjadi kegagalan sistem
      tokenService.removeToken();
      userService.removeUser();
      queryClient.setQueryData(["auth", "user"], null);
    },
  });

  /**
   * 3. LOGOUT MUTATION
   * Fungsi: Menghapus seluruh data identitas user dari aplikasi.
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.logout(); // Menghapus data di level service
      tokenService.removeToken(); // Menghapus token dari storage
      userService.removeUser(); // Menghapus objek user dari storage
      queryClient.clear(); // Menghapus seluruh cache agar data sensitif hilang
      return true;
    },
    onSuccess: () => {
      navigate("/auth/login"); // Kembali ke halaman login setelah berhasil keluar
    },
    onError: () => {
      toast.error("Logout gagal. Silakan coba lagi.");
    },
  });

  /**
   * 4. HELPER PROPERTIES & FUNCTIONS
   * Properti ini akan dikonsumsi oleh komponen (misal: Login Page).
   */
  const login = (credentials: LoginRequest) =>
    loginMutation.mutate(credentials);
  const logout = () => logoutMutation.mutate();

  // Mengecek apakah user terverifikasi (punya data user di memori DAN token di storage)
  const isAuthenticated = !!user && !!tokenService.getToken();

  return {
    user, // Data profil user (id, nama, email, dll)
    isLoadingUser, // Status saat aplikasi sedang mengecek sesi user
    isAuthenticated, // Status boolean login
    login, // Fungsi untuk dipanggil saat tombol login diklik
    logout, // Fungsi untuk dipanggil saat tombol logout diklik
    isLoggingIn: loginMutation.isPending, // Digunakan untuk menampilkan loading spinner pada tombol
    isLoggingOut: logoutMutation.isPending, // Digunakan untuk status loading saat keluar
  };
};
