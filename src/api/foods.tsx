import { apiFetch } from "./client";
import type { FoodItemProps } from "../types/track";

export const searchFood = (search: string) =>apiFetch<FoodItemProps[]>(`/api/foods/search?=${encodeURIComponent(search)}`);