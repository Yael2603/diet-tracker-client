import { apiFetch } from "./client";
import type { FoodItemProps, FoodData } from "../types/track";

export const searchFood = (search: string) =>apiFetch<FoodItemProps[]>(`/api/foods?search=${encodeURIComponent(search)}`);

export const getFoods = (search: string, category: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    return apiFetch<FoodItemProps[]>(`/api/foods?${params.toString()}`);
};

export const createFood = (data: FoodData) =>
    apiFetch<FoodItemProps>("/api/foods", { method: "POST", body: JSON.stringify(data) });

export const updateFood = (id: number, data: FoodData) =>
    apiFetch<FoodItemProps>(`/api/foods/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const setFoodStatus = (id: number, isActive: boolean) =>
    apiFetch<FoodItemProps>(`/api/foods/${id}/status`, { method: "PATCH", body: JSON.stringify({ isActive }) });
