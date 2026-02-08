/* eslint-disable @typescript-eslint/no-unused-vars */
import { handleAxiosError } from "@/lib/utils/error-handler";
import { apiClient } from "../axios";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types";
import type { AxiosErrorType } from "@/lib/utils/api-error-types";

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        request,
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosErrorType);
      throw new Error(errorMessage);
    }
  },

  // Menghapus data sesi dari storage
  async logout(): Promise<void> {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  // Mengambil data user yang sedang login dari storage
  // async getCurrentUser(): Promise<LoginResponse["user"]> {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) {
  //     throw new Error("User not authenticated");
  //   }

  //   const user = localStorage.getItem("user");
  //   if (!user) {
  //     throw new Error("User not found");
  //   }

  //   return JSON.parse(user);
  // },

  async getCurrentUser(): Promise<LoginResponse["user"]> {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No token found");

    const userData = localStorage.getItem("user");
    if (!userData) throw new Error("No user data found");

    try {
      const parsedUser = JSON.parse(userData);
      // Validasi tambahan untuk memastikan role ada
      if (!parsedUser.role) {
        console.warn("Role data is missing in stored user object");
      }
      return parsedUser;
    } catch (e) {
      throw new Error("Failed to parse user data");
    }
  },

  async register(request: RegisterRequest): Promise<LoginResponse> {
    try {
      // Mengirim permintaan POST ke endpoint /auth/register
      const response = await apiClient.post<LoginResponse>(
        "/auth/register",
        request,
      );

      // Mengembalikan data hasil respon dari server
      return response.data;
    } catch (error) {
      // Menangani error axios menggunakan helper fungsi kustom
      const errorMessage = handleAxiosError(error as AxiosErrorType);

      // Melemparkan kembali error dalam bentuk pesan string
      throw new Error(errorMessage);
    }
  },
};

/**
 * tokenService: Khusus mengelola penyimpanan access_token.
 */
export const tokenService = {
  // Mengambil token untuk disertakan dalam Header API (Bearer Token)
  getToken(): string | null {
    return localStorage.getItem("access_token");
  },
  // Menyimpan token baru setelah login berhasil
  setToken(token: string): void {
    localStorage.setItem("access_token", token);
  },
  // Menghapus token saat logout
  removeToken(): void {
    localStorage.removeItem("access_token");
  },
  // Mengecek apakah user sudah login atau belum berdasarkan keberadaan token
  isAuthenticated(): boolean {
    const token = this.getToken();
    return Boolean(token);
  },
};

/**
 * userService: Khusus mengelola penyimpanan profil User.
 */
export const userService = {
  // Mengambil data profil user dari storage
  getUser(): LoginResponse["user"] | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  // Menyimpan data profil user (biasanya disimpan bersamaan dengan token)
  setUser(user: LoginResponse["user"]): void {
    localStorage.setItem("user", JSON.stringify(user)); // Objek harus di-string agar bisa disimpan
  },
  // Menghapus data user saat logout
  removeUser(): void {
    localStorage.removeItem("user");
  },
};
