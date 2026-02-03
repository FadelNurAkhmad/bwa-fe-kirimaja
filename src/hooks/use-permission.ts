import { useAuth } from "./use-auth"; // Mengimpor data autentikasi untuk mendapatkan info user yang sedang login

/**
 * Hook kustom untuk mengelola logika pengecekan izin akses (RBAC - Role Based Access Control)
 */
export const usePermission = () => {
  // Mengambil data 'user' dari hook useAuth
  const { user } = useAuth();

  /**
   * PROSES 1: hasPermission
   * Memeriksa satu izin spesifik berdasarkan key (string).
   */
  const hasPermission = (permissionKey: string): boolean => {
    // Jika user tidak ada atau data role belum dimuat, akses ditolak (false)
    if (!user || !user.role) {
      return false;
    }

    // Melakukan pencarian di dalam array permissions milik user
    // Mengembalikan true jika ditemukan kecocokan antara key di server dan permissionKey yang diminta
    return (
      user.role.permissions?.some(
        (permission) => permission.key === permissionKey,
      ) || false
    );
  };

  /**
   * PROSES 2: hasAnyPermission
   * Digunakan jika kita butuh akses jika SALAH SATU dari daftar izin terpenuhi.
   * Contoh: User boleh masuk jika dia 'Admin' ATAU 'Manager'.
   */
  const hasAnyPermission = (permissionKeys: string[]): boolean => {
    // Menggunakan fungsi .some() untuk mencari setidaknya satu kecocokan
    return permissionKeys.some((key) => hasPermission(key));
  };

  /**
   * PROSES 3: hasAllPermissions
   * Digunakan jika user WAJIB memiliki SEMUA izin yang terdaftar.
   * Contoh: User harus punya izin 'Edit' DAN izin 'Publish'.
   */
  const hasAllPermissions = (permissionKeys: string[]): boolean => {
    // Menggunakan fungsi .every() untuk memastikan semua key terverifikasi
    return permissionKeys.every((key) => hasPermission(key));
  };

  // Mengembalikan ketiga fungsi tersebut agar bisa digunakan di komponen UI
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
