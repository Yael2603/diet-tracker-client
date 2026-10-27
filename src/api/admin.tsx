import { apiFetch } from "./client";
import type { User } from "../types/user";
import type { MealsDay } from "../types/meals";
import type { AdminUserRow, AdminUserDetails } from "../types/admin";

export const getUsers =(search:string)=>apiFetch<AdminUserRow[]>(`/api/admin/users?search=${encodeURIComponent(search)}`);
export const getUserDetails =(userId:number)=>apiFetch<AdminUserDetails>(`/api/admin/users/${userId}`);
export const setUserStatus =  (userId:number,isActive:boolean)=>apiFetch<User>(`/api/admin/users/${userId}/status`,{method:"PATCH",body:JSON.stringify({isActive})});
export const getUserMeals = (userId:number,date:string)=>apiFetch<MealsDay>(`/api/admin/users/${userId}/meals?date=${date}`);