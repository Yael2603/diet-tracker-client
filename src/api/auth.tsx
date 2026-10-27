import { apiFetch } from "./client";
import type { User, AuthResponse, RegisterData, LoginData } from "../types/user";

export const login =  (data: LoginData) => apiFetch<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(data), });
export const register =  (data: RegisterData) => apiFetch<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(data), });
export const getMe =  () => apiFetch<User>("/api/auth/me");
