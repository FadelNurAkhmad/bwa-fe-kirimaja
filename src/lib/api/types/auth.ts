// Authentication related types
import type { Permission } from "./role";

// export interface AuthLoginRequest {
//   email: string;
//   password: string;
// }

// export interface AuthRegisterRequest {
//   name: string;
//   email: string;
//   password: string;
//   phone_number: string;
// }

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  avatar?: string | null;
  created_at: string;
  updated_at: string;
}

// export interface AuthLoginResponse {
//   message: string;
//   data: {
//     access_token: string;
//     user: User;
//   };
// }

// export interface AuthRegisterResponse {
//   message: string;
//   data?: null;
// }

// Legacy types for backward compatibility (keeping old structure for compatibility)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface LoginResponse {
  access_token: string;
  // refresh_token?: string;
  // expires_in?: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    phone_number: string;
    role: {
      id: number;
      name: string;
      key: string;
      permissions: Permission[];
    };
  };
}
