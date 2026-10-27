import type { Role } from "./common";

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  heightCm: number | null;
  startWeightKg: number | null;
  targetWeightKg: number | null;
  birthDate: string | null;
  shareWithDietitian: boolean;
  trackId: number | null;
  menuId: number | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}
